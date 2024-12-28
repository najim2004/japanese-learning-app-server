const express = require("express");
const router = express.Router();
const { getUser } = require("../controllers/userController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/getuser", authMiddleware, getUser);

module.exports = router;
