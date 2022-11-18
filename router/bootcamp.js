const express = require("express");
const router = express.Router();
const { protect, authorize } = require("../middleware/auth");
const {
  getBootCamp,
  getBootCamps,
  putBootCamp,
  deleteBootCamp,
  postBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const courseRouter = require("./courses");
const reviewRouter = require("./reviews");

router.use("/:bootcampId/courses", courseRouter);
router.use("/:bootcampId/review", reviewRouter);

router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router
  .route("/")
  .get(getBootCamps)
  .post(protect, authorize("publisher", "admin"), postBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .delete(protect, authorize("publisher", "admin"), deleteBootCamp)
  .put(protect, authorize("publisher", "admin"), putBootCamp);
router
  .route("/:id/photo")
  .put(protect, authorize("publisher", "admin"), bootcampPhotoUpload);
module.exports = router;
