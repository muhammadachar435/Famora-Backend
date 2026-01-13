/* eslint-disable no-undef */
import express from "express";
import multer from "multer";
import Product from "../Model/Product.js";
import subscribeRoute from "./subscribeRoutes.js";

const router = express.Router();

router.use("/subscribe", subscribeRoute);

// ================= MULTER =================
const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, "uploads/"),
  filename: (req, file, cb) => cb(null, Date.now() + "-" + file.originalname),
});
const upload = multer({ storage });

// ================= CREATE =================
router.post("/products", upload.array("images", 3), async (req, res) => {
  try {
    const {
      name,
      description,
      price,
      discountPrice,
      inStock,
      category,
      tags,
      offerImage,
      rating,
      sizes,
      colors,
      flashSaleStart,
      flashDurationMinutes,
      specifications,
      reviews,
    } = req.body;

    if (!req.files || req.files.length !== 3)
      return res.status(400).json({ msg: "Exactly 3 images required" });

    const images = req.files.map((f) => f.filename);

    const product = new Product({
      name,
      description,
      price: Number(price),
      discountPrice: Number(discountPrice),
      inStock: inStock === "true",
      images,
      category,
      tags,
      offerImage,
      rating: Number(rating) || 0,
      sizes: sizes ? JSON.parse(sizes) : [],
      colors: colors ? JSON.parse(colors) : [],
      flashSaleStart: flashSaleStart ? new Date(flashSaleStart) : null,
      flashDurationMinutes: flashDurationMinutes ? Number(flashDurationMinutes) : 120,
      specifications: specifications ? JSON.parse(specifications) : {},
      reviews: reviews ? JSON.parse(reviews) : [],
    });

    await product.save();
    res.status(201).json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= READ ALL =================
router.get("/products", async (req, res) => {
  try {
    res.json(await Product.find().sort({ createdAt: -1 }));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ================= READ SINGLE =================
router.get("/products/:id", async (req, res) => {
  try {
    res.json(await Product.findById(req.params.id));
  } catch (err) {
    res.status(404).json({ message: "Product not found" });
  }
});

// ================= UPDATE =================
router.put("/products/:id", upload.array("images", 3), async (req, res) => {
  try {
    const existingProduct = await Product.findById(req.params.id);
    if (!existingProduct) return res.status(404).json({ msg: "Product not found" });

    const {
      name,
      description,
      price,
      discountPrice,
      inStock,
      category,
      tags,
      offerImage,
      rating,
      sizes,
      colors,
      specifications,
      flashSaleStart,
      flashDurationMinutes,
    } = req.body;

    // Parse JSON fields
    const parsedSizes = sizes ? JSON.parse(sizes) : existingProduct.sizes;
    const parsedColors = colors ? JSON.parse(colors) : existingProduct.colors;
    const parsedSpecifications = specifications
      ? JSON.parse(specifications)
      : existingProduct.specifications;

    // FIXED: Handle images properly - keep existing if no new images uploaded
    let images = existingProduct.images;
    if (req.files && req.files.length > 0) {
      // If new images uploaded, use them
      images = req.files.map((f) => f.filename);

      // REMOVED the validation for exactly 3 images during update
      // Users can upload 1, 2, or 3 new images
      // If they upload less than 3, we use existing images for the rest
      // But actually, in your case, you're replacing all images
    }
    // If no new images uploaded, keep existing images

    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      {
        name,
        description,
        price: Number(price),
        discountPrice: Number(discountPrice),
        inStock: inStock === "true",
        category,
        tags,
        offerImage,
        rating: Number(rating) || 0,
        sizes: parsedSizes,
        colors: parsedColors,
        specifications: parsedSpecifications,
        images, // Use the images array (either new or existing)
        flashSaleStart: flashSaleStart ? new Date(flashSaleStart) : existingProduct.flashSaleStart,
        flashDurationMinutes: flashDurationMinutes
          ? Number(flashDurationMinutes)
          : existingProduct.flashDurationMinutes,
      },
      { new: true }
    );

    res.json(updated);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

// ================= DELETE =================
router.delete("/products/:id", async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product Deleted Successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

export default router;
