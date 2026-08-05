const mongoose = require("mongoose");

const homepageSectionSchema = new mongoose.Schema(
  {
    sectionType: {
      type: String,
      required: true,
      unique: true,
      enum: [
        "hero",
        "featuredCategories",
        "featuredProducts",
        "offers",
        "testimonials",
        "faq",
        "newsletter",
        "footer",
      ],
    },

    title: String,

    subtitle: String,

    content: mongoose.Schema.Types.Mixed,

    isActive: {
      type: Boolean,
      default: true,
    },
  },
  {
    timestamps: true,
  }
);

module.exports = mongoose.model(
  "HomepageSection",
  homepageSectionSchema
);