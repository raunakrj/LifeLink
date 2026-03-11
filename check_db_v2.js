const mongoose = require('mongoose');
const User = require('./backend/src/models/User');
require('dotenv').config({ path: './backend/.env' });

const checkDB = async () => {
    try {
        await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/lifelink');
        console.log('Connected to DB');
        const count = await User.countDocuments();
        console.log('Total Users:', count);
        const donors = await User.find({ role: { $in: ['Donor', 'Both'] } });
        console.log('Donors found:', donors.length);
        if (donors.length > 0) {
            console.log('Sample Donor:', {
                name: donors[0].name,
                bloodGroup: donors[0].bloodGroup,
                availability: donors[0].availability
            });
        }
        process.exit();
    } catch (err) {
        console.error('DB Error:', err);
        process.exit(1);
    }
};

checkDB();
