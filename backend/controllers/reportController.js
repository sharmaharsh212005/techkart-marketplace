const { Parser } = require("json2csv");

const Order = require("../models/Order");
const Product = require("../models/Product");
const User = require("../models/User");

const getAnalytics = async (req, res) => {
  try {
    const [
      totalOrders,
      totalProducts,
      totalUsers,
      totalVendors,
    ] = await Promise.all([
      Order.countDocuments(),
      Product.countDocuments(),
      User.countDocuments({
        role: "customer",
      }),
      User.countDocuments({
        role: "vendor",
      }),
    ]);

    const deliveredOrders = await Order.find({
      orderStatus: "Delivered",
    });

    const revenue = deliveredOrders.reduce(
      (sum, order) => sum + order.totalAmount,
      0
    );

    const monthlyRevenue = new Array(12).fill(0);

    deliveredOrders.forEach((order) => {
      const month = new Date(
        order.createdAt
      ).getMonth();

      monthlyRevenue[month] +=
        order.totalAmount;
    });

    const topProducts = await Product.find()
      .sort({
        sold: -1,
      })
      .limit(5)
      .select(
        "name sold stock rating"
      );

    const topVendors = await User.find({
      role: "vendor",
    })
      .sort({
        shopRating: -1,
      })
      .limit(5)
      .select(
        "name shopName shopRating totalReviews"
      );

    res.json({
      success: true,
      data: {
        revenue,

        totalOrders,

        totalProducts,

        totalUsers,

        totalVendors,

        monthlyRevenue,

        topProducts,

        topVendors,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email");

    const data = orders.map((order) => ({
      OrderID: order._id,
      Customer: order.user?.name || "",
      Email: order.user?.email || "",
      Total: order.totalAmount,
      Payment: order.paymentMethod,
      Status: order.orderStatus,
      Date: order.createdAt.toLocaleDateString(),
    }));

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("orders-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportProducts = async (req, res) => {
  try {
    const products = await Product.find()
      .populate("vendor", "name");

    const data = products.map((product) => ({
      Product: product.name,
      Vendor: product.vendor?.name || "",
      Price: product.price,
      DiscountPrice: product.discountPrice,
      Stock: product.stock,
      Rating: product.rating,
      Reviews: product.numReviews,
      Status: product.approvalStatus,
    }));

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("products-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportUsers = async (req, res) => {
  try {
    const users = await User.find({
      role: "customer",
    });

    const data = users.map((user) => ({
      Name: user.name,
      Email: user.email,
      Phone: user.phone,
      Joined: user.createdAt.toLocaleDateString(),
      Status: user.isActive ? "Active" : "Inactive",
    }));

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("users-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const exportVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
    });

    const data = vendors.map((vendor) => ({
      Name: vendor.name,
      Shop: vendor.shopName,
      Email: vendor.email,
      Phone: vendor.phone,
      Rating: vendor.shopRating,
      Reviews: vendor.totalReviews,
      Status: vendor.vendorStatus,
      Joined: vendor.createdAt.toLocaleDateString(),
    }));

    const parser = new Parser();

    const csv = parser.parse(data);

    res.header("Content-Type", "text/csv");
    res.attachment("vendors-report.csv");

    return res.send(csv);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
module.exports = {
  getAnalytics,

  exportOrders,

  exportProducts,

  exportUsers,

  exportVendors,
};