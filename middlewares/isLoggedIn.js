const jwt = require('jsonwebtoken');
const userModel = require("../models/user-model");
const { getAuthCookieOptions } = require("../utils/cookieOptions");

module.exports = async function (req, res, next) {
    // 1. Fix: req.cookies.token check sahi hai
    if (!req.cookies.token) {
        req.flash("error", "you need to login first"); // Fix: 'rq' ko 'req' kiya
        return res.redirect('/');
    }

    try {
        let decoded = jwt.verify(req.cookies.token, process.env.JWT_KEY);
        let user = await userModel.findOne({ email: decoded.email }).select("-password");

        if (!user) {
            res.clearCookie("token", getAuthCookieOptions());
            req.flash("error", "User not found. Please login again.");
            return res.redirect('/');
        }

        req.user = user;
        next();
    } catch (err) {
        res.clearCookie("token", getAuthCookieOptions());
        req.flash("error", "Something went wrong.");
        return res.redirect('/');
    }
};