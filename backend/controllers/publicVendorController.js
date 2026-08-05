const User = require("../models/User");
const Product = require("../models/Product");
const Review = require("../models/Review");

const getAllVendors = async (req, res) => {
  try {
    const vendors = await User.find({
      role: "vendor",
      vendorStatus: "Approved",
      isActive: true
    })
      .select(
        "name shopName shopLogo shopBanner shopDescription shopAddress shopRating totalReviews"
      )
      .sort({ shopName: 1 });

    const vendorsWithStats = await Promise.all(
      vendors.map(async (vendor) => {
        const totalProducts = await Product.countDocuments({
          vendor: vendor._id,
          isActive: true
        });

        return {
          ...vendor.toObject(),
          totalProducts
        };
      })
    );

    res.json({
      success: true,
      count: vendorsWithStats.length,
      data: vendorsWithStats
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getVendorStore = async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "vendor",
      vendorStatus: "Approved",
      isActive: true
    }).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found"
      });
    }

    const products = await Product.find({
      vendor: vendor._id,
      isActive: true
    })
      .populate("category", "name")
      .sort({ createdAt: -1 });

    const productIds = products.map((product) => product._id);

    const reviews = await Review.find({
      product: {
        $in: productIds
      }
    })
      .populate("user", "name")
      .populate("product", "name")
      .sort({ createdAt: -1 });

    const averageRating =
      reviews.length > 0
        ? Number(
            (
              reviews.reduce(
                (sum, review) => sum + review.rating,
                0
              ) / reviews.length
            ).toFixed(1)
          )
        : 0;

    const categories = [
      ...new Set(
        products
          .filter((product) => product.category)
          .map((product) => product.category.name)
      )
    ];

    res.json({
      success: true,
      data: {
        vendor: {
          ...vendor.toObject(),
          shopRating: averageRating,
          totalReviews: reviews.length
        },
        products,
        reviews,
        categories,
        totalProducts: products.length
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  getAllVendors,
  getVendorStore
};