const Tutorial = require("../models/Tutorial");
const User = require("../models/User");

// Get all tutorials
exports.getTutorials = async (req, res) => {
  const userId = req.user?.userId;
  try {
    let tutorials = await Tutorial.find();

    // Check if user exists
    const user = await User.exists({ _id: userId });

    // Map tutorials to add locked property and handle videoUrl
    tutorials = tutorials.map((tutorial) => {
      const tutorialObj = tutorial.toObject();

      if (tutorialObj?.videoUrl) {
        tutorialObj.thumbnailUrl = `https://img.youtube.com/vi/${
          tutorial?.videoUrl.split("v=")[1]
        }/maxresdefault.jpg`;
      }
      if (!userId || !user) {
        tutorialObj.locked = true;
        delete tutorialObj.videoUrl;
      } else {
        tutorialObj.locked = false;
      }

      return tutorialObj;
    });

    res.json({
      success: true,
      status: 200,
      tutorials,
    });
  } catch (error) {
    res.json({
      success: false,
      status: 500,
      msg: error.message || "Internal server error",
    });
  }
};

// Create new tutorial
exports.createTutorial = async (req, res) => {
  try {
    const tutorial = new Tutorial(req?.body);
    const savedTutorial = await tutorial.save();
    res.json({
      success: true,
      status: 201,
      msg: "Tutorial created successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      status: 400,
      msg: error.message || "Server error",
    });
  }
};

// Update tutorial
exports.updateTutorial = async (req, res) => {
  try {
    const updateData = { ...req.body };
    const tutorial = await Tutorial.findByIdAndUpdate(
      req?.params?.id,
      { $set: updateData },
      { new: true }
    );

    if (!tutorial) {
      return res.status(404).json({
        success: false,
        status: 404,
        msg: "Tutorial not found",
      });
    }

    res.json({
      success: true,
      status: 200,
      msg: "Tutorial updated successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      status: 400,
      msg: error.message || "Server error",
    });
  }
};

// Delete tutorial
exports.deleteTutorial = async (req, res) => {
  try {
    const tutorial = await Tutorial.findByIdAndDelete(req.params.id);
    if (!tutorial) {
      return res.json({
        success: false,
        status: 404,
        msg: "Tutorial not found",
      });
    }
    res.json({
      success: true,
      status: 200,
      msg: "Tutorial deleted successfully",
    });
  } catch (error) {
    res.json({
      success: false,
      status: 500,
      msg: error.message || "Internal server error",
    });
  }
};
