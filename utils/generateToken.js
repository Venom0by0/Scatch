const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    if (!process.env.JWT_KEY) {
        throw new Error("JWT_KEY is not set in environment variables.");
    }

    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
};

module.exports = { generateToken };