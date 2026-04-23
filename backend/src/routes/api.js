const express = require("express");
const router = express.Router();
const db = require("../config/db");
const passport = require("../config/passport");
const jwt = require("jsonwebtoken");
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const extraController = require("../controllers/extraController");
const uploadRoutes = require("./upload");
const { verifyToken, isAdmin } = require("../middleware/auth");
const rateLimit = require("express-rate-limit");

// Create limiters
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 requests
  message: {
    message:
      "Too many attempts from this IP, please try again after 15 minutes",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

const contactLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3, // 3 messages
  message: {
    message: "Too many messages sent. Please wait an hour before sending more.",
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Auth Routes
router.post("/auth/register", authLimiter, authController.register);
router.post("/auth/login", authLimiter, authController.login);
router.post("/auth/verify", authController.verifyEmail);
router.post(
  "/auth/resend-verification",
  authLimiter,
  authController.resendVerification,
);
router.post(
  "/auth/forgot-password",
  authLimiter,
  authController.forgotPassword,
);
router.post("/auth/reset-password", authLimiter, authController.resetPassword);
router.post(
  "/auth/change-password",
  verifyToken,
  authController.changePassword,
);

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
  async (req, res) => {
    const user = req.user;
    if (!user) {
      // This happens if authentication fails but passport doesn't redirect automatically
      const failureMsg = req.authInfo?.message || "google_failed";
      const frontendUrl = process.env.FRONTEND_URL || "http://localhost:5173";
      return res.redirect(
        `${frontendUrl}/login?error=${encodeURIComponent(failureMsg)}`,
      );
    }

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );

    // We check if password_hash is null to determine if it's a social-only account
    // For this, we need to ensure passport returned the whole user object or just query it here
    const hasPassword = user.password_hash ? true : false;

    const orderCountRes = await db.query(
      "SELECT COUNT(*) FROM orders WHERE user_id = $1",
      [user.id],
    );
    const orderCount = parseInt(orderCountRes.rows[0].count);

    const userEncoded = encodeURIComponent(
      JSON.stringify({
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        hasPassword: hasPassword,
        order_count: orderCount,
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
router.post("/contact", contactLimiter, extraController.createContactMessage);
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

router.patch(
  "/contact-messages/read-all",
  verifyToken,
  isAdmin,
  extraController.markMessagesAsRead,
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

module.exports = router;
