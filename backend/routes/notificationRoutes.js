const express = require("express");

const router = express.Router();

const {
  getNotifications,
  markAsRead,
  deleteNotification,
  getUnreadCount,
} = require("../controllers/notificationController");

const {
  protect,
  authorize,
} = require("../middleware/authMiddleware");

router.use(protect);
router.use(authorize("admin"));

router.get("/", getNotifications);

router.get("/count", getUnreadCount);

router.put("/:id/read", markAsRead);

router.delete("/:id", deleteNotification);

module.exports = router;