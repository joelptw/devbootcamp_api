const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const app = express();
const errorHandler = require("./middleware/error");

// Load env vars
dotenv.config({ path: "./config/config.env" });

// Route files
const bootcamps = require("./routes/bootcamp");
const courses = require("./routes/courses");

app.use(express.json());
// Connect DB
connectDB();

// Routes
app.use("/api/v1/bootcamps", bootcamps);
app.use("/api/v1/courses", courses);

app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(
  PORT,
  console.log(`server running in ${process.env.NODE_ENV} mode on port ${PORT}`)
);

// Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`ERROR ${err.message}`);

  server.close(() => process.exit(1));
});
