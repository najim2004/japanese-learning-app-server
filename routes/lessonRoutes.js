const express = require("express");
const router = express.Router();
const { addLesson, getLessons } = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const loggedInMiddleware = require("../middleware/loggedInMiddleware");

router.post("/lessons", authMiddleware, isAdmin, addLesson);
router.get("/admin/lessons", authMiddleware, isAdmin, getLessons);
router.get("/lessons", getLessons);

module.exports = router;
