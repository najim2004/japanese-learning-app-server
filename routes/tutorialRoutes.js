const express = require("express");
const router = express.Router();
const { getTutorials } = require("../controllers/tutorialController");

router.get("/tutorials", getTutorials);

module.exports = router;
