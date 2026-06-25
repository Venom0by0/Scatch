const mongoose = require('mongoose');

require('dotenv').config();

const dbURI = process.env.MONGODB_URI || process.env.MONGO_URI;
const isProduction = process.env.NODE_ENV === 'production';

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectToDatabase() {
    if (cached.conn) {
        return cached.conn;
    }

    if (!dbURI) {
        throw new Error(isProduction
            ? 'MONGODB_URI is not set in Vercel environment variables.'
            : 'MONGODB_URI is not set. Add it to your .env file.');
    }

    if (!cached.promise) {
        cached.promise = mongoose.connect(dbURI, {
            bufferCommands: false,
            serverSelectionTimeoutMS: 8000,
            connectTimeoutMS: 8000,
        }).then(function () {
            console.log('Connected to MongoDB successfully!');
            return mongoose.connection;
        }).catch(function (err) {
            cached.promise = null;
            console.error('MongoDB connection error:', err.message);
            throw err;
        });
    }

    cached.conn = await cached.promise;
    return cached.conn;
}

module.exports = { connectToDatabase, connection: mongoose.connection };
