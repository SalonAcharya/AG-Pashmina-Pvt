-- Run this once against your Supabase/PostgreSQL database
-- Adds sizes, colors, and weight columns to products table
ALTER TABLE products
ADD COLUMN IF NOT EXISTS sizes TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS colors TEXT[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS weight TEXT;
