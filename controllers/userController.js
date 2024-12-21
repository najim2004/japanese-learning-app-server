const User = require("../models/User");

exports.getUser = async (req, res) => {
  try {
    const user = await User.findOne({ _id: req.user.userId })
      .select("-password")
      .lean();

    if (!user) {
      return res.status(404).json({
        success: false,
        msg: "User not found",
      });
    }

    return res.status(200).json({
      success: true,
      user: user,
    });
  } catch (error) {
    console.error("Error fetching user:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error",
    });
  }
};
