const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");
const multer = require("multer");
const path = require("path");

dotenv.config();

const app = express();
const authRoutes = require("./src/routes/auth");
const blogRoutes = require("./src/routes/blog");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "image");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

// Configure multer
const upload = multer({
  storage: fileStorage,
  fileFilter: fileFilter,
});

// Middleware for parsing JSON
app.use(express.json());

app.use("/image", express.static(path.join(__dirname, "image")));

app.use(upload.single("image"));

// Middleware to enable CORS
app.use(cors());

// Routes for authentication
app.use("/v1/auth", authRoutes);
app.use("/v1/blog", blogRoutes);

// Error handling middleware
app.use((error, req, res, next) => {
  const status = error.errorStatus || 500;
  const message = error.message;
  const data = error.data;
  res.status(status).json({ message: message, data: data });
});

mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    app.listen(4001, () => console.log("Connection Success"));
  })
  .catch((err) => console.log(err));

// Error handling middleware for generic errors
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send("Something broke!");
});

// Start server on port specified in .env or default to 4000
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
