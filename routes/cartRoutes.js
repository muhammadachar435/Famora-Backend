import express from "express";
import Cart from "../Model/Cart.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// Add product to cart
router.post("/add", auth, async (req, res) => {
  try {
    const { productId, quantity } = req.body;

    let cart = await Cart.findOne({ user: req.user._id });

    if (!cart) {
      // Create new cart if not exists
      cart = new Cart({
        user: req.user._id,
        products: [{ product: productId, quantity }],
      });
    } else {
      // Check if product already exists
      const existingProduct = cart.products.find((p) => p.product.toString() === productId);

      if (existingProduct) {
        existingProduct.quantity += quantity;
      } else {
        cart.products.push({ product: productId, quantity });
      }
    }

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get user's cart
router.get("/", auth, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate("products.product");
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Remove product from cart
router.post("/remove", auth, async (req, res) => {
  try {
    const { productId } = req.body;
    const cart = await Cart.findOne({ user: req.user._id });
    if (!cart) return res.status(404).json({ msg: "Cart not found" });

    cart.products = cart.products.filter((p) => p.product.toString() !== productId);

    await cart.save();
    res.status(200).json(cart);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
