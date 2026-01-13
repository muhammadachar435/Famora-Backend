import express from "express";
import mongoose from "mongoose";
import cors from "cors";
import dotenv from "dotenv";
import routes from "./routes/routes.js";
import authRoutes from "./routes/auth.js";
import adminRoutes from "./routes/adminRoutes.js";
import session from "express-session";
import cookieParser from "cookie-parser";
import cartRoutes from "./routes/cartRoutes.js";
import orderRoutes from "./routes/orderroutes.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(
  cors({
    origin: "http://localhost:3000",
    credentials: true,
  })
);

app.use(cookieParser());
app.use("/admin", adminRoutes);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve uploads folder
app.use("/uploads", express.static("uploads"));

// Session
app.use(
  session({
    secret: process.env.JWT_SECRET,
    resave: false,
    saveUninitialized: true,
  })
);

// Auth Routes
app.use("/api/auth", authRoutes);

// Main routes
app.use("/", routes);

// Cart Routes
app.use("/api/cart", cartRoutes);

// Order Products
app.use("/api/orders", orderRoutes);

// MongoDB
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    console.log("Connected to MongoDB");
    app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
  })
  .catch((err) => console.error(err));
