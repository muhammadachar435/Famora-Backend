// routes/auth.js
import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { auth } from "../middleware/auth.js";
import User from "../Model/User.js";

dotenv.config();

const router = express.Router();

// Admin Permission
router.get("/me", auth, async (req, res) => {
  const user = await User.findById(req.user.id).select("-password");
  res.json({ user });
});

// REGISTER - Only User
router.post("/register", async (req, res) => {
  try {
    const { name, email, phone, password } = req.body;

    if (!name || !email || !phone || !password)
      return res.status(400).json({ message: "All fields are required." });

    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists." });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = new User({ name, email, phone, password: hashedPassword, role: "user" });
    await user.save();

    res.status(201).json({ message: "User registered successfully." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) return res.status(400).json({ message: "All fields are required." });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials." });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials." });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: "1d",
    });

    // 🔒 STORE JWT IN HTTPONLY COOKIE
    res
      .cookie("token", token, {
        httpOnly: true,
        secure: false, // true when using HTTPS
        sameSite: "strict",
        maxAge: 24 * 60 * 60 * 1000,
      })
      .json({
        message: "Login successful",
        user: { name: user.name, email: user.email, role: user.role },
      });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// routes/auth.js
router.post("/logout", (req, res) => {
  res.clearCookie("token"); // clear HttpOnly JWT cookie
  res.json({ message: "Logged out successfully" });
});

export default router;
