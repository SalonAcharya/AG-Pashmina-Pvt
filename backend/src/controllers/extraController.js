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
  const {
    title,
    slug,
    content,
    excerpt,
    featured_image,
    origin,
    fiber,
    warmth,
  } = req.body;
  const author_id = req.user.id;
  try {
    const result = await db.query(
      "INSERT INTO blog_posts (title, slug, content, excerpt, featured_image, author_id, origin, fiber, warmth, is_published) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, TRUE) RETURNING *",
      [
        title,
        slug,
        content,
        excerpt,
        featured_image,
        author_id,
        origin,
        fiber,
        warmth,
      ],
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateBlogPost = async (req, res) => {
  const { id } = req.params;
  const {
    title,
    slug,
    content,
    excerpt,
    featured_image,
    origin,
    fiber,
    warmth,
  } = req.body;
  try {
    const result = await db.query(
      "UPDATE blog_posts SET title=$1, slug=$2, content=$3, excerpt=$4, featured_image=$5, origin=$6, fiber=$7, warmth=$8 WHERE id=$9 RETURNING *",
      [
        title,
        slug,
        content,
        excerpt,
        featured_image,
        origin,
        fiber,
        warmth,
        id,
      ],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const deleteBlogPost = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM blog_posts WHERE id=$1", [id]);
    res.json({ message: "Post deleted" });
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

const deleteContactMessage = async (req, res) => {
  const { id } = req.params;
  try {
    await db.query("DELETE FROM contact_messages WHERE id=$1", [id]);
    res.json({ message: "Message deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  getBlogPosts,
  createBlogPost,
  updateBlogPost,
  deleteBlogPost,
  createContactMessage,
  getContactMessages,
  deleteContactMessage,
};
