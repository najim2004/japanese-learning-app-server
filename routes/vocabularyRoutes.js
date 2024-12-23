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

router.post("/admin/vocabularies", authMiddleware, addVocabulary);
router.get("/admin/vocabularies", authMiddleware, getVocabularies);
router.get("/vocabularies/:slug", authMiddleware, getVocabulary);
router.patch("/admin/vocabularies/:id", authMiddleware, updateVocabulary);
router.delete("/admin/vocabularies/:id", authMiddleware, deleteVocabulary);

module.exports = router;
