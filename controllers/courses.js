const Courses = require("../models/Course");
const asyncHandler = require("../middleware/async");
const ErrorResponse = require("../utils/errorResponse");

exports.getCourses = asyncHandler(async (req, res, next) => {
  let query;

  if (req.params.bootcampId) {
    query = Courses.find({ bootcamp: req.params.bootcampId });
  } else {
    query = Courses.find();
  }

  const courses = await query;

  res.status(200).json({ success: true, count: courses.length, data: courses });
});
