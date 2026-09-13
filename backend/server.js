const express = require("express");
const cors = require("cors");
const path = require("path");
require("dotenv").config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const userRoutes = require("./routes/userRoutes");
const vendorRoutes = require("./routes/vendorRoutes");
const publicVendorRoutes = require("./routes/publicVendorRoutes");
const categoryRoutes = require("./routes/categoryRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const enquiryRoutes = require("./routes/enquiryRoutes");
const couponRoutes = require("./routes/couponRoutes");
const invoiceRoutes = require("./routes/invoiceRoutes");
const uploadRoutes = require("./routes/uploadRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const cmsRoutes = require("./routes/cmsRoutes");
const settingRoutes = require("./routes/settingRoutes");
const reportRoutes = require("./routes/reportRoutes");
const notificationRoutes = require("./routes/notificationRoutes");
const reviewRoutes = require("./routes/reviewRoutes");
const activityRoutes = require("./routes/activityRoutes");
const questionRoutes = require("./routes/questionRoutes");

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://techkart-marketplace.vercel.app",
  "https://techkart-marketplace-1.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin) {
        return callback(null, true);
      }

      if (allowedOrigins.includes(origin)) {
        return callback(null, true);
      }

      return callback(new Error("Not allowed by CORS"));
    },

    credentials: true,

    methods: [
      "GET",
      "POST",
      "PUT",
      "PATCH",
      "DELETE",
      "OPTIONS",
    ],

    allowedHeaders: [
      "Content-Type",
      "Authorization",
    ],
  })
);
connectDB();

app.use(express.json());
app.use(
  "/uploads",
  express.static(path.join(__dirname, "uploads"))
);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/vendors", publicVendorRoutes);
app.use("/api/vendor", vendorRoutes);
app.use("/api/categories", categoryRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/enquiries", enquiryRoutes);
app.use("/api/coupons", couponRoutes);
app.use("/api/invoice", invoiceRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/cms", cmsRoutes);
app.use("/api/settings", settingRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/notifications", notificationRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products/:id/reviews", reviewRoutes);
app.use("/api/activity", activityRoutes);
app.use("/api/questions", questionRoutes);


app.get("/", (req, res) => {
  res.json({
    success: true,
    message: "🚀 Welcome to TechKart Backend API",
  });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(
    `🚀 Server running on http://localhost:${PORT}`
  );
});