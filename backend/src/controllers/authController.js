const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../config/db");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const result = await db.query(
      "INSERT INTO users (name, email, password_hash, role_id) VALUES ($1, $2, $3, 2) RETURNING id, name, email, role_id",
      [name, email, passwordHash],
    );

    const token = jwt.sign(
      { id: result.rows[0].id, role_id: result.rows[0].role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.status(201).json({ user: result.rows[0], token });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = result.rows[0];
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
      },
      token,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { register, login };
