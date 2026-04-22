const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const db = require("../config/db");
const emailService = require("../services/emailService");

const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    const result = await db.query(
      "INSERT INTO users (name, email, password_hash, role_id, verification_code, verification_expires_at) VALUES ($1, $2, $3, 2, $4, $5) RETURNING id, name, email, role_id",
      [name, email, passwordHash, verificationCode, expiresAt],
    );

    // Send verification email asynchronously
    emailService.sendVerificationEmail(email, name, verificationCode);

    res.status(201).json({
      email,
      message:
        "Registration successful. Please enter the 6-digit code sent to your email to verify your account.",
    });
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

    if (!user.is_verified) {
      return res.status(403).json({
        message:
          "Email not verified. Please check your inbox for the verification link.",
        unverified: true,
      });
    }

    const orderCountRes = await db.query(
      "SELECT COUNT(*) FROM orders WHERE user_id = $1",
      [user.id],
    );
    const orderCount = parseInt(orderCountRes.rows[0].count);

    const token = jwt.sign(
      { id: user.id, role_id: user.role_id },
      process.env.JWT_SECRET,
      { expiresIn: "24h" },
    );
    res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role_id: user.role_id,
        hasPassword: true,
        order_count: orderCount,
      },
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const verifyEmail = async (req, res) => {
  const { email, code } = req.body;

  if (!email || !code)
    return res.status(400).json({ message: "Email and code are required" });

  try {
    const userRes = await db.query(
      "SELECT id, verification_code, verification_expires_at FROM users WHERE email = $1",
      [email],
    );

    if (userRes.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = userRes.rows[0];

    if (!user.verification_code || user.verification_code !== code) {
      return res.status(400).json({ message: "Invalid verification code" });
    }

    if (new Date() > new Date(user.verification_expires_at)) {
      return res.status(400).json({
        message: "Verification code has expired. Please request a new one.",
      });
    }

    await db.query(
      "UPDATE users SET is_verified = TRUE, verification_code = NULL, verification_expires_at = NULL WHERE id = $1",
      [user.id],
    );

    res.json({ message: "Email verified successfully! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resendVerification = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const result = await db.query(
      "SELECT id, name, is_verified FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    const user = result.rows[0];
    if (user.is_verified) {
      return res
        .status(400)
        .json({ message: "This account is already verified. Please log in." });
    }

    const newToken = Math.floor(100000 + Math.random() * 900000).toString();
    const newExpiresAt = new Date(Date.now() + 5 * 60 * 1000);

    await db.query(
      "UPDATE users SET verification_code = $1, verification_expires_at = $2 WHERE id = $3",
      [newToken, newExpiresAt, user.id],
    );

    emailService.sendVerificationEmail(email, user.name, newToken);

    res.json({
      message: "A new 6-digit verification code has been sent to your email.",
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const forgotPassword = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ message: "Email is required" });

  try {
    const result = await db.query(
      "SELECT id, name FROM users WHERE email = $1",
      [email],
    );
    if (result.rows.length === 0) {
      // For security, don't reveal if email exists, but we'll show success
      return res.json({
        message:
          "If an account exists with this email, a reset code has been sent.",
      });
    }

    const person = result.rows[0];
    const resetCode = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    await db.query(
      "UPDATE users SET reset_otp = $1, reset_expires_at = $2 WHERE id = $3",
      [resetCode, expiresAt, person.id],
    );

    emailService.sendResetOTP(email, person.name, resetCode);

    res.json({ message: "A 6-digit reset code has been sent to your email." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const resetPassword = async (req, res) => {
  const { email, code, newPassword } = req.body;
  if (!email || !code || !newPassword) {
    return res
      .status(400)
      .json({ message: "Email, code and new password are required" });
  }

  try {
    const userRes = await db.query(
      "SELECT id, reset_otp, reset_expires_at FROM users WHERE email = $1",
      [email],
    );

    if (userRes.rows.length === 0)
      return res.status(404).json({ message: "User not found" });

    const user = userRes.rows[0];

    // Security check: Ensure new password is not the same as the old one
    if (user.password_hash) {
      const isSame = await bcrypt.compare(newPassword, user.password_hash);
      if (isSame) {
        return res.status(400).json({
          message: "New password cannot be the same as your old password",
        });
      }
    }

    if (!user.reset_otp || user.reset_otp !== code) {
      return res.status(400).json({ message: "Invalid reset code" });
    }

    if (new Date() > new Date(user.reset_expires_at)) {
      return res.status(400).json({ message: "Reset code has expired" });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.query(
      "UPDATE users SET password_hash = $1, reset_otp = NULL, reset_expires_at = NULL WHERE id = $2",
      [passwordHash, user.id],
    );

    res.json({ message: "Password reset successful! You can now log in." });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const changePassword = async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const userId = req.user.id; // From verifyToken middleware

  try {
    const userRes = await db.query(
      "SELECT password_hash FROM users WHERE id = $1",
      [userId],
    );
    const user = userRes.rows[0];

    const isMatch = await bcrypt.compare(currentPassword, user.password_hash);
    if (!isMatch)
      return res.status(400).json({ message: "Current password is incorrect" });

    if (currentPassword === newPassword) {
      return res.status(400).json({
        message: "New password cannot be the same as your current password",
      });
    }

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(newPassword, salt);

    await db.query("UPDATE users SET password_hash = $1 WHERE id = $2", [
      passwordHash,
      userId,
    ]);

    res.json({ message: "Password updated successfully" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = {
  register,
  login,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
  changePassword,
};
