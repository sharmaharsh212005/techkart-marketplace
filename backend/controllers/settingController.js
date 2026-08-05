const Setting = require("../models/Setting");
const logActivity = require("../utils/logActivity");

exports.getSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create({});
    }

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateSettings = async (req, res) => {
  try {
    let settings = await Setting.findOne();

    if (!settings) {
      settings = await Setting.create(req.body);
    } else {
      settings = await Setting.findByIdAndUpdate(
        settings._id,
        req.body,
        {
          new: true,
        }
      );
    }

    await logActivity(
      req.user,
      "Settings Updated",
      "Website settings were updated"
    );

    res.json({
      success: true,
      data: settings,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};