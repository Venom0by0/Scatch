const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const ownersModel = require("../models/owners-models");

if (process.env.NODE_ENV === 'development') {
    router.post("/create", async function (req, res) {
        try {
            let owners = await ownersModel.find();
            if (owners.length > 0) {
                return res.status(403)
                    .send("You don't have permission to create a new owner.");
            }

            let { fullname, email, password } = req.body;
            if (!fullname || !email || !password) {
                return res.status(400).send("Full name, email and password are required.");
            }

            bcrypt.genSalt(10, function (err, salt) {
                bcrypt.hash(password, salt, async function (err, hash) {
                    if (err) return res.send(err.message);

                    let createdOwner = await ownersModel.create({
                        fullname,
                        email,
                        password: hash,
                        isadmin: true,
                    });
                    res.status(201).send(createdOwner);
                });
            });
        } catch (err) {
            res.send("Error creating owner: " + err.message);
        }
    });
}

router.get('/admin', function (req, res) {
    let success = req.flash("success");
    res.render("createproducts", { success });
});

router.get('/login', function (req, res) {
    res.render("owner-login");
});




module.exports = router;