const mongoose = require('mongoose');

require("dotenv").config(); 

const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/scatch"; 

mongoose.connect(dbURI)
  .then(function(){
      console.log('Connected to MongoDB successfully!');
  })
  .catch(function(err){
      console.error('MongoDB connection error:', err);
  });

module.exports = mongoose.connection;