const mongoose = require('mongoose');
const config = require('config');

let dbURI;
try {
    // Vercel par yeh direct environment variable utha lega
    dbURI = process.env.MONGODB_URI || process.env.MONGO_URI || config.get("MONGODB_URI");
} catch (error) {
    if (process.env.MONGODB_URI || process.env.MONGO_URI) {
        dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
    } else {
        console.error("Database connection string missing!");
        process.exit(1);
    }
}

mongoose
  .connect(dbURI)
  .then(() => {
    console.log("Connected to MongoDB successfully!");
  })
  .catch((err) => {
    console.log("MongoDB connection error:", err);
  });

module.exports = mongoose.connection;