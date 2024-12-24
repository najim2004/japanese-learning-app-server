const Lesson = require("../models/Lesson");
const Tutorial = require("../models/Tutorial");
const User = require("../models/User");
const Vocabulary = require("../models/Vocabulary");

exports.getOverview = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalLessons = await Lesson.countDocuments();
    const totalVocabularies = await Vocabulary.countDocuments();
    const totalTutorials = await Tutorial.countDocuments();
    return res.json({
      status: 200,
      success: true,
      data: {
        totalUsers,
        totalLessons,
        totalVocabularies,
        totalTutorials,
      },
    });
  } catch (error) {
    console.error("Error getting overview:", error);
    return res.json({
      status: 500,
      success: false,
      msg: error.message || "Internal server error",
    });
  }
};
