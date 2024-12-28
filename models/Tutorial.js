const mongoose = require("mongoose");

const tutorialSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    duration: { type: String, required: true },
    difficulty: { type: String, required: true },
    videoUrl: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Tutorial", tutorialSchema);
