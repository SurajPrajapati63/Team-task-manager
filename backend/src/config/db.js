const mongoose = require("mongoose");

async function testConnection() {
  const mongoUri = process.env.MONGODB_URI;

  if (!mongoUri) {
    throw new Error("MONGODB_URI is missing in backend/.env. Add your MongoDB connection string and restart the server.");
  }

  if (mongoUri.includes("<db_password>")) {
    throw new Error("Replace <db_password> in MONGODB_URI with your real MongoDB Atlas database password.");
  }

  await mongoose.connect(mongoUri, {
    serverSelectionTimeoutMS: 10000
  });
  console.log("Data Base Connect");
  
}

module.exports = { testConnection };
