const express = require("express");
const router = express.Router();
const { registerUser, loginUser } = require("../controllers/authController");
const registerValidation = require("../validation/registerValidation");

router.post("/register", registerValidation, registerUser);

router.post("/login", loginUser);
router.post("/logout", (req, res) => {
  return res.json({ success: true, msg: "Logged out" });
});

module.exports = router;
