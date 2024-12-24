const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");
const { getOverview } = require("../controllers/overviewController");

router.get("/admin/overview", authMiddleware, isAdmin, getOverview);

module.exports = router;
