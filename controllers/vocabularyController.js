const Vocabulary = require("../models/Vocabulary");

// Add a vocabulary
exports.addVocabulary = async (req, res) => {
  const { word, pronunciation, whenToSay, lessonNo } = req.body;

  try {
    const newVocabulary = new Vocabulary({
      word,
      pronunciation,
      whenToSay,
      lessonNo,
    });
    await newVocabulary.save();
    res.status(201).json(newVocabulary);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};

// Get all vocabularies
exports.getVocabularies = async (req, res) => {
  try {
    const vocabularies = await Vocabulary.find();
    res.status(200).json(vocabularies);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server error");
  }
};
