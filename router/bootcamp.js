const express = require("express");
const router = express.Router();
const { protect } = require("../middleware/auth");
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
router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootCamps).post(protect, postBootCamp);
router
  .route("/:id")
  .get(getBootCamp)
  .delete(protect, deleteBootCamp)
  .put(protect, putBootCamp);
router.route("/:id/photo").put(protect, bootcampPhotoUpload);
module.exports = router;
