const { body } = require("express-validator");

const lessonValidation = [
  body("name").notEmpty().withMessage("Lesson name is required"),
  body("lessonNumber").isInt().withMessage("Lesson number must be an integer"),
];

module.exports = lessonValidation;
