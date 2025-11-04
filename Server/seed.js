const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');
const Pack = require('./models/Pack');

dotenv.config();

// Sample Products Data
const products = [
  {
    name: "Premium Cotton T-Shirt",
    image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 29.99,
    oldPrice: 39.99,
    category: "Clothing",
    size: ["S", "M", "L", "XL"],
    bestSeller: true
  },
  {
    name: "Classic Denim Jeans",
    image: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 79.99,
    oldPrice: 99.99,
    category: "Clothing",
    size: ["28", "30", "32", "34", "36"],
    bestSeller: true
  },
  {
    name: "Wireless Bluetooth Headphones",
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 149.99,
    oldPrice: 199.99,
    category: "Electronics",
    size: ["One Size"],
    bestSeller: false
  },
  {
    name: "Leather Crossbody Bag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 89.99,
    oldPrice: 129.99,
    category: "Accessories",
    size: ["One Size"],
    bestSeller: true
  },
  {
    name: "Running Sneakers",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 119.99,
    oldPrice: 149.99,
    category: "Shoes",
    size: ["7", "8", "9", "10", "11", "12"],
    bestSeller: false
  },
  {
    name: "Smart Watch Series 5",
    image: "https://images.unsplash.com/photo-1523275335684-37898b6baf30?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 299.99,
    oldPrice: 399.99,
    category: "Electronics",
    size: ["38mm", "42mm"],
    bestSeller: true
  },
  {
    name: "Organic Cotton Hoodie",
    image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 69.99,
    oldPrice: 89.99,
    category: "Clothing",
    size: ["S", "M", "L", "XL"],
    bestSeller: false
  },
  {
    name: "Vintage Sunglasses",
    image: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 45.99,
    oldPrice: 65.99,
    category: "Accessories",
    size: ["One Size"],
    bestSeller: true
  },
  {
    name: "Gaming Mechanical Keyboard",
    image: "https://images.unsplash.com/photo-1541140532154-b024d705b90a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 129.99,
    oldPrice: 179.99,
    category: "Electronics",
    size: ["Full Size"],
    bestSeller: false
  },
  {
    name: "Luxury Wool Scarf",
    image: "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 59.99,
    oldPrice: 79.99,
    category: "Accessories",
    size: ["One Size"],
    bestSeller: true
  },
  {
    name: "High-Performance Laptop",
    image: "https://images.unsplash.com/photo-1496181133206-80ce9b88a853?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 1299.99,
    oldPrice: 1599.99,
    category: "Electronics",
    size: ["13-inch", "15-inch"],
    bestSeller: true
  },
  {
    name: "Casual Canvas Sneakers",
    image: "https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 79.99,
    oldPrice: 99.99,
    category: "Shoes",
    size: ["7", "8", "9", "10", "11"],
    bestSeller: false
  },
  {
    name: "Designer Handbag",
    image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 199.99,
    oldPrice: 299.99,
    category: "Accessories",
    size: ["One Size"],
    bestSeller: true
  },
  {
    name: "Fitness Tracker Band",
    image: "https://images.unsplash.com/photo-1575311373937-040b8e1fd5b6?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 89.99,
    oldPrice: 119.99,
    category: "Electronics",
    size: ["Small", "Medium", "Large"],
    bestSeller: false
  },
  {
    name: "Premium Leather Jacket",
    image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 299.99,
    oldPrice: 399.99,
    category: "Clothing",
    size: ["S", "M", "L", "XL"],
    bestSeller: true
  },
  {
    name: "Wireless Mouse",
    image: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 39.99,
    oldPrice: 59.99,
    category: "Electronics",
    size: ["One Size"],
    bestSeller: false
  },
  {
    name: "Summer Dress",
    image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 49.99,
    oldPrice: 69.99,
    category: "Clothing",
    size: ["XS", "S", "M", "L"],
    bestSeller: true
  },
  {
    name: "Professional Camera",
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 899.99,
    oldPrice: 1199.99,
    category: "Electronics",
    size: ["Body Only", "With Lens"],
    bestSeller: false
  },
  {
    name: "Elegant Pearl Necklace",
    image: "https://images.unsplash.com/photo-1515562141207-7a88fb7ce338?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 149.99,
    oldPrice: 199.99,
    category: "Accessories",
    size: ["16 inches", "18 inches", "20 inches"],
    bestSeller: true
  },
  {
    name: "Comfortable Slip-On Shoes",
    image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?ixlib=rb-4.0.3&auto=format&fit=crop&w=500&q=80",
    price: 89.99,
    oldPrice: 119.99,
    category: "Shoes",
    size: ["7", "8", "9", "10", "11", "12"],
    bestSeller: false
  }
];

// Sample Packs Data
const packs = [
  {
    name: 'Starter Outfit Pack',
    image: 'https://images.unsplash.com/photo-1520975916090-3105956dac38?q=80&w=1200&auto=format&fit=crop',
    price: 99.99,
    oldPrice: 139.99,
    category: 'Bundle',
    itemsIncluded: ['T-Shirt', 'Jeans', 'Sneakers'],
    bestSeller: true
  },
  {
    name: 'Office Essentials Pack',
    image: 'https://images.unsplash.com/photo-1516251193007-45ef944ab0c6?q=80&w=1200&auto=format&fit=crop',
    price: 189.99,
    oldPrice: 259.99,
    category: 'Bundle',
    itemsIncluded: ['Shirt', 'Trousers', 'Leather Belt'],
    bestSeller: true
  },
  {
    name: 'Fitness Starter Pack',
    image: 'https://images.unsplash.com/photo-1605296867304-46d5465a13f1?q=80&w=1200&auto=format&fit=crop',
    price: 149.99,
    oldPrice: 199.99,
    category: 'Bundle',
    itemsIncluded: ['Fitness Tracker', 'Water Bottle', 'Gym Towel'],
    bestSeller: false
  },
  {
    name: 'Travel Comfort Pack',
    image: 'https://images.unsplash.com/photo-1458407998757-5ad4d27b359c?q=80&w=1200&auto=format&fit=crop',
    price: 129.99,
    oldPrice: 179.99,
    category: 'Bundle',
    itemsIncluded: ['Backpack', 'Neck Pillow', 'Eye Mask'],
    bestSeller: true
  },
  {
    name: 'Creative Desk Pack',
    image: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?q=80&w=1200&auto=format&fit=crop',
    price: 169.99,
    oldPrice: 219.99,
    category: 'Bundle',
    itemsIncluded: ['Mechanical Keyboard', 'Wireless Mouse', 'Desk Mat'],
    bestSeller: false
  },
  {
    name: 'Weekend Getaway Pack',
    image: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?q=80&w=1200&auto=format&fit=crop',
    price: 119.99,
    oldPrice: 169.99,
    category: 'Bundle',
    itemsIncluded: ['Casual Shirt', 'Shorts', 'Sunglasses'],
    bestSeller: false
  },
  {
    name: 'Creator Video Pack',
    image: 'https://images.unsplash.com/photo-1510511459019-5dda7724fd87?q=80&w=1200&auto=format&fit=crop',
    price: 299.99,
    oldPrice: 379.99,
    category: 'Bundle',
    itemsIncluded: ['Ring Light', 'Microphone', 'Tripod'],
    bestSeller: true
  }
];

const seedDatabase = async () => {
  try {
    // Connect to MongoDB
    await mongoose.connect(process.env.MONGO_URL);
    console.log('Connected to MongoDB');

    // Clear existing data
    await Product.deleteMany({});
    await Pack.deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await Product.insertMany(products);
    console.log(`${products.length} products seeded`);

    await Pack.insertMany(packs);
    console.log(`${packs.length} packs seeded`);

    console.log('✅ Database seeded successfully!');
    process.exit(0);
  } catch (error) {
    console.error('Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();

