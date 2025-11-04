const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  productType: {
    type: String,
    enum: ['product', 'pack'],
    default: 'product'
  },
  image: {
    type: String,
    required: true
  },
  multipleImages: {
    type: [String],
    default: []
  },
  price: {
    type: Number,
    required: true,
    min: 0
  },
  oldPrice: {
    type: Number,
    min: 0
  },
  category: {
    type: String,
    required: true,
    trim: true
  },
  size: {
    type: [String],
    default: []
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  contentSections: {
    type: [{
      image: String,
      description: String
    }],
    default: []
  },
  inStock: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Product', productSchema);

