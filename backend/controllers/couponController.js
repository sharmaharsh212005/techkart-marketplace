const Coupon = require("../models/Coupon");
const logActivity = require("../utils/logActivity");

exports.createCoupon = async (req, res) => {
  try {
    const {
      code,
      description,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      expiryDate,
    } = req.body;

    const existing = await Coupon.findOne({
      code: code.toUpperCase(),
    });

    if (existing) {
      return res.status(400).json({
        success: false,
        message: "Coupon already exists",
      });
    }

    const coupon = await Coupon.create({
      code: code.toUpperCase(),
      description,
      discountType,
      discountValue,
      minimumAmount,
      maximumDiscount,
      usageLimit,
      expiryDate,
    });

    await logActivity(
      req.user,
      "Coupon Created",
      `Coupon ${coupon.code} was created`
    );

    res.status(201).json({
      success: true,
      data: coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.getCoupons = async (req, res) => {
  try {
    const coupons = await Coupon.find().sort({
      createdAt: -1,
    });

    res.json({
      success: true,
      data: coupons,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.updateCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
      }
    );

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    await logActivity(
      req.user,
      "Coupon Updated",
      `Coupon ${coupon.code} was updated`
    );

    res.json({
      success: true,
      data: coupon,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.deleteCoupon = async (req, res) => {
  try {
    const coupon = await Coupon.findById(req.params.id);

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Coupon not found",
      });
    }

    const couponCode = coupon.code;

    await coupon.deleteOne();

    await logActivity(
      req.user,
      "Coupon Deleted",
      `Coupon ${couponCode} was deleted`
    );

    res.json({
      success: true,
      message: "Coupon deleted",
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

exports.validateCoupon = async (req, res) => {
  try {
    const { code, total } = req.body;

    const coupon = await Coupon.findOne({
      code: code.toUpperCase(),
      isActive: true,
    });

    if (!coupon) {
      return res.status(404).json({
        success: false,
        message: "Invalid coupon",
      });
    }

    if (new Date() > coupon.expiryDate) {
      return res.status(400).json({
        success: false,
        message: "Coupon expired",
      });
    }

    if (coupon.usageLimit && coupon.usedCount >= coupon.usageLimit) {
      return res.status(400).json({
        success: false,
        message: "Coupon usage limit exceeded",
      });
    }

    if (total < coupon.minimumAmount) {
      return res.status(400).json({
        success: false,
        message: `Minimum order amount is ₹${coupon.minimumAmount}`,
      });
    }

    let discount = 0;

    if (coupon.discountType === "percentage") {
      discount = (total * coupon.discountValue) / 100;

      if (
        coupon.maximumDiscount &&
        discount > coupon.maximumDiscount
      ) {
        discount = coupon.maximumDiscount;
      }
    } else {
      discount = coupon.discountValue;
    }

    res.json({
      success: true,
      coupon,
      discount,
      finalAmount: total - discount,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};