/*
  # Add status index to tickets table
  
  1. New Indexes
    - Add index on tickets.status for faster filtering by status
    - Add index on tickets.created_at for chronological sorting
  
  2. Security
    - Enable row level security on tickets table
    - Add policies for ticket access control
*/

-- Add indexes for better performance
CREATE INDEX IF NOT EXISTS idx_tickets_status ON public.tickets USING btree (status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON public.tickets USING btree (created_at DESC);

-- Enable row level security
ALTER TABLE tickets ENABLE ROW LEVEL SECURITY;

-- Create policies for ticket access
CREATE POLICY "Users can view their own tickets" ON tickets
  FOR SELECT USING (
    email IN (
      SELECT email FROM profiles
      WHERE id = auth.uid()
    )
  );

CREATE POLICY "Admin can view all tickets" ON tickets
  FOR ALL USING (
    auth.uid() IN (
      SELECT id FROM auth.users
      WHERE email = 'admin@example.com'
    )
  );

-- Add function to extract order ID from subject
CREATE OR REPLACE FUNCTION extract_order_id(subject text) RETURNS text
AS $$
DECLARE
  order_id text;
BEGIN
  -- Try to extract order number with pattern #12345
  SELECT substring(subject FROM '#([0-9]+)') INTO order_id;
  RETURN order_id;
END;
$$ LANGUAGE plpgsql;

-- Add trigger to automatically extract order ID from subject
CREATE OR REPLACE FUNCTION set_order_id_from_subject()
RETURNS TRIGGER AS $$
BEGIN
  IF NEW.order_id IS NULL AND NEW.subject IS NOT NULL THEN
    NEW.order_id := extract_order_id(NEW.subject);
  END IF;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger
DROP TRIGGER IF EXISTS set_order_id_trigger ON tickets;
CREATE TRIGGER set_order_id_trigger
  BEFORE INSERT OR UPDATE ON tickets
  FOR EACH ROW
  EXECUTE FUNCTION set_order_id_from_subject();