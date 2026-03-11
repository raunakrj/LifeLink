const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const path = require('path');
const fs = require('fs');

dotenv.config({ path: path.join(__dirname, '../../.env') });

const viewUsers = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    
    // Fetch 10 sample users
    const users = await User.find({}, 'name email role').limit(10);
    
    let output = '--- Sample Seeded Users ---\n';
    output += 'Password for all seeded users: password123\n';
    output += '---------------------------\n';
    
    users.forEach((user, index) => {
      output += `${index + 1}. Name: ${user.name}\n`;
      output += `   Email: ${user.email}\n`;
      output += `   Role: ${user.role}\n`;
      output += '---------------------------\n';
    });

    fs.writeFileSync(path.join(__dirname, 'seeded_samples.txt'), output);
    console.log('Sample data written to seeded_samples.txt');
    process.exit();
  } catch (error) {
    console.error('Error fetching users:', error);
    process.exit(1);
  }
};

viewUsers();
