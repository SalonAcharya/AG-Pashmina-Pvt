const express = require("express");
const router = express.Router();
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const extraController = require("../controllers/extraController");
const uploadRoutes = require("./upload");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Google OAuth routes
router.get(
  "/auth/google",
  passport.authenticate("google", { scope: ["profile", "email"] }),
);

router.get(
  "/auth/google/callback",
  passport.authenticate("google", {
    failureRedirect: `${process.env.FRONTEND_URL || "http://localhost:5173"}/login?error=google_failed`,
    session: false,
  }),
  (req, res) => {
    const user = req.user;
    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    const userEncoded = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      }),
    );
    const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
    res.redirect(
      `${frontendUrl}/auth/callback?token=${token}&user=${userEncoded}`,
    );
  },
);

// Public Product/Category Routes
router.get("/products", productController.getProducts);
router.get("/products/:id", productController.getProductById);
router.get("/categories", productController.getCategories);

// Upload Routes
router.use("/upload", uploadRoutes);

// Protected Order Routes (Customer & Admin)
router.post("/orders", verifyToken, orderController.createOrder);
router.get("/orders", verifyToken, orderController.getOrders);

router.get("/blog", extraController.getBlogPosts);
router.post("/blog", verifyToken, isAdmin, extraController.createBlogPost);
router.put("/blog/:id", verifyToken, isAdmin, extraController.updateBlogPost);
router.delete(
  "/blog/:id",
  verifyToken,
  isAdmin,
  extraController.deleteBlogPost,
);

// Settings Routes
router.get("/settings", extraController.getSettings);
router.post("/settings", verifyToken, isAdmin, extraController.updateSettings);

// Contact Routes
router.post("/contact", extraController.createContactMessage);
router.get(
  "/contact-messages",
  verifyToken,
  isAdmin,
  extraController.getContactMessages,
);
router.delete(
  "/contact-messages/:id",
  verifyToken,
  isAdmin,
  extraController.deleteContactMessage,
);

// Admin Only Routes
router.post(
  "/categories",
  verifyToken,
  isAdmin,
  productController.createCategory,
);
router.put(
  "/categories/:id",
  verifyToken,
  isAdmin,
  productController.updateCategory,
);
router.delete(
  "/categories/:id",
  verifyToken,
  isAdmin,
  productController.deleteCategory,
);

router.post("/products", verifyToken, isAdmin, productController.createProduct);
router.delete(
  "/products/:id",
  verifyToken,
  isAdmin,
  productController.deleteProduct,
);
router.put(
  "/products/:id",
  verifyToken,
  isAdmin,
  productController.updateProduct,
);
router.patch(
  "/orders/:id/status",
  verifyToken,
  isAdmin,
  orderController.updateOrderStatus,
);
router.delete("/orders/:id", verifyToken, isAdmin, orderController.deleteOrder);

module.exports = router;
