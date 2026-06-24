const jwt = require("jsonwebtoken");

const generateToken = (user) => {
    // JWT_KEY .env file se uthayega
    return jwt.sign({ email: user.email, id: user._id }, process.env.JWT_KEY);
};

module.exports = { generateToken };