const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const productController = require("../controllers/productController");
const orderController = require("../controllers/orderController");
const extraController = require("../controllers/extraController");
const uploadRoutes = require("./upload");
const { verifyToken, isAdmin } = require("../middleware/auth");

// Auth Routes
router.post("/auth/register", authController.register);
router.post("/auth/login", authController.login);

// Public Product/Category Routes
router.get("/products", productController.getProducts);
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
