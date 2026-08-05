const Enquiry = require("../models/Enquiry");
const Product = require("../models/Product");

const createEnquiry = async (req, res) => {
  try {
    const { productId, subject, message } = req.body;

    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    const enquiry = await Enquiry.create({
      customer: req.user._id,
      vendor: product.vendor,
      product: product._id,
      subject,
      message
    });

    const populatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("customer", "name email")
      .populate("vendor", "name shopName")
      .populate("product", "name images");

    res.status(201).json({
      success: true,
      message: "Enquiry sent successfully",
      data: populatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCustomerEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      customer: req.user._id
    })
      .populate("vendor", "shopName name shopLogo")
      .populate("product", "name images")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVendorEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find({
      vendor: req.user._id
    })
      .populate("customer", "name email phone")
      .populate("product", "name images price")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const replyToEnquiry = async (req, res) => {
  try {
    const { vendorReply } = req.body;

    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    if (enquiry.vendor.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    enquiry.vendorReply = vendorReply;
    enquiry.status = "Replied";

    await enquiry.save();

    const updatedEnquiry = await Enquiry.findById(enquiry._id)
      .populate("customer", "name email")
      .populate("vendor", "shopName")
      .populate("product", "name");

    res.json({
      success: true,
      message: "Reply sent successfully",
      data: updatedEnquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const closeEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found"
      });
    }

    if (enquiry.customer.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: "Unauthorized"
      });
    }

    enquiry.status = "Closed";

    await enquiry.save();

    res.json({
      success: true,
      message: "Enquiry closed successfully",
      data: enquiry
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const deleteEnquiry = async (req, res) => {
  try {
    const enquiry = await Enquiry.findById(req.params.id);

    if (!enquiry) {
      return res.status(404).json({
        success: false,
        message: "Enquiry not found",
      });
    }

    await enquiry.deleteOne();

    res.json({
      success: true,
      message: "Enquiry deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getAllEnquiries = async (req, res) => {
  try {
    const enquiries = await Enquiry.find()
      .populate("customer", "name email")
      .populate("vendor", "shopName name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      count: enquiries.length,
      data: enquiries
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  createEnquiry,
  getCustomerEnquiries,
  getVendorEnquiries,
  replyToEnquiry,
  closeEnquiry,
  deleteEnquiry,
  getAllEnquiries,
};