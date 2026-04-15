const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const extraController = require("../controllers/extraController");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Public Product/Category Routes
router.get("/products", productController.getProducts);
router.get("/categories", productController.getCategories);

// Protected Order Routes (Customer & Admin)
router.post("/orders", verifyToken, orderController.createOrder);
router.get("/orders", verifyToken, orderController.getOrders);

// Blog Routes
router.get("/blog", extraController.getBlogPosts);
router.post("/blog", verifyToken, isAdmin, extraController.createBlogPost);

// Contact Routes
router.post("/contact", extraController.createContactMessage);
router.get(
  "/contact-messages",
  verifyToken,
  isAdmin,
  extraController.getContactMessages,
);

// Admin Only Routes
router.post(
  "/categories",
  verifyToken,
  isAdmin,
  productController.createCategory,
);
router.post("/products", verifyToken, isAdmin, productController.createProduct);
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
