const express = require("express");

const {
  getVendorDashboard,
  getVendorProducts,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorProfile,
  updateVendorProfile,
  getVendorReviews
} = require("../controllers/vendorController");

const {
  createProduct,
  getProducts,
  updateProduct,
  deleteProduct
} = require("../controllers/productController");

const {
  protect,
  authorize
} = require("../middleware/authMiddleware");

const router = express.Router();

router.use(protect);
router.use(authorize("vendor"));

router.get(
  "/dashboard",
  getVendorDashboard
);

router.get(
  "/products",
  getProducts
);

router.post(
  "/products",
  createProduct
);

router.put(
  "/products/:id",
  updateProduct
);

router.delete(
  "/products/:id",
  deleteProduct
);

router.get(
  "/orders",
  getVendorOrders
);

router.put(
  "/orders/:id/status",
  updateVendorOrderStatus
);

router.get(
  "/reviews",
  getVendorReviews
);

router.get(
  "/profile",
  getVendorProfile
);

router.put(
  "/profile",
  updateVendorProfile
);

module.exports = router;