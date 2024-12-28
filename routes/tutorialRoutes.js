const express = require("express");
const router = express.Router();
const {
  getTutorials,
  createTutorial,
  updateTutorial,
  deleteTutorial,
} = require("../controllers/tutorialController");
const loggedInMiddleware = require("../middleware/loggedInMiddleware");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.get("/tutorials", loggedInMiddleware, getTutorials);
router.post("/admin/tutorials", authMiddleware, isAdmin, createTutorial);
router.patch("/admin/tutorials/:id", authMiddleware, isAdmin, updateTutorial);
router.delete("/admin/tutorials/:id", authMiddleware, isAdmin, deleteTutorial);

module.exports = router;
