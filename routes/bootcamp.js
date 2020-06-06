const express = require("express");
const router = express.Router();
const {
  getBootcamp,
  getBootcamps,
  createBootcamp,
  deleteBootcamp,
  updateBootcamp,
  getBootcampsInRadius
} = require("../controllers/bootcamps");

// Include other resource routers
const courseRouters = require("../routes/courses");

// Re-route
router.use("/:bootcampId/courses", courseRouters);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);

router
  .route("/")
  .get(getBootcamps)
  .post(createBootcamp);

router
  .route("/:id")
  .get(getBootcamp)
  .put(updateBootcamp)
  .delete(deleteBootcamp);

module.exports = router;
