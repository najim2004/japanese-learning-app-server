const Lesson = require("../models/Lesson");
const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const Vocabulary = require("../models/Vocabulary");

// Add a lesson
exports.addLesson = async (req, res) => {
  const { name, lessonNumber, description } = req?.body;
  try {
    const newLesson = new Lesson({ name, lessonNumber, description });
    await newLesson.save();
    res.json({
      status: 201,
      success: true,
      msg: "Lesson created successfully",
      data: newLesson,
    });
  } catch (err) {
    console.error(err.message);
    res.json({
      status: 500,
      success: false,
      msg: err.message || "Server error",
      error: err,
    });
  }
};

// Get all lessons with progress
exports.getLessons = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;
  const userId = req?.user?.userId;
  try {
    const isAdmin = User.findOne({ _id: userId, role: "admin" });
    const totalLessons = await Lesson.countDocuments();
    const lessons = await Lesson.find()
      .skip(skip)
      .limit(limit)
      .sort({ lessonNumber: 1 });

    const userProgress = await UserProgress.find({
      userId,
      lessonId: { $in: lessons.map((lesson) => lesson._id) },
    });

    const lessonsWithProgress = await Promise.all(
      lessons.map(async (lesson) => {
        const vocabularyCount =
          (await Vocabulary.countDocuments({
            lessonId: lesson._id,
          })) || 0;

        if (isAdmin) {
          return {
            ...lesson.toObject(),
            vocabularyCount,
          };
        }

        const progress = userProgress.find(
          (p) => p.lessonId.toString() === lesson._id.toString()
        );

        const previousLesson = await Lesson.findOne({
          lessonNumber: lesson.lessonNumber - 1,
        });

        const previousProgress = previousLesson
          ? userProgress.find(
              (p) => p.lessonId.toString() === previousLesson._id.toString()
            )
          : { isCompleted: true };

        return {
          ...lesson.toObject(),
          progress: progress?.progress || 0,
          completed: progress?.isCompleted || false,
          vocabularyCount,
          locked:
            lesson.lessonNumber === 1 ? false : !previousProgress?.isCompleted,
          completedVocabularies: progress?.completedVocabularies?.length || 0,
        };
      })
    );

    return res.status(200).json({
      success: true,
      msg: "Lessons retrieved successfully",
      data: {
        lessons: lessonsWithProgress,
        currentPage: page,
        totalPages: Math.ceil(totalLessons / limit),
        totalLessons,
      },
    });
  } catch (err) {
    console.error(err.message);
    res.json({
      status: 500,
      success: false,
      msg: err.message || "Server error",
      error: err,
    });
  }
};
