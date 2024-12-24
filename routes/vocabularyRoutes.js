const express = require("express");
const router = express.Router();
const {
  addVocabulary,
  getVocabularies,
  getVocabulary,
  updateVocabulary,
  deleteVocabulary,
} = require("../controllers/vocabularyController");
const authMiddleware = require("../middleware/authMiddleware");
const { isAdmin } = require("../middleware/isAdmin");

router.post("/admin/vocabularies", authMiddleware, isAdmin, addVocabulary);
router.get("/admin/vocabularies", authMiddleware, isAdmin, getVocabularies);
router.get("/vocabularies/:slug", authMiddleware, getVocabulary);
router.patch(
  "/admin/vocabularies/:id",
  authMiddleware,
  isAdmin,
  updateVocabulary
);
router.delete(
  "/admin/vocabularies/:id",
  authMiddleware,
  isAdmin,
  deleteVocabulary
);

module.exports = router;
