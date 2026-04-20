const db = require("../config/db");
const wsService = require("../config/ws");

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

// Settings Controllers
const getSettings = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM settings");
    const settingsObj = {};
    result.rows.forEach((row) => {
      settingsObj[row.key] = row.value;
    });
    res.json(settingsObj);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateSettings = async (req, res) => {
  try {
    for (const [key, value] of Object.entries(req.body)) {
      await db.query(
        `
        INSERT INTO settings (key, value) 
        VALUES ($1, $2) 
        ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value
      `,
        [key, value],
      );
    }
    res.json({ message: "Settings updated successfully" });
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
    const saved = result.rows[0];

    // Broadcast real-time notification to admin
    wsService.broadcast({
      type: "new_message",
      messageId: saved.id,
      name: saved.name,
      subject: saved.subject || "(no subject)",
      timestamp: new Date().toISOString(),
    });

    res.status(201).json(saved);
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

const markMessagesAsRead = async (req, res) => {
  try {
    await db.query(
      "UPDATE contact_messages SET is_read = TRUE WHERE is_read = FALSE",
    );
    res.json({ message: "All messages marked as read" });
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
  markMessagesAsRead,
  getSettings,
  updateSettings,
};
