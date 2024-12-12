const express = require("express");
const router = express.Router();
const {
  addVocabulary,
  getVocabularies,
} = require("../controllers/vocabularyController");

router.post("/vocabularies", addVocabulary);
router.get("/vocabularies", getVocabularies);

module.exports = router;
