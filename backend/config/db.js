const mongoose = require('mongoose');

let isConnected = false;

const connectDB = async () => {
  if (isConnected) return;

  try {
    const conn = await mongoose.connect(process.env.MONGO_URI);
    isConnected = true;
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`Error connecting to MongoDB: ${error.message}`);
    // Do NOT call process.exit() here — in a serverless environment (Vercel)
    // that kills the function invocation. Let the error surface to the caller instead.
    throw error;
  }
};

module.exports = connectDB;
