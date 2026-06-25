const bcrypt = require("bcrypt");
const { generateToken } = require("../utils/generateToken");
const { getAuthCookieOptions } = require("../utils/cookieOptions");
const userModel = require("../models/user-model");


module.exports.registerUser = async function (req, res) {
    try {
        let { email, password, fullname } = req.body;

        let user = await userModel.findOne({ email: email });
        if (user) return res.status(401).send("You already have an account, please login!");

        bcrypt.genSalt(10, function (err, salt) {
            bcrypt.hash(password, salt, async function (err, hash) {
                if (err) return res.send(err.message);
                else {
                    let user = await userModel.create({
                        email,
                        password: hash,
                        fullname,
                    });

                    let token = generateToken(user);
                    res.cookie("token", token, getAuthCookieOptions());
                    res.redirect("/shop");
                }
            });
        });
    }
    catch (err) {
        res.send(err.message);
    }

}

module.exports.loginUser = async function (req, res) {
    try {
        let { email, password } = req.body;

        let user = await userModel.findOne({ email: email });
        if (!user) return res.send("Email or Password incorrect");

        bcrypt.compare(password, user.password, function (err, result) {
            if (err) return res.send(err.message);
            if (result) {
                let token = generateToken(user);
                res.cookie("token", token, getAuthCookieOptions());
                res.redirect("/shop");
            }
            else {
                return res.send("Email or Password incorrect");
            }
        });
    } catch (err) {
        res.send(err.message);
    }
};

// Logout function ko export karein
module.exports.logout = function (req, res) {
    res.clearCookie("token", getAuthCookieOptions());
    res.redirect("/");
};
