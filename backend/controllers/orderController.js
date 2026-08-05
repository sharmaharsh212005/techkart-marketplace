const Order = require("../models/Order");
const Product = require("../models/Product");
const Cart = require("../models/Cart");
const Coupon = require("../models/Coupon");
const logActivity = require("../utils/logActivity");

const placeOrder = async (req, res) => {
  try {
    const {
      items,
      shippingAddress,
      paymentMethod,
      coupon,
      discount = 0,
      totalAmount,
    } = req.body;

    if (!items || items.length === 0) {
      return res.status(400).json({
        success: false,
        message: "No order items",
      });
    }

    let calculatedTotal = 0;
    const orderItems = [];

    for (const item of items) {
      const product = await Product.findById(item.product);

      if (!product) {
        return res.status(404).json({
          success: false,
          message: "Product not found",
        });
      }

      if (product.stock < item.quantity) {
        return res.status(400).json({
          success: false,
          message: `${product.name} is out of stock`,
        });
      }

      const sellingPrice =
        product.discountPrice > 0
          ? product.discountPrice
          : product.price;

      product.stock -= item.quantity;
      await product.save();

      orderItems.push({
        product: product._id,
        vendor: product.vendor,
        quantity: item.quantity,
        price: sellingPrice,
      });

      calculatedTotal += sellingPrice * item.quantity;
    }

    let appliedCoupon = null;

    if (coupon) {
      appliedCoupon = await Coupon.findById(coupon);

      if (!appliedCoupon) {
        return res.status(404).json({
          success: false,
          message: "Coupon not found",
        });
      }
    }

    const order = await Order.create({
      user: req.user._id,
      items: orderItems,
      shippingAddress,
      paymentMethod,
      totalAmount:
        totalAmount || calculatedTotal - discount,
      discount,
      coupon: appliedCoupon?._id || null,
    });

    if (appliedCoupon) {
      appliedCoupon.usedCount += 1;
      await appliedCoupon.save();
    }

    const cart = await Cart.findOne({
      user: req.user._id,
    });

    if (cart) {
      cart.items = [];
      await cart.save();
    }

    await logActivity(
      req.user,
      "Order Placed",
      `Order #${order._id} was placed`
    );

    res.status(201).json({
      success: true,
      message: "Order placed successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    })
      .populate("items.product")
      .populate("items.vendor", "name email")
      .populate("coupon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getOrderById = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product")
      .populate("items.vendor", "name email")
      .populate("coupon");

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (
      req.user.role === "customer" &&
      order.user._id.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    res.json({
      success: true,
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getVendorOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      "items.vendor": req.user._id,
    })
      .populate("user", "name email")
      .populate("items.product")
      .populate("items.vendor", "name email")
      .populate("coupon")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()
      .populate("user", "name email")
      .populate("items.product")
      .populate("items.vendor", "name email")
      .populate("coupon")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: orders.length,
      data: orders,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const previousStatus = order.orderStatus;

    if (req.body.orderStatus) {
      order.orderStatus = req.body.orderStatus;
    }

    if (req.body.paymentStatus) {
      order.paymentStatus = req.body.paymentStatus;
    }

    if (
      previousStatus !== "Delivered" &&
      order.orderStatus === "Delivered"
    ) {
      for (const item of order.items) {
        await Product.findByIdAndUpdate(item.product, {
          $inc: {
            sold: item.quantity,
          },
        });
      }
    }

    await order.save();

    await logActivity(
      req.user,
      "Order Updated",
      `Order #${order._id} updated to status ${order.orderStatus}`
    );

    res.json({
      success: true,
      message: "Order updated successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const cancelOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    if (order.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (order.orderStatus !== "Pending") {
      return res.status(400).json({
        success: false,
        message: "Order cannot be cancelled",
      });
    }

    order.orderStatus = "Cancelled";

    for (const item of order.items) {
      const product = await Product.findById(item.product);

      if (product) {
        product.stock += item.quantity;
        await product.save();
      }
    }

    await order.save();

    await logActivity(
      req.user,
      "Order Cancelled",
      `Order #${order._id} was cancelled`
    );

    res.json({
      success: true,
      message: "Order cancelled successfully",
      data: order,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteOrder = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        success: false,
        message: "Order not found",
      });
    }

    const orderId = order._id;

    await order.deleteOne();

    await logActivity(
      req.user,
      "Order Deleted",
      `Order #${orderId} was deleted`
    );

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  placeOrder,
  getMyOrders,
  getOrderById,
  getVendorOrders,
  getAllOrders,
  updateOrderStatus,
  cancelOrder,
  deleteOrder,
};