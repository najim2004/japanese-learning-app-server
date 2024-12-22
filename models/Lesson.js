const mongoose = require("mongoose");

const lessonSchema = new mongoose.Schema({
  name: { type: String, required: true },
  lessonNumber: { type: Number, required: true, unique: true },
  description: { type: String, required: true },
});

module.exports = mongoose.model("Lesson", lessonSchema);
