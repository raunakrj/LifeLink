const mongoose = require('mongoose');
const dotenv = require('dotenv');
const path = require('path');
const User = require('../backend/src/models/User');

dotenv.config({ path: path.join(__dirname, '../backend/.env') });

async function check() {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('Connected to MongoDB');
    
    const total = await User.countDocuments();
    const eligible = await User.countDocuments({ 
        role: { $in: ['Donor', 'Both'] }, 
        isFlagged: false, 
        availability: true 
    });
    
    console.log('Total Users:', total);
    console.log('Eligible Donors:', eligible);
    
    if (eligible > 0) {
        const sample = await User.findOne({ role: { $in: ['Donor', 'Both'] }, isFlagged: false, availability: true });
        console.log('Sample Donor:', { name: sample.name, bloodGroup: sample.bloodGroup, role: sample.role });
    }

    process.exit();
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

check();
