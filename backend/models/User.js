const mongoose = require("mongoose");
const validator = require("validator");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, "Invalid email"],
    },

    password: {
      type: String,
      required: true,
      minlength: 6,
    },

    role: {
      type: String,
      enum: ["admin", "vendor", "customer"],
      default: "customer",
    },

    phone: {
      type: String,
      default: "",
    },

    profileImage: {
      type: String,
      default: "",
    },

    isActive: {
      type: Boolean,
      default: true,
    },

    vendorStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },

    shopName: {
      type: String,
      default: "",
    },

    shopLogo: {
      type: String,
      default: "",
    },

    shopBanner: {
      type: String,
      default: "",
    },

    shopEmail: {
      type: String,
      default: "",
    },

    shopPhone: {
      type: String,
      default: "",
    },

    shopDescription: {
      type: String,
      default: "",
    },

    shopAddress: {
      type: String,
      default: "",
    },

    gstNumber: {
      type: String,
      default: "",
    },

    shopRating: {
      type: Number,
      default: 0,
    },

    totalReviews: {
      type: Number,
      default: 0,
    },

    addresses: [
      {
        fullName: {
          type: String,
          default: "",
        },
        phone: {
          type: String,
          default: "",
        },
        address: {
          type: String,
          default: "",
        },
        city: {
          type: String,
          default: "",
        },
        state: {
          type: String,
          default: "",
        },
        pincode: {
          type: String,
          default: "",
        },
        country: {
          type: String,
          default: "India",
        },
      },
    ],

    wishlist: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
    ],
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("User", userSchema);