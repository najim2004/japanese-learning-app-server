const Lesson = require("../models/Lesson");
const User = require("../models/User");
const UserProgress = require("../models/UserProgress");
const Vocabulary = require("../models/Vocabulary");

// Add a vocabulary
exports.addVocabulary = async (req, res) => {
  const { word, pronunciation, whenToSay, lessonId, meaning } = req?.body;
  const userId = req?.user?.userId; // Assuming you have user info in request
  try {
    const user = await User.findById(userId).select("-password");
    const lesson = await Lesson.findById({ _id: lessonId });
    if (!lesson) {
      throw new Error("Lesson not found");
    }
    // is this vocabulary already added?
    const existingVocabulary = await Vocabulary.findOne({
      word,
      lessonId,
    });
    if (existingVocabulary) {
      throw new Error("Vocabulary already exists");
    }
    const newVocabulary = new Vocabulary({
      word,
      pronunciation,
      whenToSay,
      lessonNo: lesson.lessonNumber,
      lessonId,
      adminEmail: user?.email,
      meaning,
    });
    await newVocabulary.save();
    res.json({
      status: 201,
      success: true,
      msg: "Vocabulary added successfully",
    });
  } catch (err) {
    console.error(err.message);
    res.send({
      status: 500,
      success: false,
      msg: err.message || "Server error",
    });
  }
};

// Get all vocabularies
exports.getVocabularies = async (req, res) => {
  try {
    const { page = 1, limit = 10, search } = req.query;
    const query = {};

    if (search) {
      query.$or = [
        { word: { $regex: search, $options: "i" } },
        { pronunciation: { $regex: search, $options: "i" } },
        { meaning: { $regex: search, $options: "i" } },
        { whenToSay: { $regex: search, $options: "i" } },
      ];
    }

    const totalDocs = await Vocabulary.countDocuments(query);
    const vocabularies = await Vocabulary.find(query)
      .sort({ updatedAt: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .exec();

    res.json({
      status: 200,
      success: true,
      vocabularies,
      totalPages: Math.ceil(totalDocs / limit),
      currentPage: page,
      totalDocs,
    });
  } catch (err) {
    console.error(err.message);
    res.json({
      status: 500,
      success: false,
      message: err.message || "Server error",
    });
  }
};

// get a single vocabulary
exports.getVocabulary = async (req, res) => {
  const vocabularyId = req?.params?.id;
  const userId = req?.user?.userId; // Assuming you have user info in request

  try {
    const isAdmin = await User.findOne(
      { role: "admin", _id: userId },
      { password: 0 }
    );
    if (!vocabularyId) {
      return res.json({
        status: 400,
        success: false,
        msg: "Vocabulary ID is required",
      });
    }

    const vocabulary = await Vocabulary.findById(vocabularyId);
    if (!vocabulary) {
      return res.json({
        status: 404,
        success: false,
        msg: "Vocabulary not found",
      });
    }

    // Find user progress for this vocabulary
    const userProgress = await UserProgress.findOne({
      userId,
      lessonId: vocabulary.lessonId,
    });

    // Convert vocabulary to plain object so we can add new property
    const vocabularyObj = vocabulary.toObject();
    vocabularyObj.isComplete =
      userProgress?.completedVocabularies?.some(
        (VId) => vocabularyId.toString() === VId.toString()
      ) || false;
    if (isAdmin) {
      vocabularyObj.isComplete = true;
    }
    return res.json({
      status: 200,
      success: true,
      vocabulary: vocabularyObj,
    });
  } catch (err) {
    console.error(err.message);
    return res.json({
      status: 500,
      success: false,
      msg: err.message || "Server error",
    });
  }
};
// get completed vocabularies by lesson

// update a vocabulary
exports.updateVocabulary = async (req, res) => {
  const vocabularyId = req?.params?.id;
  const updates = req?.body;

  try {
    // Validate input
    if (!vocabularyId) {
      return res.json({
        status: 400,
        success: false,
        msg: "Vocabulary ID is required",
      });
    }

    if (!updates || Object.keys(updates).length === 0) {
      return res.json({
        status: 400,
        success: false,
        msg: "No update data provided",
      });
    }

    // Check if vocabulary exists
    const vocabulary = await Vocabulary.findById(vocabularyId);
    if (!vocabulary) {
      return res.json({
        status: 404,
        success: false,
        msg: "Vocabulary not found",
      });
    }

    // If lessonId is being updated, check if the lesson exists
    if (updates.lessonId) {
      const lessonExists = await Lesson.findById(updates.lessonId);
      if (!lessonExists) {
        return res.json({
          status: 400,
          success: false,
          msg: "Invalid lesson ID provided",
        });
      }
      // Update the lessonNo based on the new lesson
      updates.lessonNo = lessonExists.lessonNumber;
    }

    // If updating word or lessonId, check for duplicates
    if (updates.word || updates.lessonId) {
      const existingVocabulary = await Vocabulary.findOne({
        word: updates.word || vocabulary.word,
        lessonId: updates.lessonId || vocabulary.lessonId,
        _id: { $ne: vocabularyId },
      });

      if (existingVocabulary) {
        return res.json({
          status: 400,
          success: false,
          msg: "Vocabulary already exists in this lesson",
        });
      }
    }

    // Update vocabulary
    const updatedVocabulary = await Vocabulary.findByIdAndUpdate(
      vocabularyId,
      { $set: updates },
      { new: true, runValidators: true }
    );

    return res.json({
      status: 200,
      success: true,
      msg: "Vocabulary updated successfully",
      vocabulary: updatedVocabulary,
    });
  } catch (err) {
    console.error("Error updating vocabulary:", err);
    return res.json({
      status: 500,
      success: false,
      msg:
        err.name === "ValidationError"
          ? "Invalid update data provided"
          : "Internal server error",
    });
  }
};

// Delete a vocabulary
exports.deleteVocabulary = async (req, res) => {
  const vocabularyId = req?.params?.id;

  try {
    if (!vocabularyId) {
      return res.json({
        status: 400,
        success: false,
        msg: "Vocabulary ID is required",
      });
    }

    const vocabulary = await Vocabulary.findById(vocabularyId);
    if (!vocabulary) {
      return res.json({
        status: 404,
        success: false,
        msg: "Vocabulary not found",
      });
    }

    await Vocabulary.findByIdAndDelete(vocabularyId);

    return res.json({
      status: 200,
      success: true,
      msg: "Vocabulary deleted successfully",
    });
  } catch (err) {
    console.error("Error deleting vocabulary:", err);
    return res.json({
      status: 500,
      success: false,
      msg: err.message || "Internal server error",
    });
  }
};

// get vocabularies names by lesson id
exports.getVocabulariesName = async (req, res) => {
  const lessonId = req?.params?.id;
  const userId = req?.user?.userId;

  try {
    const isAdmin = await User.findOne(
      { role: "admin", _id: userId },
      { password: 0 }
    );
    // Get user progress for this lesson
    const userProgress = await UserProgress.findOne({ userId, lessonId });
    const completedVocabs = userProgress?.completedVocabularies || [];

    // Get vocabularies with only required fields
    const vocabularies = await Vocabulary.find({ lessonId }, "_id word slug");

    // Map vocabularies with completion status
    const mappedVocabs = vocabularies.map((vocab) => ({
      _id: vocab._id,
      word: vocab.word,
      slug: vocab.slug,
      isComplete: completedVocabs.includes(vocab._id),
    }));

    // Sort: completed first, then by createdAt within each group
    const sortedVocabs = mappedVocabs.sort((a, b) => {
      if (a.isComplete !== b.isComplete) return b.isComplete ? 1 : -1;
      return b.createdAt - a.createdAt;
    });

    const finalData = sortedVocabs.map((vocab, indx) => {
      vocab.locked =
        indx === 0 || isAdmin ? false : !sortedVocabs[indx - 1].isComplete;
      return vocab;
    });

    res.json({
      status: 200,
      success: true,
      data: finalData,
    });
  } catch (error) {
    console.error(error);
    res.json({
      status: 500,
      success: false,
      msg: error.message || "Internal server error",
    });
  }
};
