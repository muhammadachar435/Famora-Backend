import mongoose from "mongoose"; // mongoose

// Image Limit
function imageLimit(val) {
  return val.length === 3;
}

// ProductSchema
const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  discountPrice: { type: Number },
  tags: {
    type: String,
    enum: ["best-seller", "flash-sale", "new-arrival"],
    default: [],
  },

  inStock: {
    type: Boolean,
    default: true,
  },

  flashSaleStart: { type: Date }, // when the flash sale starts
  flashDurationMinutes: { type: Number, default: 120 }, // how long the sale lasts (optional)

  images: {
    type: [String],
    validate: [imageLimit, "Exactly 3 images required"],
  },
  category: {
    type: String,
    required: true,
    enum: ["men", "women", "kids", "accessories"],
  },
  offerImage: {
    type: String,
  },
  rating: {
    type: Number,
    default: 0, // Default rating if not provided
    min: 0,
    max: 5, // Assuming rating out of 5
  },
  sizes: [
    {
      type: String,
      enum: ["XS", "S", "M", "L", "XL", "XXL"], // admin can only select these
    },
  ],
  colors: [
    {
      type: String,
      enum: ["Red", "Blue", "Black", "White", "Green", "Yellow"], // fixed color options
    },
  ],
  specifications: {
    material: {
      type: String,
      enum: ["Cotton", "Polyester", "Wool", "Silk"], // selectable materials
    },
    fit: {
      type: String,
      enum: ["Regular", "Slim", "Loose"], // selectable fits
    },
    care: {
      type: String,
      enum: ["Machine Wash", "Hand Wash", "Dry Clean"], // selectable care options
    },
  },

  reviews: [
    {
      user: { type: String, required: true },
      rating: { type: Number, required: true, min: 1, max: 5 },
      comment: String,
    },
  ],
  createdAt: { type: Date, default: Date.now },
});

const Product = mongoose.model("Products", productSchema);

export default Product;
