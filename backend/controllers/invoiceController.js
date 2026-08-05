const PDFDocument = require("pdfkit");
const Order = require("../models/Order");

const downloadInvoice = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate("user", "name email")
      .populate("items.product");

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

    const doc = new PDFDocument({
      margin: 50,
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    doc
      .fontSize(24)
      .text("TechKart Invoice", {
        align: "center",
      });

    doc.moveDown();

    doc.fontSize(12);

    doc.text(`Invoice ID : ${order._id}`);
    doc.text(
      `Date : ${new Date(
        order.createdAt
      ).toLocaleDateString()}`
    );

    doc.moveDown();

    doc.text(`Customer : ${order.user.name}`);
    doc.text(`Email : ${order.user.email}`);

    doc.moveDown();

    doc.text("Products");

    doc.moveDown(0.5);

    order.items.forEach((item) => {
      doc.text(
        `${item.product.name}   x${item.quantity}`
      );

      doc.text(`₹${item.price}`);

      doc.moveDown(0.3);
    });

    doc.moveDown();

    if (order.discount > 0) {
      doc.text(`Discount : ₹${order.discount}`);
    }

    doc.text(`Total : ₹${order.totalAmount}`);

    doc.moveDown();

    doc.text(
      `Payment : ${order.paymentMethod}`
    );

    doc.text(
      `Status : ${order.orderStatus}`
    );

    doc.end();
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  downloadInvoice,
};