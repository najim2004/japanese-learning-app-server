const express = require("express");
const router = express.Router();
const { addLesson, getLessons } = require("../controllers/lessonController");

router.post("/lessons", addLesson);
router.get("/lessons", getLessons);

module.exports = router;
