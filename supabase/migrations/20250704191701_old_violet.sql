/*
  # Create shopify_webhooks table
  
  1. New Tables
    - `shopify_webhooks`
      - `id` (uuid, primary key)
      - `shop_domain` (text, not null)
      - `webhook_id` (text, not null)
      - `topic` (text, not null)
      - `address` (text, not null)
      - `created_at` (timestamp)
  
  2. Security
    - No RLS needed as this is an admin table
*/

-- Create shopify_webhooks table if it doesn't exist
CREATE TABLE IF NOT EXISTS shopify_webhooks (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  shop_domain text NOT NULL,
  webhook_id text NOT NULL,
  topic text NOT NULL,
  address text NOT NULL,
  created_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_shop ON shopify_webhooks(shop_domain);
CREATE INDEX IF NOT EXISTS idx_shopify_webhooks_topic ON shopify_webhooks(topic);