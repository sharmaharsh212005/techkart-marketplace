const Activity = require("../models/Activity");

exports.getActivities = async (req, res) => {
  try {
    const activities = await Activity.find()
      .populate("user", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: activities,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};