const express = require("express");
const router = express.Router();

const {
  getAdminDashboard,
  getVendorDashboard,
} = require("../controllers/dashboardController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.get(
  "/admin",
  protect,
  authorize("admin"),
  getAdminDashboard
);

router.get(
  "/vendor",
  protect,
  authorize("vendor"),
  getVendorDashboard
);

module.exports = router;