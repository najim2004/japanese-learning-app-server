const Lesson = require("../models/Lesson");
const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const Vocabulary = require("../models/Vocabulary");

// Add a lesson
exports.addLesson = async (req, res) => {
  const { name, lessonNumber, description } = req?.body;

  try {
    // Validate required fields
    if (!name || !lessonNumber) {
      return res.json({
        status: 400,
        success: false,
        msg: "Name and lesson number are required",
      });
    }

    // Check if lesson number already exists
    const existingLesson = await Lesson.findOne({ lessonNumber });
    if (existingLesson) {
      return res.json({
        status: 400,
        success: false,
        msg: "Lesson number already exists",
      });
    }

    // Create and save new lesson
    const newLesson = new Lesson({
      name,
      lessonNumber,
      description: description || "",
    });

    await newLesson.save();

    return res.json({
      status: 201,
      success: true,
      msg: "Lesson created successfully",
      data: newLesson,
    });
  } catch (err) {
    console.error("Error creating lesson:", err.message);
    return res.json({
      status: 500,
      success: false,
      msg: "Failed to create lesson",
      error: err.message,
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

exports.deleteLesson = async (req, res) => {
  const { id } = req?.params;
  try {
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.json({
        status: 404,
        success: false,
        msg: "Lesson not found",
      });
    }

    // Delete associated user progress
    await UserProgress.deleteMany({ lessonId: id });

    // Delete associated vocabulary
    await Vocabulary.deleteMany({ lessonId: id });

    // Delete the lesson
    await Lesson.findByIdAndDelete(id);

    res.json({
      status: 200,
      success: true,
      msg: "Lesson and associated data deleted successfully",
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

exports.updateLesson = async (req, res) => {
  const { id } = req?.params;
  const updateData = req?.body;

  try {
    // Check if lesson exists
    const lesson = await Lesson.findById(id);
    if (!lesson) {
      return res.json({
        status: 404,
        success: false,
        msg: "Lesson not found",
      });
    }

    // Check if new lessonNumber already exists
    if (
      updateData.lessonNumber &&
      updateData.lessonNumber !== lesson.lessonNumber
    ) {
      const existingLesson = await Lesson.findOne({
        lessonNumber: updateData.lessonNumber,
      });
      if (existingLesson) {
        return res.json({
          status: 400,
          success: false,
          msg: "Lesson number already exists",
        });
      }
    }

    // Update the lesson with only the provided fields
    const updatedLesson = await Lesson.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    res.json({
      status: 200,
      success: true,
      msg: "Lesson updated successfully",
      data: updatedLesson,
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
