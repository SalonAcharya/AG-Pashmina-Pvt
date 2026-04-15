const db = require("../config/db");

const createOrder = async (req, res) => {
  const { total_amount, items, shipping_address } = req.body;
  const user_id = req.user.id;

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    const orderResult = await client.query(
      "INSERT INTO orders (user_id, total_amount, shipping_address) VALUES ($1, $2, $3) RETURNING id",
      [user_id, total_amount, shipping_address],
    );
    const orderId = orderResult.rows[0].id;

    for (const item of items) {
      await client.query(
        "INSERT INTO order_items (order_id, product_id, quantity, price, size, color) VALUES ($1, $2, $3, $4, $5, $6)",
        [
          orderId,
          item.product_id,
          item.quantity,
          item.price,
          item.size,
          item.color,
        ],
      );
    }

    await client.query("COMMIT");
    res.status(201).json({ id: orderId, message: "Order placed successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const getOrders = async (req, res) => {
  try {
    // Admin gets all orders, customers get their own
    let query =
      "SELECT o.*, u.name as user_name FROM orders o JOIN users u ON o.user_id = u.id";
    let params = [];

    if (req.user.role_id !== 1) {
      query += " WHERE o.user_id = $1";
      params.push(req.user.id);
    }

    query += " ORDER BY o.created_at DESC";
    const result = await db.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;
  try {
    const result = await db.query(
      "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *",
      [status, id],
    );
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { createOrder, getOrders, updateOrderStatus };
