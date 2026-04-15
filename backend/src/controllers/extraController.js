const db = require("../config/db");

// Blog Controllers
const getBlogPosts = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM blog_posts WHERE is_published = TRUE ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const createBlogPost = async (req, res) => {
  const { title, slug, content, excerpt, featured_image } = req.body;
  const author_id = req.user.id;
  try {
    const result = await db.query(
      "INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author_id) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *",
      [title, slug, content, excerpt, featured_image, author_id],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Contact Controllers
const createContactMessage = async (req, res) => {
  const { name, email, subject, message } = req.body;
  try {
    const result = await db.query(
      "INSERT INTO contact_messages (name, email, subject, message) VALUES ($1, $2, $3, $4) RETURNING *",
      [name, email, subject, message],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getContactMessages = async (req, res) => {
  try {
    const result = await db.query(
      "SELECT * FROM contact_messages ORDER BY created_at DESC",
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBlogPosts,
  createBlogPost,
  createContactMessage,
  getContactMessages,
};
