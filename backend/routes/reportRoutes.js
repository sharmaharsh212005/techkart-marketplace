const express = require("express");

const router = express.Router();

const {
  getAnalytics,
  exportOrders,
  exportProducts,
  exportUsers,
  exportVendors,
} = require("../controllers/reportController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/analytics",
  protect,
  authorize("admin"),
  getAnalytics
);

router.get(
  "/orders",
  protect,
  authorize("admin"),
  exportOrders
);

router.get(
  "/products",
  protect,
  authorize("admin"),
  exportProducts
);

router.get(
  "/users",
  protect,
  authorize("admin"),
  exportUsers
);

router.get(
  "/vendors",
  protect,
  authorize("admin"),
  exportVendors
);

module.exports = router;