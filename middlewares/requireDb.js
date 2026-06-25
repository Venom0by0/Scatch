const { connectToDatabase } = require('../config/mongoose-connection');

module.exports = async function requireDb(req, res, next) {
    try {
        await connectToDatabase();
        next();
    } catch (err) {
        console.error('Database unavailable:', err.message);
        res.status(503).send(
            'Database unavailable. Check MONGODB_URI in Vercel and MongoDB Atlas Network Access (allow 0.0.0.0/0).'
        );
    }
};
