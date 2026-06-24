const express = require("express");
const router = express.Router();
// baki controllers ko destructure kiya
const { registerUser, loginUser, logout } = require("../controllers/authController");

router.get("/", (req, res) => {
  res.send("hey it's working");
});

router.post("/register", registerUser);
router.post("/login", loginUser); // 👈 Yeh function handle kar raha hai login
router.get("/logout", logout);

module.exports = router;