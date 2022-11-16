const express = require("express");
const router = express.Router();
const {
  getBootCamp,
  getBootCamps,
  putBootCamp,
  deleteBootCamp,
  postBootCamp,
  getBootcampsInRadius,
  bootcampPhotoUpload,
} = require("../controllers/bootcamps");
const courseRouter=require("./courses")
router.use("/:bootcampId/courses", courseRouter);
router.route("/radius/:zipcode/:distance").get(getBootcampsInRadius);
router.route("/").get(getBootCamps).post(postBootCamp);
router.route("/:id").get(getBootCamp).delete(deleteBootCamp).put(putBootCamp);
router.route("/:id/photo").put(bootcampPhotoUpload);
module.exports = router;
