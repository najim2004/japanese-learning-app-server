const jwt = require("jsonwebtoken");
require("dotenv").config();

const loggedInMiddleware = (req, res, next) => {
  try {
    const token = req?.header("Authorization")?.split(" ")[1];
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
  } catch (err) {
    console.log("error from loggedInMiddleware", err);
  } finally {
    next();
  }
};

module.exports = loggedInMiddleware;
