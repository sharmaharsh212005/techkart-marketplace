const express = require("express");

const {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
} = require("../controllers/productController");

const {
  addReview,
  getProductReviews,
  updateReview,
  deleteReview,
} = require("../controllers/reviewController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const upload = require("../middleware/uploadMiddleware");

const router = express.Router();

router.get("/", getProducts);

router.get("/:id", getProductById);

router.get("/:id/reviews", getProductReviews);

router.post(
  "/:id/reviews",
  protect,
  authorize("customer"),
  addReview
);

router.put(
  "/:id/reviews/:reviewId",
  protect,
  authorize("customer"),
  updateReview
);

router.delete(
  "/:id/reviews/:reviewId",
  protect,
  authorize("customer", "admin"),
  deleteReview
);

router.post(
  "/",
  protect,
  authorize("admin", "vendor"),
  upload.single("image"),
  createProduct
);

router.put(
  "/:id",
  protect,
  authorize("admin", "vendor"),
  upload.single("image"),
  updateProduct
);

router.delete(
  "/:id",
  protect,
  authorize("admin", "vendor"),
  deleteProduct
);

router.get(
  "/pending",
  protect,
  authorize("admin"),
  getPendingProducts
);

router.put(
  "/:id/approve",
  protect,
  authorize("admin"),
  approveProduct
);

router.put(
  "/:id/reject",
  protect,
  authorize("admin"),
  rejectProduct
);

module.exports = router;