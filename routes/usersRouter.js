const express = require("express");
const router = express.Router();
const requireDb = require("../middlewares/requireDb");
const { registerUser, loginUser, logout } = require("../controllers/authController");

router.get("/", (req, res) => {
    res.send("hey it's working");
});

router.post("/register", requireDb, registerUser);
router.post("/login", requireDb, loginUser);
router.get("/logout", logout);

module.exports = router;
