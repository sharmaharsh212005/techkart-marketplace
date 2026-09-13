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
      size: "A4",
      margin: 0,
      info: {
        Title: `TechKart Invoice - ${order._id}`,
        Author: "TechKart",
        Subject: "Order Invoice",
      },
    });

    res.setHeader(
      "Content-Type",
      "application/pdf"
    );

    res.setHeader(
      "Content-Disposition",
      `attachment; filename=TechKart-Invoice-${order._id}.pdf`
    );

    doc.pipe(res);

    const COLORS = {
      navy: "#071426",
      dark: "#0B1B30",
      blue: "#2563EB",
      lightBlue: "#EFF6FF",
      text: "#172033",
      muted: "#64748B",
      border: "#DCE3EC",
      white: "#FFFFFF",
      light: "#F7F9FC",
      green: "#16A34A",
      greenLight: "#ECFDF5",
      orange: "#F59E0B",
      orangeLight: "#FFF7ED",
      red: "#DC2626",
      redLight: "#FEF2F2",
    };

    const PAGE_WIDTH = 595.28;
    const PAGE_HEIGHT = 841.89;

    const LEFT = 50;
    const RIGHT = 545;
    const CONTENT_WIDTH = RIGHT - LEFT;

    const formatDate = (date) => {
      if (!date) return "N/A";

      return new Date(date).toLocaleDateString(
        "en-IN",
        {
          day: "2-digit",
          month: "short",
          year: "numeric",
        }
      );
    };

    const formatTime = (date) => {
      if (!date) return "";

      return new Date(date).toLocaleTimeString(
        "en-IN",
        {
          hour: "2-digit",
          minute: "2-digit",
        }
      );
    };

    const formatCurrency = (value) => {
      const number = Number(value || 0);

      return `INR ${number.toLocaleString("en-IN")}`;
    };

    const getStatusColors = (status) => {
      const normalized =
        String(status || "")
          .toLowerCase();

      if (normalized === "delivered") {
        return {
          text: COLORS.green,
          background: COLORS.greenLight,
        };
      }

      if (normalized === "cancelled") {
        return {
          text: COLORS.red,
          background: COLORS.redLight,
        };
      }

      if (
        normalized === "processing" ||
        normalized === "shipped"
      ) {
        return {
          text: COLORS.blue,
          background: COLORS.lightBlue,
        };
      }

      return {
        text: COLORS.orange,
        background: COLORS.orangeLight,
      };
    };

    const drawRoundedRect = (
      x,
      y,
      width,
      height,
      radius,
      fill,
      stroke = null
    ) => {
      doc
        .roundedRect(
          x,
          y,
          width,
          height,
          radius
        );

      if (fill && stroke) {
        doc
          .fillAndStroke(fill, stroke);
      } else if (fill) {
        doc.fill(fill);
      } else if (stroke) {
        doc.stroke(stroke);
      }
    };

    doc
      .rect(
        0,
        0,
        PAGE_WIDTH,
        118
      )
      .fill(COLORS.navy);

    doc
      .font("Helvetica-Bold")
      .fontSize(28)
      .fillColor(COLORS.white)
      .text(
        "Tech",
        LEFT,
        32,
        {
          continued: true,
        }
      );

    doc
      .fillColor("#4D8DFF")
      .text("Kart");

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#AFC1D8")
      .text(
        "Electronics Marketplace",
        LEFT,
        67
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(26)
      .fillColor(COLORS.white)
      .text(
        "INVOICE",
        385,
        32,
        {
          width: 160,
          align: "right",
        }
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor("#AFC1D8")
      .text(
        `Invoice #${String(order._id)
          .slice(-8)
          .toUpperCase()}`,
        385,
        67,
        {
          width: 160,
          align: "right",
        }
      );
    let y = 150;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        "INVOICE DATE",
        LEFT,
        y
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(COLORS.text)
      .text(
        formatDate(order.createdAt),
        LEFT,
        y + 17
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        formatTime(order.createdAt),
        LEFT,
        y + 34
      );

    const customerX = 310;

    doc
      .font("Helvetica-Bold")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        "BILL TO",
        customerX,
        y
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(13)
      .fillColor(COLORS.text)
      .text(
        order.user?.name || "Customer",
        customerX,
        y + 17
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        order.user?.email || "",
        customerX,
        y + 36
      );

    y = 225;

    doc
      .moveTo(LEFT, y)
      .lineTo(RIGHT, y)
      .lineWidth(1)
      .strokeColor(COLORS.border)
      .stroke();


    y += 22;

    const tableX = LEFT;
    const tableWidth = CONTENT_WIDTH;

    const colProduct = tableX;
    const colQty = 345;
    const colUnit = 395;
    const colTotal = 475;

    const headerHeight = 32;

    drawRoundedRect(
      tableX,
      y,
      tableWidth,
      headerHeight,
      6,
      COLORS.dark
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(COLORS.white)
      .text(
        "PRODUCT",
        colProduct + 12,
        y + 11
      );

    doc
      .text(
        "QTY",
        colQty,
        y + 11,
        {
          width: 35,
          align: "center",
        }
      );

    doc
      .text(
        "UNIT PRICE",
        colUnit - 5,
        y + 11,
        {
          width: 70,
          align: "right",
        }
      );

    doc
      .text(
        "TOTAL",
        colTotal,
        y + 11,
        {
          width: 60,
          align: "right",
        }
      );

    y += headerHeight;

    const rowHeight = 54;

    order.items.forEach((item, index) => {
      const productName =
        item.product?.name ||
        "Product";

      const quantity =
        Number(item.quantity || 0);

      const unitPrice =
        Number(item.price || 0);

      const itemTotal =
        unitPrice * quantity;

      if (index % 2 === 0) {
        doc
          .rect(
            tableX,
            y,
            tableWidth,
            rowHeight
          )
          .fill("#F8FAFC");
      }

      doc
        .font("Helvetica-Bold")
        .fontSize(9.5)
        .fillColor(COLORS.text)
        .text(
          productName,
          colProduct + 12,
          y + 12,
          {
            width: 270,
            ellipsis: true,
          }
        );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.muted)
        .text(
          String(quantity),
          colQty,
          y + 18,
          {
            width: 35,
            align: "center",
          }
        );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
          formatCurrency(unitPrice),
          colUnit - 5,
          y + 18,
          {
            width: 70,
            align: "right",
          }
        );

      doc
        .font("Helvetica-Bold")
        .fontSize(9)
        .fillColor(COLORS.text)
        .text(
          formatCurrency(itemTotal),
          colTotal,
          y + 18,
          {
            width: 60,
            align: "right",
          }
        );

      doc
        .moveTo(
          tableX,
          y + rowHeight
        )
        .lineTo(
          tableX + tableWidth,
          y + rowHeight
        )
        .lineWidth(0.6)
        .strokeColor(COLORS.border)
        .stroke();

      y += rowHeight;
    });

    y += 24;

    const summaryX = 330;
    const summaryWidth = 215;

    const discount =
      Number(order.discount || 0);

    let subtotal = 0;

    order.items.forEach((item) => {
      subtotal +=
        Number(item.price || 0) *
        Number(item.quantity || 0);
    });

    drawRoundedRect(
      summaryX,
      y,
      summaryWidth,
      discount > 0 ? 128 : 102,
      10,
      COLORS.light,
      COLORS.border
    );

    let summaryY = y + 17;

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.muted)
      .text(
        "Subtotal",
        summaryX + 15,
        summaryY
      );

    doc
      .font("Helvetica")
      .fontSize(9)
      .fillColor(COLORS.text)
      .text(
        formatCurrency(subtotal),
        summaryX + 15,
        summaryY,
        {
          width: summaryWidth - 30,
          align: "right",
        }
      );

    summaryY += 24;

    if (discount > 0) {
      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.green)
        .text(
          "Discount",
          summaryX + 15,
          summaryY
        );

      doc
        .font("Helvetica")
        .fontSize(9)
        .fillColor(COLORS.green)
        .text(
          `- ${formatCurrency(discount)}`,
          summaryX + 15,
          summaryY,
          {
            width: summaryWidth - 30,
            align: "right",
          }
        );

      summaryY += 24;
    }

    doc
      .moveTo(
        summaryX + 15,
        summaryY
      )
      .lineTo(
        summaryX +
          summaryWidth -
          15,
        summaryY
      )
      .lineWidth(0.8)
      .strokeColor(COLORS.border)
      .stroke();

    summaryY += 14;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(
        "TOTAL",
        summaryX + 15,
        summaryY
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(15)
      .fillColor(COLORS.blue)
      .text(
        formatCurrency(
          order.totalAmount
        ),
        summaryX + 15,
        summaryY - 2,
        {
          width: summaryWidth - 30,
          align: "right",
        }
      );

    y += discount > 0 ? 155 : 130;

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(
        "PAYMENT INFORMATION",
        LEFT,
        y
      );

    y += 18;

    drawRoundedRect(
      LEFT,
      y,
      235,
      58,
      8,
      COLORS.light,
      COLORS.border
    );

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        "Payment Method",
        LEFT + 14,
        y + 11
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(COLORS.text)
      .text(
        order.paymentMethod ||
          "Not specified",
        LEFT + 14,
        y + 28
      );

    const statusBoxX = 300;

    const statusColors =
      getStatusColors(
        order.orderStatus
      );

    drawRoundedRect(
      statusBoxX,
      y,
      245,
      58,
      8,
      statusColors.background,
      COLORS.border
    );

    doc
      .font("Helvetica")
      .fontSize(8)
      .fillColor(COLORS.muted)
      .text(
        "Order Status",
        statusBoxX + 14,
        y + 11
      );

    doc
      .font("Helvetica-Bold")
      .fontSize(10)
      .fillColor(statusColors.text)
      .text(
        order.orderStatus ||
          "Pending",
        statusBoxX + 14,
        y + 28
      );

    y += 95;

    drawRoundedRect(
      LEFT,
      y,
      CONTENT_WIDTH,
      72,
      10,
      COLORS.lightBlue
    );

    doc
      .font("Helvetica-Bold")
      .fontSize(12)
      .fillColor(COLORS.blue)
      .text(
        "Thank you for shopping with TechKart!",
        LEFT + 18,
        y + 17,
        {
          width: CONTENT_WIDTH - 36,
          align: "center",
        }
      );

    doc
      .font("Helvetica")
      .fontSize(8.5)
      .fillColor(COLORS.muted)
      .text(
        "We appreciate your business and hope to serve you again.",
        LEFT + 18,
        y + 39,
        {
          width: CONTENT_WIDTH - 36,
          align: "center",
        }
      );

    const footerY =
      PAGE_HEIGHT - 48;

    doc
      .moveTo(
        LEFT,
        footerY - 12
      )
      .lineTo(
        RIGHT,
        footerY - 12
      )
      .lineWidth(0.8)
      .strokeColor(COLORS.border)
      .stroke();

    doc
      .font("Helvetica-Bold")
      .fontSize(8)
      .fillColor(COLORS.text)
      .text(
        "TechKart",
        LEFT,
        footerY
      );

    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(
        "Your trusted electronics marketplace",
        LEFT + 45,
        footerY
      );

    doc
      .font("Helvetica")
      .fontSize(7.5)
      .fillColor(COLORS.muted)
      .text(
        `Invoice ID: ${order._id}`,
        370,
        footerY,
        {
          width: 175,
          align: "right",
        }
      );

    doc.end();

  } catch (err) {
    console.error(
      "Invoice generation error:",
      err
    );

    if (!res.headersSent) {
      return res.status(500).json({
        success: false,
        message:
          err.message ||
          "Unable to generate invoice",
      });
    }
  }
};

module.exports = {
  downloadInvoice,
};