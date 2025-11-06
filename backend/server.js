const mongoose = require('mongoose');
require('dotenv').config();
const app = require('./app');
const PORT = process.env.PORT || 5000;

async function start() {
  // Start with any explicitly provided URI
  let MONGO_URI = process.env.MONGO_URI;

  // Use an in-memory MongoDB for quick local development when requested and no MONGO_URI provided.
  if (!MONGO_URI && (process.env.USE_IN_MEMORY_DB === '1' || process.env.NODE_ENV === 'development')) {
    // require here so production doesn't load the package unnecessarily
    const { MongoMemoryServer } = require('mongodb-memory-server');
    const mongod = await MongoMemoryServer.create();
    MONGO_URI = mongod.getUri();
      // keep mongod reference alive so it doesn't get GC'd
      process._mongod = mongod;
      console.log('Starting in-memory MongoDB for development...');
  }

  // Fallback to local Mongo if nothing else provided
  MONGO_URI = MONGO_URI || 'mongodb://localhost:27017/mern_food_app';

  try {
    await mongoose.connect(MONGO_URI);
    console.log('MongoDB connected');
    // If using an in-memory DB during development, seed it so the frontend has data
    if (!process.env.MONGO_URI && (process.env.USE_IN_MEMORY_DB === '1' || process.env.NODE_ENV === 'development')){
      try{
        const { seedDatabase } = require('./seed');
        await seedDatabase();
        console.log('In-memory DB seeded');
      }catch(e){
        console.error('Failed to seed in-memory DB:', e);
      }
    }
    app.listen(PORT, () => console.log('Server running on port', PORT));
  } catch (err) {
    console.error(err);
    process.exit(1);
  }
}

start();
