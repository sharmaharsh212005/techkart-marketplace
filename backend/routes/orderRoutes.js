const express = require("express");

const {
  placeOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
} = require("../controllers/orderController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("customer"), placeOrder);

router.get("/my-orders", protect, authorize("customer"), getMyOrders);

router.get("/vendor", protect, authorize("vendor"), getVendorOrders);

router.get("/:id", protect, getOrderById);

router.put(
  "/:id/cancel",
  protect,
  authorize("customer"),
  cancelOrder
);

router.get(
  "/",
  protect,
  authorize("admin"),
  getAllOrders
);

router.put(
  "/:id/status",
  protect,
  authorize("admin"),
  updateOrderStatus
);

router.delete(
  "/:id",
  protect,
  authorize("admin"),
  deleteOrder
);

module.exports = router;