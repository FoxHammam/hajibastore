const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testLogin = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hammam-ecom');
    console.log('✅ Connected to MongoDB');

    const username = 'admin';
    const password = 'admin123';

    // Find user
    const user = await User.findOne({ 
      $or: [
        { username },
        { email: username }
      ],
      isActive: true
    });

    if (!user) {
      console.log('❌ User not found!');
      process.exit(1);
    }

    console.log('✅ User found:', {
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    // Test password
    const isPasswordValid = await user.comparePassword(password);
    
    if (isPasswordValid) {
      console.log('✅ Password is valid!');
    } else {
      console.log('❌ Password is invalid!');
      console.log('Hashed password in DB:', user.password.substring(0, 20) + '...');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
};

testLogin();

