-- Run this once against your PostgreSQL database
-- Adds google_id support and makes password_hash optional (for Google-only accounts)
ALTER TABLE users
ADD COLUMN IF NOT EXISTS google_id TEXT UNIQUE;
ALTER TABLE users
ALTER COLUMN password_hash DROP NOT NULL;