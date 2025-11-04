const mongoose = require('mongoose');

const packSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  image: {
    type: String,
    required: true
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
    default: 'Bundle',
    trim: true
  },
  itemsIncluded: {
    type: [String],
    required: true
  },
  bestSeller: {
    type: Boolean,
    default: false
  },
  description: {
    type: String,
    trim: true
  },
  inStock: {
    type: Boolean,
    default: true
  },
  productType: {
    type: String,
    enum: ['product', 'pack'],
    default: 'pack'
  },
  multipleImages: {
    type: [String],
    default: []
  },
  contentSections: {
    type: [{
      image: String,
      description: String
    }],
    default: []
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Pack', packSchema);

