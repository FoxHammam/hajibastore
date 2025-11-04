const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('./models/User');

dotenv.config();

const testPassword = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hammam-ecom');
    console.log('✅ Connected to MongoDB:', conn.connection.host);
    console.log('Database:', conn.connection.name);

    // Find admin user
    const user = await User.findOne({ username: 'admin' });
    
    if (!user) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...');
      
      const newAdmin = await User.create({
        username: 'admin',
        email: 'admin@hammam.com',
        password: 'admin123',
        role: 'admin',
        isActive: true
      });
      
      console.log('✅ Admin user created:', newAdmin.username);
      process.exit(0);
    }

    console.log('✅ Admin user found:', {
      username: user.username,
      email: user.email,
      role: user.role,
      isActive: user.isActive
    });

    // Test password
    console.log('\n🔐 Testing password: "admin123"');
    const isPasswordValid = await user.comparePassword('admin123');
    
    if (isPasswordValid) {
      console.log('✅ Password "admin123" is CORRECT!');
    } else {
      console.log('❌ Password "admin123" is INCORRECT!');
      
      // Try other common passwords
      const testPasswords = ['admin', 'password', '123456', 'Admin123'];
      for (const testPass of testPasswords) {
        const isValid = await user.comparePassword(testPass);
        if (isValid) {
          console.log(`✅ Found correct password: "${testPass}"`);
        }
      }
    }

    // Also test email login
    console.log('\n📧 Testing email login...');
    const userByEmail = await User.findOne({ 
      $or: [
        { username: 'admin' },
        { email: 'admin@hammam.com' }
      ],
      isActive: true
    });
    
    if (userByEmail) {
      console.log('✅ User found by email/username search');
      const emailPasswordValid = await userByEmail.comparePassword('admin123');
      console.log('Password valid via email search:', emailPasswordValid);
    } else {
      console.log('❌ User not found by email/username search');
    }

    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error(error);
    process.exit(1);
  }
};

testPassword();

