const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Pack = require('../models/Pack');

// GET all products
router.get('/', async (req, res) => {
  try {
    // If admin=true, return all products (including out of stock)
    const query = req.query.admin === 'true' ? {} : { inStock: true };
    const products = await Product.find(query).sort({ createdAt: -1 });
    
    // Add productType to each product for frontend
    const productsWithType = products.map(p => ({
      ...p.toObject(),
      productType: 'product'
    }));
    
    res.json({
      success: true,
      count: productsWithType.length,
      data: productsWithType
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

// GET best seller products
router.get('/filter/bestsellers', async (req, res) => {
  try {
    const products = await Product.find({ bestSeller: true, inStock: true }).limit(8);
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

// POST create new product or pack
router.post('/', async (req, res) => {
  try {
    const { productType, ...data } = req.body;

    console.log('Creating product/pack with data:', {
      productType,
      name: data.name,
      multipleImagesCount: data.multipleImages?.length || 0,
      contentSectionsCount: data.contentSections?.length || 0,
      multipleImages: data.multipleImages,
      contentSections: data.contentSections
    });

    // Validate required fields
    if (!data.name || !data.image || !data.price || !data.category) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields: name, image, price, category'
      });
    }

    if (productType === 'pack') {
      // Validate pack-specific fields
      if (!data.itemsIncluded || data.itemsIncluded.length === 0) {
        return res.status(400).json({
          success: false,
          message: 'Pack must have at least one item included'
        });
      }

      // Ensure productType is set
      const packData = {
        ...data,
        productType: 'pack',
        multipleImages: data.multipleImages || [],
        contentSections: data.contentSections || []
      };
      
      console.log('Creating pack with data:', {
        name: packData.name,
        multipleImages: packData.multipleImages,
        contentSections: packData.contentSections
      });
      
      const pack = new Pack(packData);
      await pack.save();
      
      console.log('Pack created successfully:', {
        id: pack._id,
        name: pack.name,
        multipleImages: pack.multipleImages,
        contentSections: pack.contentSections
      });
      
      res.status(201).json({
        success: true,
        message: 'Pack created successfully',
        data: pack
      });
    } else {
      // Create product - ensure productType is set
      const productData = {
        ...data,
        productType: 'product',
        multipleImages: data.multipleImages || [],
        contentSections: data.contentSections || []
      };
      
      console.log('Creating product with data:', {
        name: productData.name,
        multipleImages: productData.multipleImages,
        contentSections: productData.contentSections
      });
      
      const product = new Product(productData);
      await product.save();
      
      console.log('Product created successfully:', {
        id: product._id,
        name: product.name,
        multipleImages: product.multipleImages,
        contentSections: product.contentSections
      });
      
      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product
      });
    }
  } catch (error) {
    console.error('Error creating product:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating product',
      error: error.message
    });
  }
});

// PUT update product or pack
router.put('/:id', async (req, res) => {
  try {
    const { productType, ...data } = req.body;

    // Determine which model to use based on productType or existing document
    let ProductModel = Product;
    let item = await Product.findById(req.params.id);
    
    // If not found in Product, check Pack
    if (!item) {
      item = await Pack.findById(req.params.id);
      ProductModel = Pack;
    }

    if (!item) {
      return res.status(404).json({
        success: false,
        message: 'Product or Pack not found'
      });
    }

    // If productType is specified and different from current type, need to migrate
    if (productType && productType === 'pack' && ProductModel === Product) {
      // Convert Product to Pack
      const packData = {
        ...data,
        itemsIncluded: data.itemsIncluded || [],
      };
      const newPack = new Pack(packData);
      await newPack.save();
      await Product.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        message: 'Product converted to Pack successfully',
        data: newPack
      });
    } else if (productType && productType === 'product' && ProductModel === Pack) {
      // Convert Pack to Product
      const productData = { ...data };
      delete productData.itemsIncluded;
      const newProduct = new Product(productData);
      await newProduct.save();
      await Pack.findByIdAndDelete(req.params.id);
      return res.json({
        success: true,
        message: 'Pack converted to Product successfully',
        data: newProduct
      });
    }

    // Update existing document
    Object.keys(data).forEach(key => {
      if (data[key] !== undefined) {
        item[key] = data[key];
      }
    });
    
    // Explicitly ensure multipleImages and contentSections are set
    if (data.multipleImages !== undefined) {
      item.multipleImages = Array.isArray(data.multipleImages) ? data.multipleImages : [];
    }
    if (data.contentSections !== undefined) {
      item.contentSections = Array.isArray(data.contentSections) ? data.contentSections : [];
    }

    console.log('Updating item with:', {
      id: item._id,
      name: item.name,
      multipleImagesCount: item.multipleImages?.length || 0,
      contentSectionsCount: item.contentSections?.length || 0
    });

    await item.save();
    
    console.log('Item updated successfully:', {
      id: item._id,
      name: item.name,
      multipleImages: item.multipleImages,
      contentSections: item.contentSections
    });

    res.json({
      success: true,
      message: 'Item updated successfully',
      data: item
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

// DELETE product or pack
router.delete('/:id', async (req, res) => {
  try {
    let item = await Product.findById(req.params.id);
    
    if (item) {
      await Product.findByIdAndDelete(req.params.id);
    } else {
      item = await Pack.findById(req.params.id);
      if (item) {
        await Pack.findByIdAndDelete(req.params.id);
      } else {
        return res.status(404).json({
          success: false,
          message: 'Product or Pack not found'
        });
      }
    }

    res.json({
      success: true,
      message: 'Item deleted successfully'
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

