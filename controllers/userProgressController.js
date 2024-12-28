const Lesson = require("../models/Lesson");
const UserProgress = require("../models/UserProgress");
const Vocabulary = require("../models/Vocabulary");

exports.updateProgress = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    const { lessonId, id: vocabularyId } = req?.params;

    // Get or create progress
    let progress = await UserProgress.findOne({ userId, lessonId });
    if (!progress) {
      progress = await UserProgress.create({ userId, lessonId });
    }

    // Add vocabulary to completed list if not already completed
    if (!progress.completedVocabularies.includes(vocabularyId)) {
      progress.completedVocabularies.push(vocabularyId);
    }

    // Calculate progress percentage
    const vocabularyCount = await Vocabulary.countDocuments({ lessonId });
    const progressPercentage =
      (progress.completedVocabularies.length / vocabularyCount) * 100;
    // Update progress
    progress.progress = progressPercentage;
    progress.isCompleted = progressPercentage === 100;
    await progress.save();

    res.json({ status: 200, success: true });
  } catch (error) {
    res.status(500).json({ success: false, msg: error.message });
  }
};
