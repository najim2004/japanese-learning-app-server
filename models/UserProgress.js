const mongoose = require("mongoose");

const userProgressSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    lessonId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Lesson",
      required: true,
    },
    completedVocabularies: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Vocabulary",
      },
    ],
    isCompleted: {
      type: Boolean,
      default: false,
    },
    progress: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
  },
  {
    timestamps: true,
  }
);

userProgressSchema.index({ userId: 1, lessonId: 1 }, { unique: true });
module.exports = mongoose.model("UserProgress", userProgressSchema);
