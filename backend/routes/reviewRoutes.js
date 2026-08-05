const express = require("express");

const router = express.Router({ mergeParams: true });

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
  getAllReviews,
  getMyReviews,
} = require("../controllers/reviewController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/admin/all",
  protect,
  authorize("admin"),
  getAllReviews
);

router.get(
  "/my",
  protect,
  authorize("customer"),
  getMyReviews
);

router.get("/", getProductReviews);

router.post(
  "/",
  protect,
  authorize("customer"),
  addReview
);

router.put(
  "/:reviewId",
  protect,
  authorize("customer"),
  updateReview
);

router.delete(
  "/:reviewId",
  protect,
  deleteReview
);

module.exports = router;