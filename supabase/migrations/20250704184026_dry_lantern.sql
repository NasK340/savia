-- Create table for Shopify secrets
CREATE TABLE IF NOT EXISTS shopify_secrets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  shop_domain text NOT NULL,
  api_key text NOT NULL,
  api_secret text NOT NULL,
  access_token text,
  scope text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  CONSTRAINT fk_user FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE shopify_secrets ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view their own Shopify secrets" ON shopify_secrets
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own Shopify secrets" ON shopify_secrets
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own Shopify secrets" ON shopify_secrets
  FOR UPDATE USING (auth.uid() = user_id);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_shopify_secrets_user_id ON shopify_secrets(user_id);
CREATE INDEX IF NOT EXISTS idx_shopify_secrets_shop_domain ON shopify_secrets(shop_domain);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_shopify_secrets_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger
CREATE TRIGGER update_shopify_secrets_updated_at
  BEFORE UPDATE ON shopify_secrets
  FOR EACH ROW
  EXECUTE FUNCTION update_shopify_secrets_updated_at();