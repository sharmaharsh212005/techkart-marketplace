const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema(
  {
    product: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Product",
      required: true,
    },

    customer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    vendor: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    question: {
      type: String,
      required: true,
      trim: true,
      maxlength: 500,
    },

  answer: {

    text: {
      type: String,
      default: "",
      trim: true,
    },

    answeredBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },

    answeredRole: {
      type: String,
      enum: ["vendor", "admin"],
      default: "vendor",
    },

    answeredAt: Date,

  },

    status: {
      type: String,
      enum: ["Pending", "Answered"],
      default: "Pending",
    },

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model("Question", questionSchema);