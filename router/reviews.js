const express = require("express");
const {
  getReviews,
  getReview,
  addReview,
  updateReview,
  deleteReview,
} = require("../controllers/reviews");
const Review = require("../models/review");
const router = express.Router({ mergeParams: true });
const { protect, authorize } = require("../middleware/auth");

router
  .route("/")
  .get(protect, getReviews)
  .post(protect, authorize("admin", "user"), addReview);
router
  .route("/:id")
  .get(protect, getReview)
  .delete(protect, deleteReview)
  .put(protect, updateReview);

module.exports = router;
