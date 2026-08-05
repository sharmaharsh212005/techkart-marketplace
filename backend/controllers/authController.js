const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      password,
      phone,
      role,
      shopName,
      shopLogo,
      shopDescription,
      shopAddress,
      gstNumber
    } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({
        success: false,
        message: "All required fields must be provided"
      });
    }

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: "Email already registered"
      });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const isVendor = role === "vendor";

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      phone,
      role: isVendor ? "vendor" : "customer",
      vendorStatus: isVendor ? "Pending" : "Approved",
      shopName: isVendor ? shopName : "",
      shopLogo: isVendor ? shopLogo : "",
      shopDescription: isVendor ? shopDescription : "",
      shopAddress: isVendor ? shopAddress : "",
      gstNumber: isVendor ? gstNumber : ""
    });

    res.status(201).json({
      success: true,
      message: isVendor
        ? "Vendor registration submitted. Waiting for admin approval."
        : "User registered successfully",
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        vendorStatus: user.vendorStatus
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (!user.isActive) {
      return res.status(403).json({
        success: false,
        message: "Your account has been disabled"
      });
    }

    const isMatch = await bcrypt.compare(
      password,
      user.password
    );

    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    if (user.role === "vendor") {
      if (user.vendorStatus === "Pending") {
        return res.status(403).json({
          success: false,
          message: "Your vendor account is awaiting admin approval."
        });
      }

      if (user.vendorStatus === "Rejected") {
        return res.status(403).json({
          success: false,
          message:
            "Your vendor account has been rejected. Please contact the administrator."
        });
      }
    }

    const token = jwt.sign(
      {
        id: user._id,
        role: user.role
      },
      process.env.JWT_SECRET,
      {
        expiresIn: "7d"
      }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      token,
      data: {
        id: user._id,
        name: user.name,
        email: user.email,
        phone: user.phone,
        role: user.role,
        vendorStatus: user.vendorStatus,
        shopName: user.shopName
      }
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getProfile = async (req, res) => {
  res.status(200).json({
    success: true,
    data: req.user
  });
};

module.exports = {
  registerUser,
  loginUser,
  getProfile
};