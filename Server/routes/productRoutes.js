const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all products
// If admin=true query param, return all products. Otherwise only in-stock products
// Always exclude packs (productType='pack') from products endpoint
router.get('/', async (req, res) => {
  try {
    const isAdmin = req.query.admin === 'true';
    const query = isAdmin 
      ? { productType: { $ne: 'pack' } } // Exclude packs for admin too on products endpoint
      : { inStock: true, productType: { $ne: 'pack' } }; // Exclude packs and only in-stock
    const products = await Product.find(query).sort({ createdAt: -1 });
    console.log(`Fetched ${products.length} products from database (admin: ${isAdmin}, excluding packs)`);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching products:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching products',
      error: error.message
    });
  }
});

// GET single product by ID
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    
    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }
    
    res.json({
      success: true,
      data: product
    });
  } catch (error) {
    console.error('Error fetching product:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching product',
      error: error.message
    });
  }
});

// GET best seller products (excluding packs)
router.get('/filter/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ 
      bestSeller: true, 
      inStock: true,
      productType: { $ne: 'pack' } // Exclude packs
    }).limit(8);
    res.json({
      success: true,
      count: products.length,
      data: products
    });
  } catch (error) {
    console.error('Error fetching best sellers:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching best sellers',
      error: error.message
    });
  }
});

// POST create new product (admin only)
router.post('/', async (req, res) => {
  try {
    const { name, productType, image, multipleImages, price, oldPrice, category, size, bestSeller, description, contentSections, inStock } = req.body;

    // Validate required fields
    if (!name || !image || !price || !category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide name, image, price, and category'
      });
    }

    const product = new Product({
      name: name.trim(),
      productType: productType || 'product',
      image: image.trim(),
      multipleImages: Array.isArray(multipleImages) ? multipleImages : [],
      price: parseFloat(price),
      oldPrice: oldPrice ? parseFloat(oldPrice) : undefined,
      category: category.trim(),
      size: Array.isArray(size) ? size : [],
      bestSeller: bestSeller || false,
      description: description ? description.trim() : '',
      contentSections: Array.isArray(contentSections) ? contentSections : [],
      inStock: inStock !== undefined ? inStock : true
    });

    await product.save();

    res.status(201).json({
      success: true,
      message: 'Product created successfully',
      data: product
    });
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// PUT update product (admin only)
router.put('/:id', async (req, res) => {
  try {
    const { name, productType, image, multipleImages, price, oldPrice, category, size, bestSeller, description, contentSections, inStock } = req.body;

    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    // Update fields
    if (name) product.name = name.trim();
    if (productType) product.productType = productType;
    if (image) product.image = image.trim();
    if (multipleImages !== undefined) product.multipleImages = Array.isArray(multipleImages) ? multipleImages : [];
    if (price !== undefined) product.price = parseFloat(price);
    if (oldPrice !== undefined) product.oldPrice = oldPrice ? parseFloat(oldPrice) : undefined;
    if (category) product.category = category.trim();
    if (size !== undefined) product.size = Array.isArray(size) ? size : [];
    if (bestSeller !== undefined) product.bestSeller = bestSeller;
    if (description !== undefined) product.description = description.trim();
    if (contentSections !== undefined) product.contentSections = Array.isArray(contentSections) ? contentSections : [];
    if (inStock !== undefined) product.inStock = inStock;

    await product.save();

    res.json({
      success: true,
      message: 'Product updated successfully',
      data: product
    });
  } catch (error) {
    console.error('Error updating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating product',
      error: error.message
    });
  }
});

// DELETE product (admin only)
router.delete('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: 'Product not found'
      });
    }

    await Product.findByIdAndDelete(req.params.id);

    res.json({
      success: true,
      message: 'Product deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting product',
      error: error.message
    });
  }
});

module.exports = router;

