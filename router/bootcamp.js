const express = require("express");
const router = express.Router();
const {
  getBootCamp,
  getBootCamps,
  putBootCamp,
  deleteBootCamp,
  postBootCamp,
} = require("../controllers/bootcamps");
router.route("/").get(getBootCamps).post(postBootCamp);
router.route("/:id").get(getBootCamp).delete(deleteBootCamp).put(putBootCamp);
module.exports = router;
