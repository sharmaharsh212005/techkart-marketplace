const Product = require("../models/Product");
const Category = require("../models/Category");
const logActivity = require("../utils/logActivity");

const createProduct = async (req, res) => {
  try {
    const {
      name,
      description,
      category,
      price,
      discountPrice,
      stock,
      images,
      brand,
      featured,
    } = req.body;

    if (!name || !description || !category || !price) {
      return res.status(400).json({
        success: false,
        message: "Please provide all required fields",
      });
    }

    const categoryExists = await Category.findById(category);

    if (!categoryExists) {
      return res.status(404).json({
        success: false,
        message: "Category not found",
      });
    }

    const product = await Product.create({
      name,
      description,
      category,
      vendor:
        req.user.role === "admin"
          ? req.body.vendor
          : req.user._id,
      price,
      discountPrice,
      stock,
      images: Array.isArray(images) ? images : [],
      brand,
      featured,
      approvalStatus:
        req.user.role === "admin" ? "Approved" : "Pending",
    });

    await logActivity(
      req.user,
      "Product Created",
      `${product.name} was created`
    );

    res.status(201).json({
      success: true,
      message:
        req.user.role === "admin"
          ? "Product created successfully."
          : "Product submitted for admin approval.",
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProducts = async (req, res) => {
  try {
    const page = Number(req.query.page) || 1;

    const limit = req.query.limit
        ? Number(req.query.limit)
        : null;

    const skip = limit
        ? (page - 1) * limit
        : 0;
    const filter = {};

    if (req.query.category) {
      filter.category = req.query.category;
    }

    if (req.query.featured) {
      filter.featured = req.query.featured === "true";
    }

    if (req.query.search) {
      filter.name = {
        $regex: req.query.search,
        $options: "i",
      };
    }

    if (req.query.vendor) {
      filter.vendor = req.query.vendor;
    }

    if (req.query.stock === "in") {
      filter.stock = {
        $gt: 0,
      };
    }

    if (req.query.stock === "out") {
      filter.stock = {
        $lte: 0,
      };
    }

    if (req.query.minPrice || req.query.maxPrice) {
      filter.price = {};

      if (req.query.minPrice) {
        filter.price.$gte = Number(req.query.minPrice);
      }

      if (req.query.maxPrice) {
        filter.price.$lte = Number(req.query.maxPrice);
      }
    }

    if (req.query.rating) {
      filter.rating = {
        $gte: Number(req.query.rating),
      };
    }

    if (req.user) {
      if (req.user.role === "vendor") {
        filter.vendor = req.user._id;
      } else if (req.user.role !== "admin") {
        filter.approvalStatus = "Approved";
      }
    } else {
      filter.approvalStatus = "Approved";
    }

    let sort = {
      createdAt: -1,
    };

    switch (req.query.sort) {
      case "priceLow":
        sort = {
          price: 1,
        };
        break;

      case "priceHigh":
        sort = {
          price: -1,
        };
        break;

      case "rating":
        sort = {
          rating: -1,
        };
        break;

      case "stock":
        sort = {
          stock: -1,
        };
        break;

      default:
        sort = {
          createdAt: -1,
        };
    }

    let query = Product.find(filter)
        .populate("category", "name")
        .populate("vendor", "name email shopname")
        .sort(sort);

    if (limit) {

        query = query
            .skip(skip)
            .limit(limit);

    }

    const products = await query;
    const total = await Product.countDocuments(filter);

    res.status(200).json({
      success: true,
      total,
      page,
      pages: limit
        ? Math.ceil(total / limit)
        : 1,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
      .populate("category", "name")
      .populate("vendor", "name email shopname");

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      product.approvalStatus !== "Approved" &&
      (!req.user ||
        (req.user.role === "vendor" &&
          product.vendor._id.toString() !== req.user._id.toString()) ||
        (req.user.role !== "admin" && req.user.role !== "vendor"))
    ) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    res.status(200).json({
      success: true,
      data: product,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role === "vendor" &&
      product.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    if (req.body.category) {
      const categoryExists = await Category.findById(req.body.category);

      if (!categoryExists) {
        return res.status(404).json({
          success: false,
          message: "Category not found",
        });
      }
    }

    Object.assign(product, {
      name: req.body.name ?? product.name,
      description: req.body.description ?? product.description,
      category: req.body.category ?? product.category,
      price: req.body.price ?? product.price,
      discountPrice:
        req.body.discountPrice ?? product.discountPrice,
      stock: req.body.stock ?? product.stock,
      brand: req.body.brand ?? product.brand,
    });

    if (req.body.featured !== undefined) {
      product.featured = req.body.featured;
    }

    if (
      req.user.role === "admin" &&
      req.body.vendor
    ) {
      product.vendor = req.body.vendor;
    }

    if (req.user.role === "vendor") {
      product.approvalStatus = "Pending";
    }

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("vendor", "name email shopname");

    await logActivity(
      req.user,
      "Product Updated",
      `${updatedProduct.name} was updated`
    );

    res.status(200).json({
      success: true,
      message:
        req.user.role === "vendor"
          ? "Product updated and submitted for approval."
          : "Product updated successfully.",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (
      req.user.role === "vendor" &&
      product.vendor.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        success: false,
        message: "Not authorized",
      });
    }

    await product.deleteOne();

    await logActivity(
      req.user,
      "Product Deleted",
      `${product.name} was deleted`
    );

    res.status(200).json({
      success: true,
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getPendingProducts = async (req, res) => {
  try {
    const products = await Product.find({
      approvalStatus: "Pending",
    })
      .populate("category", "name")
      .populate("vendor", "name email shopname")
      .sort({
        createdAt: -1,
      });

    res.status(200).json({
      success: true,
      count: products.length,
      data: products,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.approvalStatus === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Product is already approved",
      });
    }

    product.approvalStatus = "Approved";

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("vendor", "name email shopname");

    await logActivity(
      req.user,
      "Product Approved",
      `${updatedProduct.name} was approved`
    );

    res.status(200).json({
      success: true,
      message: "Product approved successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    if (product.approvalStatus === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Product is already rejected",
      });
    }

    product.approvalStatus = "Rejected";

    await product.save();

    const updatedProduct = await Product.findById(product._id)
      .populate("category", "name")
      .populate("vendor", "name email shopname");

    await logActivity(
      req.user,
      "Product Rejected",
      `${updatedProduct.name} was rejected`
    );

    res.status(200).json({
      success: true,
      message: "Product rejected successfully",
      data: updatedProduct,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

module.exports = {
  createProduct,
  getProducts,
  getProductById,
  updateProduct,
  deleteProduct,
  getPendingProducts,
  approveProduct,
  rejectProduct,
};