const express = require("express");
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const vocabularyRoutes = require("./routes/vocabularyRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", lessonRoutes);
app.use("/api", vocabularyRoutes);
app.use("/api", tutorialRoutes);

app.use(errorHandler);

module.exports = app;
