const express = require("express");
const cors = require("cors"); // Add this line
const app = express();
const connectDB = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const lessonRoutes = require("./routes/lessonRoutes");
const vocabularyRoutes = require("./routes/vocabularyRoutes");
const tutorialRoutes = require("./routes/tutorialRoutes");
const overviewRoutes = require("./routes/overviewRoutes");
const userProgressRoutes = require("./routes/userProgressRoutes");
const errorHandler = require("./middleware/errorHandler");

connectDB();

app.use(
  cors({
    origin: ["http://localhost:5173"],
    credentials: true,
  })
); // Add this line
const bodyLimit = "100mb"; // Adjust limit as needed
app.use(express.json({ limit: bodyLimit }));
app.use(express.urlencoded({ limit: bodyLimit, extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api", userRoutes);
app.use("/api", lessonRoutes);
app.use("/api", vocabularyRoutes);
app.use("/api", tutorialRoutes);
app.use("/api", overviewRoutes);
app.use("/api", userProgressRoutes);

app.use(errorHandler);

module.exports = app;
