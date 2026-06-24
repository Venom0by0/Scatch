const express = require("express");
const router = express.Router();
const isLoggedIn = require("../middlewares/isLoggedIn");
const productModel = require("../models/product-models"); // 'products' lagaya// 👈 Is line ko dhyan se dekho (Model import hua)
const { logout } = require("../controllers/authController");

// 1. Home / Login page
router.get('/', function(req, res){
    let error = req.flash("error");
    res.render("index", { error });
});

// 2. Shop Page
router.get("/shop", isLoggedIn, async function(req, res){
    try {
        let products = await productModel.find();
        res.render("shop", { products: products || [] });
    } catch (err) {
        res.send("Database Error: " + err.message);
    }
});

// 3. Cart Page
router.get("/cart", isLoggedIn, function(req, res){
    res.render("cart");
});

// 3. Logout route
router.get("/logout", logout);

module.exports = router;