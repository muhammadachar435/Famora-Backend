import mongoose from "mongoose";

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  products: [
    {
      productId: String,
      name: String,
      price: Number,
      quantity: Number,
    },
  ],
  totalAmount: Number,
  status: { type: String, default: "Pending" },
  createdAt: { type: Date, default: Date.now },
});

export default mongoose.model("Order", orderSchema);
