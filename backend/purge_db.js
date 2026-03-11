require('dotenv').config();
const mongoose = require('mongoose');

const purgeDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI;
    if (!mongoURI) {
      console.error('MONGODB_URI not found in .env');
      process.exit(1);
    }

    await mongoose.connect(mongoURI);
    console.log('Connected to database for purging...');

    const collections = await mongoose.connection.db.collections();

    for (let collection of collections) {
      const name = collection.collectionName;
      await collection.deleteMany({});
      console.log(`Cleared collection: ${name}`);
    }

    console.log('Database purge complete. All documents removed.');
    process.exit(0);
  } catch (error) {
    console.error('Purge Error:', error);
    process.exit(1);
  }
};

purgeDB();
