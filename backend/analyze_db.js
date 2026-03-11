const mongoose = require('mongoose');
const User = require('./src/models/User');
require('dotenv').config();

const analyzeDonors = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifelink');
        
        const totalDonors = await User.countDocuments({ role: { $in: ['Donor', 'Both'] } });
        console.log('Total Donors:', totalDonors);
        
        const availableDonors = await User.countDocuments({ role: { $in: ['Donor', 'Both'] }, availability: true });
        console.log('Available Donors:', availableDonors);
        
        const unflaggedDonors = await User.countDocuments({ role: { $in: ['Donor', 'Both'] }, isFlagged: false });
        console.log('Unflagged Donors:', unflaggedDonors);
        
        const readyDonors = await User.countDocuments({ role: { $in: ['Donor', 'Both'] }, availability: true, isFlagged: false });
        console.log('Ready Donors (Avail + Not Flagged):', readyDonors);

        const groups = await User.aggregate([
            { $match: { role: { $in: ['Donor', 'Both'] }, availability: true, isFlagged: false } },
            { $group: { _id: "$bloodGroup", count: { $sum: 1 } } }
        ]);
        console.log('Blood Group distribution (Ready Donors):', groups);

        process.exit();
    } catch (err) {
        console.error(err);
        process.exit(1);
    }
};

analyzeDonors();
