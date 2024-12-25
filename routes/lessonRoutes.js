const express = require("express");
const router = express.Router();
const {
  addLesson,
  getLessons,
  deleteLesson,
  updateLesson,
  getLessonNames,
} = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/lessons", authMiddleware, getLessons);
router.post("/lessons", authMiddleware, isAdmin, addLesson);
router.get("/admin/lessons", authMiddleware, isAdmin, getLessons);
router.get("/admin/lessons/names", authMiddleware, isAdmin, getLessonNames);
router.delete("/admin/lessons/:id", authMiddleware, isAdmin, deleteLesson);
router.patch("/admin/lessons/:id", authMiddleware, isAdmin, updateLesson);

module.exports = router;
