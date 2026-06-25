const mongoose = require('mongoose');

require('dotenv').config();

const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/scatch';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(dbURI, {
            bufferCommands: false,
        }).then(function () {
            console.log('Connected to MongoDB successfully!');
            return mongoose.connection;
        }).catch(function (err) {
            cached.promise = null;
            console.error('MongoDB connection error:', err);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

connectToDatabase().catch(function () {});

module.exports = { connectToDatabase, connection: mongoose.connection };
