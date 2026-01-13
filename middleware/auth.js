import jwt from "jsonwebtoken";
import User from "../Model/User.js"; // make sure path is correct

// auth Component
export const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token; // or from header: req.headers.authorization?.split(" ")[1]
    if (!token) return res.status(401).json({ msg: "Not logged in" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch user from DB to get _id
    const user = await User.findById(decoded.id);
    if (!user) return res.status(401).json({ msg: "User not found" });

    req.user = user; // now req.user._id exists
    next();
  } catch (err) {
    console.log(err);
    res.status(401).json({ msg: "Invalid token" });
  }
};
