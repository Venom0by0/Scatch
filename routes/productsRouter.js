const express = require('express');
const router = express.Router();
const upload = require('../config/multer-config');
const requireDb = require('../middlewares/requireDb');
const productModel = require('../models/product-models');

router.post('/create', requireDb, upload.single('image'), async function(req, res) {
    try {
        if (!req.file) {
            return res.send("Please upload a product image.");
        }

        let { name, price, discount, bgcolor, panelcolor, textcolor } = req.body;

        let product = await productModel.create({
            image: req.file.buffer,
            name,
            price: Number(price),
            discount: Number(discount) || 0,
            bgcolor,
            panelcolor,
            textcolor,
        });

        req.flash("success", "Product created successfully");
        res.redirect('/owners/admin');
    } catch (err) {
        res.send("Error creating product: " + err.message);
    }
});

module.exports = router;