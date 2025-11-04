const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// GET all packs (products with productType='pack')
router.get('/', async (req, res) => {
  try {
    // Show all in-stock packs for public, all packs for admin
    const isAdmin = req.query.admin === 'true';
    const query = isAdmin ? { productType: 'pack' } : { productType: 'pack', inStock: true };
    const packs = await Product.find(query).sort({ createdAt: -1 });
    console.log(`Fetched ${packs.length} packs from database (admin: ${isAdmin}, query:`, JSON.stringify(query), ')');
    
    // Also log total packs count for debugging
    const totalPacks = await Product.countDocuments({ productType: 'pack' });
    const inStockCount = await Product.countDocuments({ productType: 'pack', inStock: true });
    console.log(`Total packs in DB: ${totalPacks}, In-stock: ${inStockCount}`);
    
    res.json({
      success: true,
      count: packs.length,
      data: packs
    });
  } catch (error) {
    console.error('Error fetching packs:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching packs',
      error: error.message
    });
  }
});

// GET single pack by ID
router.get('/:id', async (req, res) => {
  try {
    const pack = await Product.findOne({ _id: req.params.id, productType: 'pack' });
    
    if (!pack) {
      return res.status(404).json({
        success: false,
        message: 'Pack not found'
      });
    }
    
    res.json({
      success: true,
      data: pack
    });
  } catch (error) {
    console.error('Error fetching pack:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching pack',
      error: error.message
    });
  }
});

module.exports = router;

