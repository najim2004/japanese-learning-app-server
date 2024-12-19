const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const ImageUploader = require("../utils/imageUploader");

const imageUploader = new ImageUploader();

// Register user
exports.registerUser = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.json({ success: false, status: 400, errors: errors.array() });
  }

  const { name, email, password, photo } = req?.body;
  let imgPublicId;

  try {
    let user = await User.findOne({ email });

    if (user) {
      return res.json({
        success: false,
        status: 400,
        msg: "User already exists",
      });
    }

    if (!photo) {
      throw new Error("Photo is required");
    }

    const { url, public_id } = await imageUploader.uploadImage(photo);

    if (!url || !public_id) {
      throw new Error("Image upload failed");
    }
    imgPublicId = public_id;
    user = new User({
      name,
      email,
      password: await bcrypt.hash(password, 10),
      photo: { url, public_id },
    });

    await user.save();
    res.json({
      success: true,
      status: 201,
      msg: "User registered successfully",
    });
  } catch (err) {
    console.error(err.message);
    if (imgPublicId) {
      await imageUploader.deleteImage(imgPublicId);
    }
    res.json({
      success: false,
      status: 500,
      msg: err.message || "Server error",
    });
  }
};

// Login user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res.json({
        success: false,
        status: 400,
        msg: "Invalid credentials",
      });
    }
    const isMatch = await bcrypt.compare(password, user?.password);

    if (!isMatch) {
      return res.json({
        success: false,
        status: 400,
        msg: "Invalid credentials",
      });
    }

    const payload = { userId: user.id };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
      (err, token) => {
        if (err) throw err;
        res.json({
          success: true,
          status: 200,
          token,
          msg: "User logged in successfully",
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.json({ success: false, status: 500, msg: "Server error" });
  }
};
