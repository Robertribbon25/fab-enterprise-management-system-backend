import mongoose from 'mongoose';

let isMongoConnected = false;

export const connectDB = async () => {
  const mongoURI = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/dab_enterprise';
  try {
    // Try to connect to MongoDB with a short timeout so we don't block the startup
    const conn = await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 2500,
    });
    console.log(`\x1b[32m[Database] MongoDB Connected: ${conn.connection.host}\x1b[0m`);
    isMongoConnected = true;
  } catch (error) {
    console.warn(`\x1b[33m[Database Warning] MongoDB connection failed: ${error.message}.\x1b[0m`);
    console.warn(`\x1b[34m[Database Info] Operating in local high-fidelity JSON database fallback mode (db_fallback.json)\x1b[0m`);
    isMongoConnected = false;
  }
};

export const getDbStatus = () => isMongoConnected;
export const setDbStatus = (status) => { isMongoConnected = status; };
