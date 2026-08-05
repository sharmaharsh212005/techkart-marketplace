const Activity = require("../models/Activity");

const logActivity = async (user, action, description) => {
  try {
    await Activity.create({
      user: user?._id || null,
      role: user?.role || "",
      action,
      description,
    });
  } catch (err) {
    console.error("Activity Log Error:", err.message);
  }
};

module.exports = logActivity;