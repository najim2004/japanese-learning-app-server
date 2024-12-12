const Lesson = require("../models/Lesson");

// Add a lesson
exports.addLesson = async (req, res) => {
  const { name, lessonNumber } = req.body;

  try {
    const newLesson = new Lesson({ name, lessonNumber });
    await newLesson.save();
    res.status(201).json(newLesson);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all lessons
exports.getLessons = async (req, res) => {
  try {
    const lessons = await Lesson.find();
    res.status(200).json(lessons);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
