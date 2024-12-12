const { body } = require("express-validator");

const vocabularyValidation = [
  body("word").notEmpty().withMessage("Word is required"),
  body("pronunciation").notEmpty().withMessage("Pronunciation is required"),
  body("whenToSay").notEmpty().withMessage("When to say is required"),
  body("lessonNo").isInt().withMessage("Lesson number must be an integer"),
];

module.exports = vocabularyValidation;
