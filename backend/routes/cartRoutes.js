const express = require("express");
const {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, getCart);
router.post("/", protect, addToCart);
router.put("/", protect, updateCart);
router.delete("/:productId", protect, removeFromCart);

module.exports = router;