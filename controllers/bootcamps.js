const Bootcamp = require("../models/Bootcamp");
const ErrorResponse = require("../utils/errorResponse");
//@desc     Get all bootcamps
//@route    GET /api/v1/bootcamps
//@acces    Public

exports.getBootcamps = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.find({});

    res
      .status(200)
      .json({ succes: true, count: bootcamps.length, data: bootcamps });
  } catch (err) {
    next(err);
  }
};

//@desc     Get bootcamp by id
//@route    GET /api/v1/bootcamps/:id
//@acces    Public
exports.getBootcamp = async (req, res, next) => {
  try {
    const bootcamps = await Bootcamp.findById(req.params.id);
    if (!bootcamps) {
      return next(
        new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ succes: true, data: bootcamps });
  } catch (err) {
    // res.status(400).json({ succes: false });
    next(err);
  }
};

//@desc     Create new bootcamp
//@route    POST /api/v1/bootcamps
//@acces    Private
exports.createBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.create(req.body);

    res.status(200).json({ succes: true, data: bootcamp });
  } catch (err) {
    next(err);
  }
};

//@desc     Update a bootcamp
//@route    PUT /api/v1/bootcamps/:id
//@acces    Private
exports.updateBootcamp = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

//@desc     Delete bootcamp
//@route    DELETE /api/v1/bootcamps/:id
//@acces    Private
exports.deleteBootcamp = async (req, res, next) => {
  try {
    const bootcamp = await Bootcamp.findByIdAndDelete(req.params.id);
    if (!bootcamp) {
      return next(
        new ErrorResponse(`Bootcamp not found with ${req.params.id}`, 404)
      );
    }
    res.status(200).json({ succes: true });
  } catch (err) {
    next(err);
  }
};
