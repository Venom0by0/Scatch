const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const requireDb = require("../middlewares/requireDb");
const productModel = require("../models/product-models");
const { logout } = require("../controllers/authController");

router.get('/', function (req, res) {
    let error = req.flash("error");
    res.render("index", { error });
});

router.get("/shop", requireDb, isLoggedIn, async function (req, res) {
    try {
        let products = await productModel.find();
        res.render("shop", { products: products || [] });
    } catch (err) {
        res.send("Database Error: " + err.message);
    }
});

router.get("/cart", requireDb, isLoggedIn, function (req, res) {
    res.render("cart");
});

router.get("/logout", logout);

module.exports = router;
