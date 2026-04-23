const db = require("../config/db");
const emailService = require("../services/emailService");
const wsService = require("../config/ws");

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

const createOrder = async (req, res) => {
  const {
    total_amount,
    items,
    shipping_address,
    vat_amount,
    delivery_fee,
    payment_method,
    payment_proof,
  } = req.body;
  const user_id = req.user.id;

  if (!items || items.length === 0) {
    return res.status(400).json({ message: "No items in order" });
  }

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // ── 1. Validate stock for every item BEFORE making any changes ──────────
    for (const item of items) {
      const stockRes = await client.query(
        "SELECT name, stock_quantity FROM products WHERE id = $1 FOR UPDATE",
        [item.product_id],
      );
      if (stockRes.rows.length === 0) {
        throw new Error(`Product #${item.product_id} not found`);
      }
      const { name, stock_quantity } = stockRes.rows[0];
      if (stock_quantity < item.quantity) {
        throw new Error(
          `Insufficient stock for "${name}". Only ${stock_quantity} unit(s) left.`,
        );
      }
    }

    // ── 2. Create the order record ───────────────────────────────────────────
    const orderResult = await client.query(
      `INSERT INTO orders (user_id, total_amount, shipping_address, vat_amount, delivery_fee, payment_method, payment_status, payment_proof) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING id`,
      [
        user_id,
        total_amount,
        shipping_address,
        vat_amount || 0,
        delivery_fee || 0,
        payment_method || "cod",
        payment_method === "cod" ? "unpaid" : "pending_verification",
        payment_proof || null,
      ],
    );
    const orderId = orderResult.rows[0].id;

    // ── 3. Insert order items and deduct stock ───────────────────────────────
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

      // Deduct stock
      await client.query(
        "UPDATE products SET stock_quantity = stock_quantity - $1 WHERE id = $2",
        [item.quantity, item.product_id],
      );
    }

    await client.query("COMMIT");

    // ── Broadcast real-time notification to admin dashboard ─────────────────
    wsService.broadcast({
      type: "new_order",
      orderId: orderId,
      total: total_amount,
      paymentMethod: payment_method || "cod",
      userId: user_id,
      timestamp: new Date().toISOString(),
    });

    res.status(201).json({ id: orderId, message: "Order placed successfully" });

    // ── 4. Send Confirmation Email (Asynchronously) ─────────────────────────
    try {
      // Fetch user info for the email
      const userRes = await db.query(
        "SELECT name, email FROM users WHERE id = $1",
        [user_id],
      );
      const user = userRes.rows[0];

      if (user) {
        // Fetch order items with names for the email
        const itemsWithNamesRes = await db.query(
          `SELECT oi.*, p.name AS product_name 
           FROM order_items oi JOIN products p ON oi.product_id = p.id 
           WHERE oi.order_id = $1`,
          [orderId],
        );

        const fullOrder = {
          id: orderId,
          total_amount,
          shipping_address,
          items: itemsWithNamesRes.rows,
        };

        emailService.sendOrderConfirmationEmail(
          user.email,
          user.name,
          fullOrder,
        );

        emailService.sendAdminOrderNotification(fullOrder);
      }
    } catch (emailErr) {
      console.error("Order confirmation email trigger failed:", emailErr);
    }
  } catch (err) {
    await client.query("ROLLBACK");
    // Stock-related errors get a 400; other DB errors get 500
    const isStockError =
      err.message.includes("Insufficient stock") ||
      err.message.includes("not found");
    res.status(isStockError ? 400 : 500).json({ message: err.message });
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
    let whereClauses = [];

    if (req.user.role_id !== 1 || req.query.mine === "true") {
      whereClauses.push("o.user_id = $" + (params.length + 1));
      params.push(req.user.id);
    }

    if (req.query.status && req.query.status !== "all") {
      whereClauses.push("o.status = $" + (params.length + 1));
      params.push(req.query.status);
    }

    if (whereClauses.length > 0) {
      query += " WHERE " + whereClauses.join(" AND ");
    }

    query += " ORDER BY o.created_at DESC";
    const result = await db.query(query, params);
    const orders = result.rows;

    // Attach order items (with product name + images) to each order
    if (orders.length > 0) {
      const orderIds = orders.map((o) => o.id);
      const itemsRes = await db.query(
        `SELECT oi.order_id, oi.id, oi.product_id, oi.quantity, oi.price, oi.size, oi.color,
                p.name AS product_name, p.images AS product_images, p.stock_quantity
         FROM order_items oi
         JOIN products p ON oi.product_id = p.id
         WHERE oi.order_id = ANY($1)`,
        [orderIds],
      );

      // Group items by order_id for O(1) lookup
      const itemsByOrder = {};
      for (const item of itemsRes.rows) {
        if (!itemsByOrder[item.order_id]) itemsByOrder[item.order_id] = [];
        // Ensure product_images is a real array
        item.product_images = parsePgArray(item.product_images);
        itemsByOrder[item.order_id].push(item);
      }

      orders.forEach((o) => {
        o.items = itemsByOrder[o.id] || [];
      });
    }

    res.json(orders);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const updateOrderStatus = async (req, res) => {
  const { id } = req.params;
  const { status, payment_status } = req.body;

  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // Fetch current status to detect cancellation transition
    const currentRes = await client.query(
      "SELECT status FROM orders WHERE id = $1",
      [id],
    );
    if (currentRes.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }
    const previousStatus = currentRes.rows[0].status;

    // Build the UPDATE query
    let query;
    let params;
    if (payment_status) {
      query =
        "UPDATE orders SET status = $1, payment_status = $2 WHERE id = $3 RETURNING *";
      params = [status || previousStatus, payment_status, id];
    } else {
      query = "UPDATE orders SET status = $1 WHERE id = $2 RETURNING *";
      params = [status, id];
    }
    const result = await client.query(query, params);

    // ── Restore stock when order is cancelled, only from pending/processing ──
    const newStatus = result.rows[0].status;
    const restorableStatuses = ["pending", "processing"];
    if (
      newStatus === "cancelled" &&
      restorableStatuses.includes(previousStatus)
    ) {
      await client.query(
        `UPDATE products p
         SET stock_quantity = p.stock_quantity + oi.quantity
         FROM order_items oi
         WHERE oi.order_id = $1 AND p.id = oi.product_id`,
        [id],
      );
    }

    await client.query("COMMIT");
    res.json(result.rows[0]);
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

const deleteOrder = async (req, res) => {
  const { id } = req.params;
  const client = await db.pool.connect();
  try {
    await client.query("BEGIN");

    // Delete order items first (in case CASCADE is not set)
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);

    // Delete the order
    const result = await client.query("DELETE FROM orders WHERE id = $1", [id]);

    if (result.rowCount === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({ message: "Order not found" });
    }

    await client.query("COMMIT");
    res.json({ message: "Order deleted successfully" });
  } catch (err) {
    await client.query("ROLLBACK");
    res.status(500).json({ message: err.message });
  } finally {
    client.release();
  }
};

module.exports = {
  createOrder,
  getOrders,
  updateOrderStatus,
  deleteOrder,
};
