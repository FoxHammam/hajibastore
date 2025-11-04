const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Product = require('../models/Product');

// POST create new order
router.post('/', async (req, res) => {
  try {
    console.log('Order request body received:', JSON.stringify(req.body, null, 2));
    
    const { fullName, phone, city, address, productId, notes } = req.body;

    // Validate required fields with detailed messages
    const missingFields = [];
    if (!fullName || !fullName.trim()) missingFields.push('fullName');
    if (!phone || !phone.trim()) missingFields.push('phone');
    if (!city || !city.trim()) missingFields.push('city');
    if (!address || !address.trim()) missingFields.push('address');
    if (!productId) missingFields.push('productId');

    if (missingFields.length > 0) {
      console.log('Validation failed: Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Please provide all required fields. Missing: ${missingFields.join(', ')}`
      });
    }

    // Validate productId format (MongoDB ObjectId)
    if (!/^[0-9a-fA-F]{24}$/.test(productId)) {
      console.log('Invalid productId format:', productId);
      return res.status(400).json({
        success: false,
        message: 'Invalid product ID format'
      });
    }

    // Get product details
    console.log('Looking for product with ID:', productId);
    const product = await Product.findById(productId);
    
    if (!product) {
      console.log('Product not found:', productId);
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    console.log('Product found:', { id: product._id, name: product.name, inStock: product.inStock });

    if (!product.inStock) {
      console.log('Product out of stock:', productId);
      return res.status(400).json({
        success: false,
        message: 'Product is out of stock'
      });
    }

    // Create new order
    const orderData = {
      fullName: fullName.trim(),
      phone: phone.trim(),
      city: city.trim(),
      address: address.trim(),
      productId: product._id,
      productName: product.name,
      productPrice: product.price,
      totalAmount: product.price,
      notes: (notes || '').trim()
    };

    console.log('Creating order with data:', orderData);

    const order = new Order(orderData);

    await order.save();
    console.log('Order created successfully:', order._id);

    res.status(201).json({
      success: true,
      message: 'Order created successfully',
      data: order
    });
  } catch (error) {
    console.error('Error creating order - Full error:', error);
    console.error('Error stack:', error.stack);
    
    // More detailed error response
    res.status(500).json({
      success: false,
      message: 'Error creating order',
      error: error.message,
      details: process.env.NODE_ENV === 'development' ? error.stack : undefined
    });
  }
});

// GET all orders (for admin)
router.get('/', async (req, res) => {
  try {
    const orders = await Order.find().populate('productId').sort({ createdAt: -1 });
    res.json({
      success: true,
      count: orders.length,
      data: orders
    });
  } catch (error) {
    console.error('Error fetching orders:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching orders',
      error: error.message
    });
  }
});

// GET single order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('productId');
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }
    
    res.json({
      success: true,
      data: order
    });
  } catch (error) {
    console.error('Error fetching order:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching order',
      error: error.message
    });
  }
});

// PUT update order status
router.put('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const validStatuses = ['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled'];
    
    if (!status || !validStatuses.includes(status)) {
      return res.status(400).json({
        success: false,
        message: `Invalid status. Must be one of: ${validStatuses.join(', ')}`
      });
    }

    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      message: 'Order status updated successfully',
      data: order
    });
  } catch (error) {
    console.error('Error updating order status:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating order status',
      error: error.message
    });
  }
});

// DELETE order
router.delete('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);
    
    if (!order) {
      return res.status(404).json({
        success: false,
        message: 'Order not found'
      });
    }

    await Order.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Order deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting order:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting order',
      error: error.message
    });
  }
});

module.exports = router;

