/*
  # Create gdpr_requests table
  
  1. New Tables
    - `gdpr_requests`
      - `id` (uuid, primary key)
      - `type` (text, not null)
      - `shop_domain` (text, not null)
      - `customer_id` (text)
      - `customer_email` (text)
      - `request_data` (jsonb)
      - `status` (text)
      - `processed_at` (timestamp)
      - `created_at` (timestamp)
  
  2. Security
    - No RLS needed as this is an admin table
*/

-- Create gdpr_requests table if it doesn't exist
CREATE TABLE IF NOT EXISTS gdpr_requests (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  type text NOT NULL CHECK (type IN ('data_request', 'customer_redact', 'shop_redact')),
  shop_domain text NOT NULL,
  customer_id text,
  customer_email text,
  request_data jsonb,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'failed')),
  processed_at timestamptz,
  created_at timestamptz DEFAULT now()
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_shop ON gdpr_requests(shop_domain);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_status ON gdpr_requests(status);
CREATE INDEX IF NOT EXISTS idx_gdpr_requests_type ON gdpr_requests(type);