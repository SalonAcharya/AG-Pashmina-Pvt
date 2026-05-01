const db = require("../config/db");

const parsePgArray = (val) => {
  if (!val) return [];
  if (Array.isArray(val)) return val;
  if (typeof val === "string" && val.startsWith("{") && val.endsWith("}")) {
    return val
      .slice(1, -1)
      .split(",")
      .map((item) => item.trim().replace(/^"(.*)"$/, "$1"));
  }
  return [val];
};

const formatProduct = (p) => {
  if (!p) return p;
  return {
    ...p,
    images: parsePgArray(p.images),
    sizes: parsePgArray(p.sizes),
    colors: parsePgArray(p.colors),
  };
};

// Category Controllers
const getCategories = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM categories");
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createCategory = async (req, res) => {
  const { name, description, slug, image } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO categories (name, description, slug, image) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, description, slug, image],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateCategory = async (req, res) => {
  const { id } = req.params;
  const { name, description, slug, image } = req.body;
  try {
    const result = await db.query(
      "UPDATE categories SET name=$1, description=$2, slug=$3, image=$4 WHERE id=$5 RETURNING *",
      [name, description, slug, image, id],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Category not found" });
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteCategory = async (req, res) => {
  const { id } = req.params;
  try {
    // Check if category has products
    const productCheck = await db.query(
      "SELECT id FROM products WHERE category_id = $1 LIMIT 1",
      [id],
    );
    if (productCheck.rows.length > 0) {
      return res.status(400).json({
        message:
          "Cannot delete category: It contains products. Please move or delete the products first.",
      });
    }

    const result = await db.query("DELETE FROM categories WHERE id=$1", [id]);
    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Category not found" });
    }
    res.json({ message: "Category deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Product Controllers
const getProducts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id",
    );
    res.json(result.rows.map(formatProduct));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    slug,
    description,
    base_price,
    discount_type,
    discount_value,
    sale_price,
    category_id,
    images,
    sizes,
    colors,
    weight,
    stock_quantity,
    low_stock_threshold,
  } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, slug, description, base_price, discount_type, discount_value, sale_price, category_id, images, sizes, colors, weight, stock_quantity, low_stock_threshold) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14) RETURNING *",
      [
        name,
        slug,
        description,
        base_price,
        discount_type,
        discount_value,
        sale_price,
        category_id,
        images,
        sizes,
        colors,
        weight,
        stock_quantity,
        low_stock_threshold,
      ],
    );
    res.status(201).json(formatProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    slug,
    description,
    base_price,
    discount_type,
    discount_value,
    sale_price,
    category_id,
    images,
    sizes,
    colors,
    weight,
    stock_quantity,
    low_stock_threshold,
    is_active,
  } = req.body;
  try {
    const result = await db.query(
      "UPDATE products SET name=$1, slug=$2, description=$3, base_price=$4, discount_type=$5, discount_value=$6, sale_price=$7, category_id=$8, images=$9, sizes=$10, colors=$11, weight=$12, stock_quantity=$13, low_stock_threshold=$14, is_active=$15 WHERE id=$16 RETURNING *",
      [
        name,
        slug,
        description,
        base_price,
        discount_type,
        discount_value,
        sale_price,
        category_id,
        images,
        sizes,
        colors,
        weight,
        stock_quantity,
        low_stock_threshold,
        is_active,
        id,
      ],
    );
    if (result.rows.length === 0)
      return res.status(404).json({ message: "Product not found" });
    res.json(formatProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteProduct = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM products WHERE id=$1", [id]);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getProductById = async (req, res) => {
  const { id } = req.params;
  try {
    const result = await db.query(
      "SELECT p.*, c.name as category_name FROM products p LEFT JOIN categories c ON p.category_id = c.id WHERE p.id = $1",
      [id],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Product not found" });
    }
    res.json(formatProduct(result.rows[0]));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
};
