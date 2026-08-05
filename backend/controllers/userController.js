const User = require("../models/User");
const Product = require("../models/Product");
const logActivity = require("../utils/logActivity");

/* ===========================
   User Management
=========================== */

const getUsers = async (req, res) => {
  try {
    const users = await User.find()
      .select("-password")
      .sort({ createdAt: -1 });

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select(
      "-password"
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body;

    const allowedRoles = [
      "admin",
      "vendor",
      "customer",
    ];

    if (!allowedRoles.includes(role)) {
      return res.status(400).json({
        success: false,
        message: "Invalid role",
      });
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      {
        new: true,
        runValidators: true,
      }
    ).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    await logActivity(
      req.user,
      "User Role Updated",
      `${user.name} role changed to ${user.role}`
    );

    res.status(200).json({
      success: true,
      message: "Role updated successfully",
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const userName = user.name;

    await user.deleteOne();

    await logActivity(
      req.user,
      "User Deleted",
      `${userName} was deleted`
    );

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

/* ===========================
   Wishlist
=========================== */

const getWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).populate({
      path: "wishlist",
      populate: {
        path: "category vendor",
      },
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      count: user.wishlist.length,
      data: user.wishlist,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const addToWishlist = async (req, res) => {
  try {
    const product = await Product.findById(req.params.productId);

    if (!product) {
      return res.status(404).json({
        success: false,
        message: "Product not found",
      });
    }

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const alreadyExists = user.wishlist.some(
      (id) => id.toString() === product._id.toString()
    );

    if (alreadyExists) {
      return res.status(400).json({
        success: false,
        message: "Product already in wishlist",
      });
    }

    user.wishlist.push(product._id);

    await user.save();

    res.status(200).json({
      success: true,
      message: "Added to wishlist",
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const removeFromWishlist = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.wishlist = user.wishlist.filter(
      (id) => id.toString() !== req.params.productId
    );

    await user.save();

    res.status(200).json({
      success: true,
      message: "Removed from wishlist",
      wishlistCount: user.wishlist.length,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};
/* ===========================
   Vendor Management
=========================== */

const getVendors = async (req, res) => {
  try {
    const vendors = await User.find(
      { role: "vendor" },
      "-password"
    ).sort({
      vendorStatus: 1,
      createdAt: -1,
    });

    res.status(200).json({
      success: true,
      count: vendors.length,
      data: vendors,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const approveVendor = async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "vendor",
    }).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.vendorStatus === "Approved") {
      return res.status(400).json({
        success: false,
        message: "Vendor is already approved",
      });
    }

    vendor.vendorStatus = "Approved";

    await vendor.save();

    await logActivity(
      req.user,
      "Vendor Approved",
      `${vendor.name} was approved`
    );

    res.status(200).json({
      success: true,
      message: "Vendor approved successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const rejectVendor = async (req, res) => {
  try {
    const vendor = await User.findOne({
      _id: req.params.id,
      role: "vendor",
    }).select("-password");

    if (!vendor) {
      return res.status(404).json({
        success: false,
        message: "Vendor not found",
      });
    }

    if (vendor.vendorStatus === "Rejected") {
      return res.status(400).json({
        success: false,
        message: "Vendor is already rejected",
      });
    }

    vendor.vendorStatus = "Rejected";

    await vendor.save();

    await logActivity(
      req.user,
      "Vendor Rejected",
      `${vendor.name} was rejected`
    );

    res.status(200).json({
      success: true,
      message: "Vendor rejected successfully",
      data: vendor,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const updateProfile = async (req, res) => {
  try {
    const { name, phone } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    user.name = name || user.name;
    user.phone = phone || user.phone;

    if (req.file) {
      user.profileImage = `/uploads/${req.file.filename}`;
    }

    await user.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        profileImage: user.profileImage,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const isMatch = await user.matchPassword(currentPassword);

    if (!isMatch) {
      return res.status(400).json({
        success: false,
        message: "Current password is incorrect",
      });
    }

    user.password = newPassword;

    await user.save();

    res.status(200).json({
      success: true,
      message: "Password changed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getVendors = async (req, res) => {
  try {
    const vendors = await User.find(
      {
        role: "vendor",
      },
      "name email shopName"
    ).sort({
      shopName: 1,
    });

    res.status(200).json({
      success: true,
      data: vendors,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

module.exports = {
  getUsers,
  getUser,
  updateUserRole,
  deleteUser,

  getWishlist,
  addToWishlist,
  removeFromWishlist,

  getVendors,
  approveVendor,
  rejectVendor,

  getProfile,
  updateProfile,
  changePassword,
};