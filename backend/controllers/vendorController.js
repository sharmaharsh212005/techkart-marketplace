const Product = require("../models/Product");
const Order = require("../models/Order");
const User = require("../models/User");
const logActivity = require("../utils/logActivity");
const Review = require("../models/Review");

const getVendorDashboard = async (req, res) => {
  try {
    const vendorId = req.user._id;

    const products = await Product.find({
      vendor: vendorId,
    });

    const orders = await Order.find({
      "items.vendor": vendorId,
    })
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    const revenue = orders.reduce(
      (sum, order) => sum + Number(order.totalAmount || 0),
      0
    );

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length;

    const lowStock = products.filter(
      (product) => product.stock <= 5
    ).length;

    res.json({
      success: true,
      data: {
        revenue,
        totalProducts: products.length,
        totalOrders: orders.length,
        pendingOrders,
        lowStock,
        recentOrders: orders.slice(0, 5),
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorProducts = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user._id
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: products
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendor": req.user._id
    })
      .populate("user", "name email")
      .populate("items.product", "name images");

    res.json({
      success: true,
      data: orders
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateVendorOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;

    const allowedStatus = [
      "Pending",
      "Processing",
      "Shipped",
      "Delivered",
      "Cancelled"
    ];

    if (!allowedStatus.includes(status)) {
      return res.status(400).json({
        success: false,
        message: "Invalid status"
      });
    }

    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found"
      });
    }

    const ownsOrder = order.items.some(
      (item) =>
        item.vendor.toString() === req.user._id.toString()
    );

    if (!ownsOrder) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    order.orderStatus = status;

    await order.save();

    await logActivity(
      req.user,
      "Order Status Updated",
      `Order #${order._id} status changed to ${status}`
    );

    res.json({
      success: true,
      message: "Order status updated",
      data: order
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVendorProfile = async (req, res) => {
  try {
    const vendor = await User.findById(req.user._id).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    res.json({
      success: true,
      data: vendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateVendorProfile = async (req, res) => {
  try {
    const {
      shopName,
      shopDescription,
      shopAddress,
      gstNumber,
      shopLogo,
      shopBanner,
      shopEmail,
      shopPhone
    } = req.body;

    const vendor = await User.findById(req.user._id);

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    if (shopName !== undefined) {
      vendor.shopName = shopName;
    }

    if (shopDescription !== undefined) {
      vendor.shopDescription = shopDescription;
    }

    if (shopAddress !== undefined) {
      vendor.shopAddress = shopAddress;
    }

    if (gstNumber !== undefined) {
      vendor.gstNumber = gstNumber;
    }

    if (shopLogo !== undefined) {
      vendor.shopLogo = shopLogo;
    }

    if (shopBanner !== undefined) {
      vendor.shopBanner = shopBanner;
    }

    if (shopEmail !== undefined) {
      vendor.shopEmail = shopEmail;
    }

    if (shopPhone !== undefined) {
      vendor.shopPhone = shopPhone;
    }

    await vendor.save();

    const updatedVendor = await User.findById(req.user._id).select("-password");

    await logActivity(
      req.user,
      "Vendor Profile Updated",
      `${updatedVendor.shopName || updatedVendor.name} updated their profile`
    );

    res.json({
      success: true,
      message: "Vendor profile updated successfully",
      data: updatedVendor
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVendorReviews = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user._id
    }).select("_id name images");

    const productIds = products.map((product) => product._id);

    const reviews = await Review.find({
      product: { $in: productIds }
    })
      .populate("product", "name images")
      .populate("user", "name email")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      data: reviews
    });
  } catch (error) {
    console.error(error);

    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getVendorDashboard,
  getVendorProducts,
  getVendorOrders,
  updateVendorOrderStatus,
  getVendorProfile,
  updateVendorProfile,
  getVendorReviews
};