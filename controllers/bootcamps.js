const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
const asyncHandler = require("../middleware/async");
const geocoder = require("../utils/geoCoder");
//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@acces    Public

exports.getBootcamps = asyncHandler(async (req, res, next) => {
  let query;

  const reqQuery = { ...req.query };

  // Fields to remove from query
  const removeFields = ["select", "sort", "limit"];

  removeFields.forEach(index => delete reqQuery[index]);

  let queryStr = JSON.stringify(reqQuery);
  queryStr = queryStr.replace(/\b(gt|gte|lt|lte|in)\b/g, match => `$${match}`);

  query = Bootcamp.find(JSON.parse(queryStr));

  // Select fields
  if (req.query.select) {
    const fields = req.query.select.split(",").join(" ");
    query = query.select(fields);
  }

  // Sort query
  if (req.query.sort) {
    const sortBy = req.query.sort.split(",").join(" ");
    query = query.sort(sortBy);
  } else {
    query = query.sort("-createAt");
  }

  // Pagination

  const page = parseInt(req.query.page, 10) || 1;
  const limit = parseInt(req.query.limit, 10) || 2;
  const startIndex = (page - 1) * limit;
  const endIndex = page * limit;
  const total = await Bootcamp.countDocuments();

  query = query.skip(startIndex).limit(limit);

  const bootcamps = await query;
  const pagination = {};

  if (endIndex < total) {
    pagination.next = {
      page: page + 1,
      limit
    };
  }

  if (startIndex > 0) {
    pagination.prev = {
      page: page - 1,
      limit
    };
  }

  res
    .status(200)
    .json({
      succes: true,
      count: bootcamps.length,
      pagination,
      data: bootcamps
    });
});

//@desc     Get bootcamp by id
//@route    GET /api/v1/bootcamps/:id
//@acces    Public

exports.getBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamps = await Bootcamp.findById(req.params.id);
  if (!bootcamps) {
    return next(
      new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ succes: true, data: bootcamps });
});

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@acces    Private

exports.createBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.create(req.body);

  res.status(200).json({ succes: true, data: bootcamp });
});

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@acces    Private

exports.updateBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  });
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ succes: true, data: bootcamp });
});

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@acces    Private

exports.deleteBootcamp = asyncHandler(async (req, res, next) => {
  const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
  if (!bootcamp) {
    return next(
      new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
    );
  }
  res.status(200).json({ succes: true });
});

//@desc     Get bootcamps in radio
//@route    DELETE /api/v1/bootcamps/radius/:zipcode/:distance
//@acces    Private

exports.getBootcampsInRadius = asyncHandler(async (req, res, next) => {
  const { zipcode, distance } = req.params;
  const loc = await geocoder.geocode(zipcode);

  const lng = loc[0].longitude;
  const lat = loc[0].latitude;

  // Earth radius = 3,963 mi/ 6,378 km

  const radio = distance / 3963;

  const bootcamp = await Bootcamp.find({
    location: { $geoWithin: { $centerSphere: [[lng, lat], radio] } }
  });

  res
    .status(200)
    .json({ succes: true, count: bootcamp.length, data: bootcamp });
});
