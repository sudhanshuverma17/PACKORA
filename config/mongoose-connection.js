const mongoose = require('mongoose');
require('dns').setDefaultResultOrder('ipv4first');

async function connectDB() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Database Live');
  } catch (err) {
    console.log('DB Error:', err.message);
    throw err;
  }
}

module.exports = connectDB;
