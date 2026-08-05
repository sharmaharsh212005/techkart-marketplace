const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");
const Category = require("../models/Category");
const Coupon = require("../models/Coupon");
const Enquiry = require("../models/Enquiry");
const Activity = require("../models/Activity");
const Notification = require("../models/Notification");

const getAdminDashboard = async (req, res) => {
  try {
    const [
      totalProducts,
      totalOrders,
      totalCustomers,
      totalVendors,
      totalCategories,
      totalCoupons,
      totalEnquiries,
      pendingVendors,
      pendingProducts,
      unreadNotifications,
    ] = await Promise.all([
      Product.countDocuments(),
      Order.countDocuments(),
      User.countDocuments({ role: "customer" }),
      User.countDocuments({ role: "vendor" }),
      Category.countDocuments(),
      Coupon.countDocuments(),
      Enquiry.countDocuments(),
      User.countDocuments({
        role: "vendor",
        vendorStatus: "Pending",
      }),
      Product.countDocuments({
        approvalStatus: "Pending",
      }),
      Notification.countDocuments({
        isRead: false,
      }),
    ]);

    const orders = await Order.find();

    const deliveredOrders = orders.filter(
      (order) => order.orderStatus === "Delivered"
    );

    const pendingOrders = orders.filter(
      (order) => order.orderStatus === "Pending"
    ).length;

    const cancelledOrders = orders.filter(
      (order) => order.orderStatus === "Cancelled"
    ).length;

    const totalRevenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const monthlyRevenue = new Array(12).fill(0);

    deliveredOrders.forEach((order) => {
      const month = new Date(order.createdAt).getMonth();
      monthlyRevenue[month] += order.totalAmount;
    });

    const recentOrders = await Order.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = await Product.find({
      stock: { $lte: 5 },
    })
      .populate("vendor", "name")
      .sort({ stock: 1 })
      .limit(5);

    const recentActivity = await Activity.find()
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(6);

    const topProducts = await Product.find()
      .sort({ sold: -1 })
      .limit(5)
      .select("name sold stock rating");

    res.json({
      success: true,
      data: {
        totalRevenue,

        totalOrders,

        totalProducts,

        totalCustomers,

        totalVendors,

        totalCategories,

        totalCoupons,

        totalEnquiries,

        pendingOrders,

        deliveredOrders: deliveredOrders.length,

        cancelledOrders,

        pendingVendors,

        pendingProducts,

        unreadNotifications,

        monthlyRevenue,

        recentOrders,

        lowStockProducts,

        recentActivity,

        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorDashboard = async (req, res) => {
  try {
    const products = await Product.find({
      vendor: req.user._id,
    });

    const productIds = products.map((p) => p._id.toString());

    const orders = await Order.find({
      "items.vendor": req.user._id,
    });

    let revenue = 0;

    let pendingOrders = 0;

    const monthlyRevenue = new Array(12).fill(0);

    orders.forEach((order) => {
      if (order.orderStatus === "Pending") {
        pendingOrders++;
      }

      order.items.forEach((item) => {
        if (
          productIds.includes(item.product.toString()) &&
          order.orderStatus === "Delivered"
        ) {
          const amount = item.price * item.quantity;

          revenue += amount;

          const month = new Date(order.createdAt).getMonth();

          monthlyRevenue[month] += amount;
        }
      });
    });

    const recentOrders = await Order.find({
      "items.vendor": req.user._id,
    })
      .populate("user", "name")
      .sort({ createdAt: -1 })
      .limit(5);

    const lowStockProducts = products
      .filter((product) => product.stock <= 5)
      .sort((a, b) => a.stock - b.stock)
      .slice(0, 5);

    const topProducts = [...products]
      .sort((a, b) => (b.sold || 0) - (a.sold || 0))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        revenue,

        products: products.length,

        orders: orders.length,

        pendingOrders,

        monthlyRevenue,

        recentOrders,

        lowStockProducts,

        topProducts,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  getAdminDashboard,
  getVendorDashboard,
};