const { Pool } = require("pg");
require("dotenv").config({ path: __dirname + "/.env" });

const db = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function migrate() {
  try {
    await db.query(`
      CREATE TABLE IF NOT EXISTS settings (
          id SERIAL PRIMARY KEY,
          key VARCHAR(100) UNIQUE NOT NULL,
          value TEXT
      );
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS vat_amount DECIMAL(10, 2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS delivery_fee DECIMAL(10, 2) DEFAULT 0;
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_method VARCHAR(50);
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_status VARCHAR(50) DEFAULT 'unpaid';
      ALTER TABLE orders ADD COLUMN IF NOT EXISTS payment_proof TEXT;
    `);
    console.log("Migration successful");
  } catch (err) {
    console.error("Migration failed:", err);
  } finally {
    await db.end();
  }
}

migrate();
