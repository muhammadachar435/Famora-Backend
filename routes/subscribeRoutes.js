/* eslint-disable no-undef */
import express from "express";
import Subscriber from "../Model/SubscriberModel.js";
import nodemailer from "nodemailer";

// Create router
const router = express.Router();

router.post("/", async (req, res) => {
  const { emailSubscribe } = req.body;

  if (!emailSubscribe) return res.status(400).json({ error: "Email required" });

  // Check if email already saved
  const exists = await Subscriber.findOne({ emailSubscribe });
  if (exists) return res.status(409).json({ error: "Already subscribed" });

  // Save in MongoDB
  await Subscriber.create({ emailSubscribe });

  // Send email
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: { user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASS },
  });

  await transporter.sendMail({
    to: emailSubscribe,
    subject: "Welcome to Famora Shopping Onine",
    html: "<h2>Thanks for subscribing 🎉</h2>",
  });

  res.json({ message: "Subscribed Successfully" });
});

export default router;
