const User = require("../models/User");

exports.isAdmin = async (req, res, next) => {
  try {
    const userId = req?.user?.userId;
    const isAdmin = await User.findOne({ _id: userId, role: "admin" });
    if (!isAdmin) {
      return res.status(403).json({ success: false, msg: "Access Denied" });
    }
    next();
  } catch (error) {
    console.error("Error admin validation:", error);
    return res.status(500).json({
      success: false,
      msg: "Internal server error from admin validation",
    });
  }
};
