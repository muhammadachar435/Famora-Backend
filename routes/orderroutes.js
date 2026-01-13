import express from "express";
import Order from "../Model/Order.js";
import { auth } from "../middleware/auth.js";

const router = express.Router();

// CREATE ORDER
router.post("/create", auth, async (req, res) => {
  try {
    const { products, totalAmount } = req.body;

    const order = new Order({
      user: req.user.id,
      products,
      totalAmount,
      status: "Pending",
    });

    await order.save();
    res.json({ msg: "Order placed successfully", order });
  } catch (err) {
    res.status(500).json({ msg: err.message });
  }
});

export default router;
