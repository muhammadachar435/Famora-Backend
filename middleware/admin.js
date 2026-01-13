// middleware/admin.js
export const adminOnly = (req, res, next) => {
  // req.user comes from your auth middleware (after login)
  if (!req.user || req.user.role !== "admin") {
    return res.status(403).json({ message: "Access denied" });
  }
  next();
};
