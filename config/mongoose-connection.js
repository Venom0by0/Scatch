const mongoose = require('mongoose');

// Vercel par direct environment variable check karega, bina config package ke lafde ke
const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;

mongoose.connect(dbURI)
  .then(function(){
      console.log('Connected to MongoDB successfully!');
  })
  .catch(function(err){
      console.error('MongoDB connection error:', err);
  });

module.exports = mongoose.connection;
