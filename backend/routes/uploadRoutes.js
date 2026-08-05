const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

router.post(
  "/",
  protect,
  authorize("admin", "vendor"),
  upload.single("image"),
  (req, res) => {
    res.status(200).json({
      success: true,
      message: "Image uploaded successfully",
      image: `/uploads/${req.file.filename}`
    });
  }
);

module.exports = router;