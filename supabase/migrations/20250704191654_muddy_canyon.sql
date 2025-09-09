/*
  # Create shopify_accounts table
  
  1. New Tables
    - `shopify_accounts`
      - `id` (uuid, primary key)
      - `user_id` (uuid, foreign key to users)
      - `shop` (text, not null)
      - `access_token` (text, not null)
      - `scope` (text)
      - `created_at` (timestamp)
  
  2. Security
    - Enable RLS on `shopify_accounts` table
    - Add policy for authenticated users to read their own data
*/

-- Create shopify_accounts table if it doesn't exist
CREATE TABLE IF NOT EXISTS shopify_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE,
  shop text NOT NULL,
  access_token text NOT NULL,
  scope text,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Create index for better performance
CREATE INDEX IF NOT EXISTS idx_shopify_accounts_user_id ON shopify_accounts USING btree (user_id);

-- Enable row level security
ALTER TABLE shopify_accounts ENABLE ROW LEVEL SECURITY;

-- Create policy for users to read their own data
CREATE POLICY "Users can read their own shopify accounts"
  ON shopify_accounts
  FOR SELECT
  USING (auth.uid() = user_id);

-- Create policy for users to insert their own data
CREATE POLICY "Users can insert their own shopify accounts"
  ON shopify_accounts
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create policy for users to update their own data
CREATE POLICY "Users can update their own shopify accounts"
  ON shopify_accounts
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Create policy for users to delete their own data
CREATE POLICY "Users can delete their own shopify accounts"
  ON shopify_accounts
  FOR DELETE
  USING (auth.uid() = user_id);