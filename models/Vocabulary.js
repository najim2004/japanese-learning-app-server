const mongoose = require("mongoose");

const vocabularySchema = new mongoose.Schema({
  word: { type: String, required: true },
  pronunciation: { type: String, required: true },
  whenToSay: { type: String, required: true },
  lessonNo: { type: Number, required: true },
});

module.exports = mongoose.model("Vocabulary", vocabularySchema);
