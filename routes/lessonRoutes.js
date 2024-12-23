const express = require("express");
const router = express.Router();
const {
  addLesson,
  getLessons,
  deleteLesson,
  updateLesson,
} = require("../controllers/lessonController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/lessons", getLessons);
router.post("/lessons", authMiddleware, isAdmin, addLesson);
router.get("/admin/lessons", authMiddleware, isAdmin, getLessons);
router.delete("/admin/lessons/:id", authMiddleware, isAdmin, deleteLesson);
router.patch("/admin/lessons/:id", authMiddleware, isAdmin, updateLesson);

module.exports = router;
