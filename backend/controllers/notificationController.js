const Notification = require("../models/Notification");

exports.getNotifications = async (req, res) => {
  const notifications = await Notification.find()
    .sort({ createdAt: -1 });

  res.json(notifications);
};

exports.markAsRead = async (req, res) => {
  const notification =
    await Notification.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );

  res.json(notification);
};

exports.deleteNotification = async (req, res) => {
  await Notification.findByIdAndDelete(req.params.id);

  res.json({
    success: true,
    message: "Notification deleted",
  });
};

exports.getUnreadCount = async (req, res) => {
  const count = await Notification.countDocuments({
    isRead: false,
  });

  res.json({
    count,
  });
};