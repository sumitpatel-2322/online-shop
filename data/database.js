const { MongoClient } = require('mongodb');
let database;

async function connectToDatabase() {
  const uri = process.env.MONGODB_URI; // Get Atlas URI from environment variable!
  const dbName = process.env.DB_NAME || 'online-shop';

  try {
    const client = await MongoClient.connect(uri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    database = client.db(dbName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Database connection failed:', error);
    throw error;
  }
}

function getDb() {
  if (!database) {
    throw new Error('You must connect to the database first!');
  }
  return database;
}

module.exports = {
  connectToDatabase,
  getDb,
};
