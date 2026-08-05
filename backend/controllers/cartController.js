const Cart = require("../models/Cart");
const Product = require("../models/Product");

const addToCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const productExists = await Product.findById(product);

    if (!productExists) {
      return res.status(404).json({
        success: false,
        message: "Product not found"
      });
    }

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      cart = await Cart.create({
        user: req.user._id,
        items: [
          {
            product,
            quantity: quantity || 1
          }
        ]
      });
    } else {
      const existingItem = cart.items.find(item =>
        item.product.equals(product)
      );

      if (existingItem) {
        existingItem.quantity += quantity || 1;
      } else {
        cart.items.push({
          product,
          quantity: quantity || 1
        });
      }

      await cart.save();
    }

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product added to cart",
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const getCart = async (req, res) => {
  try {
    const cart = await Cart.findOne({
      user: req.user._id
    }).populate("items.product");

    res.status(200).json({
      success: true,
      data: cart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const updateCart = async (req, res) => {
  try {
    const { product, quantity } = req.body;

    const cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      return res.status(404).json({
        success: false,
        message: "Cart not found"
      });
    }

    const item = cart.items.find(item => item.product.equals(product));

    if (!item) {
      return res.status(404).json({
        success: false,
        message: "Product not found in cart"
      });
    }

    if (quantity <= 0) {
      cart.items = cart.items.filter(
        item => !item.product.equals(product)
      );
    } else {
      item.quantity = quantity;
    }

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Cart updated successfully",
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

const removeFromCart = async (req, res) => {
  try {

    await cart.save();

    const updatedCart = await Cart.findById(cart._id).populate("items.product");

    res.status(200).json({
      success: true,
      message: "Product removed from cart",
      data: updatedCart
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

module.exports = {
  addToCart,
  getCart,
  updateCart,
  removeFromCart
};