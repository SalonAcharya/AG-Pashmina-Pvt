const db = require("../config/db");

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
  const { name, description, slug } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO categories (name, description, slug) VALUES ($1, $2, $3) RETURNING *",
      [name, description, slug],
    );
    res.status(201).json(result.rows[0]);
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
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createProduct = async (req, res) => {
  const {
    name,
    description,
    price,
    category_id,
    images,
    sizes,
    colors,
    stock_quantity,
  } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO products (name, description, price, category_id, images, sizes, colors, stock_quantity) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *",
      [
        name,
        description,
        price,
        category_id,
        images,
        sizes,
        colors,
        stock_quantity,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateProduct = async (req, res) => {
  const { id } = req.params;
  const {
    name,
    description,
    price,
    category_id,
    images,
    sizes,
    colors,
    stock_quantity,
    is_active,
  } = req.body;
  try {
    const result = await db.query(
      "UPDATE products SET name=$1, description=$2, price=$3, category_id=$4, images=$5, sizes=$6, colors=$7, stock_quantity=$8, is_active=$9 WHERE id=$10 RETURNING *",
      [
        name,
        description,
        price,
        category_id,
        images,
        sizes,
        colors,
        stock_quantity,
        is_active,
        id,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getCategories,
  createCategory,
  getProducts,
  createProduct,
  updateProduct,
};
