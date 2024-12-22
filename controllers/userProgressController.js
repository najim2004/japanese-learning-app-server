const Lesson = require("../models/Lesson");
const UserProgress = require("../models/UserProgress");

exports.updateProgress = async (req, res) => {
  try {
    const userId = req?.user?.userId;
    const { lessonId, vocabularyId } = req.body;

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
    const lesson = await Lesson.findById(lessonId);
    const progressPercentage =
      (progress.completedVocabularies.length / lesson.vocabularyCount) * 100;

    // Update progress
    progress.progress = progressPercentage;
    progress.isCompleted = progressPercentage === 100;
    progress.lastAccessedAt = new Date();
    await progress.save();

    res.json(progress);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
