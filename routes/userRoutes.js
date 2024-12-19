const express = require("express");
const router = express.Router();
const { getUsers } = require("../controllers/userController");

router.get("/users", getUsers);
router.post("getuser");

module.exports = router;
