import express from "express";
import { auth } from "../middleware/auth.js";
import { adminOnly } from "../middleware/admin.js";

const router = express.Router();

router.get("/products", auth, adminOnly, (req, res) => {
  res.json({ message: "Welcome Admin, products loaded." });
});

router.post("/add-product", auth, adminOnly, (req, res) => {
  res.json({ message: "Product added successfully." });
});

export default router;
