/*
  # Schema pour Livia SAV - Migration sécurisée

  1. Tables principales
    - `profiles` - Profils utilisateurs étendus
    - `response_templates` - Modèles de réponses
    - `shopify_accounts` - Comptes Shopify
    - `email_configurations` - Configurations email
    - `help_centers` - Centres d'aide
    - `knowledge_sources` - Sources de connaissances
    - `documents` - Documents
    - `tickets` - Tickets de support

  2. Sécurité
    - RLS activé sur les tables sensibles
    - Politiques pour isoler les données par utilisateur
    - Triggers pour les timestamps automatiques

  3. Gestion des conflits
    - Utilisation de IF NOT EXISTS pour éviter les erreurs
    - Suppression des politiques existantes avant recréation
*/

-- Extension pour les UUIDs
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Table des profils utilisateurs (étend auth.users)
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY,
  first_name text,
  last_name text,
  company_name text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des modèles de réponses
CREATE TABLE IF NOT EXISTS response_templates (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  title character varying(255) NOT NULL,
  content text NOT NULL,
  category character varying(100),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des comptes Shopify
CREATE TABLE IF NOT EXISTS shopify_accounts (
  id uuid PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id uuid,
  shop text NOT NULL,
  access_token text NOT NULL,
  scope text,
  created_at timestamptz DEFAULT timezone('utc'::text, now())
);

-- Table des centres d'aide
CREATE TABLE IF NOT EXISTS help_centers (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name character varying(255) NOT NULL,
  description text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des sources de connaissances
CREATE TABLE IF NOT EXISTS knowledge_sources (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  help_center_id uuid,
  url text NOT NULL,
  title text,
  status character varying(50) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des configurations email
CREATE TABLE IF NOT EXISTS email_configurations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL,
  email_address text NOT NULL,
  smtp_server text NOT NULL,
  smtp_port integer NOT NULL,
  username text NOT NULL,
  password text NOT NULL,
  use_oauth boolean DEFAULT true,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des documents
CREATE TABLE IF NOT EXISTS documents (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  help_center_id uuid,
  filename text NOT NULL,
  file_path text NOT NULL,
  file_type text NOT NULL,
  file_size integer,
  status character varying(50) DEFAULT 'pending',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des tickets
CREATE TABLE IF NOT EXISTS tickets (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  email text NOT NULL,
  customer_name text,
  subject text,
  message text,
  order_id text,
  shipping_info text,
  status text DEFAULT 'pending',
  response text,
  created_at timestamptz DEFAULT now()
);

-- Ajouter les contraintes de clés étrangères si elles n'existent pas
DO $$
BEGIN
  -- Contrainte pour profiles
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'profiles_id_fkey' 
    AND table_name = 'profiles'
  ) THEN
    ALTER TABLE profiles ADD CONSTRAINT profiles_id_fkey 
      FOREIGN KEY (id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte pour response_templates
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'response_templates_user_id_fkey' 
    AND table_name = 'response_templates'
  ) THEN
    ALTER TABLE response_templates ADD CONSTRAINT response_templates_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte pour shopify_accounts
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'shopify_accounts_user_id_fkey' 
    AND table_name = 'shopify_accounts'
  ) THEN
    ALTER TABLE shopify_accounts ADD CONSTRAINT shopify_accounts_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte pour email_configurations
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'email_configurations_user_id_fkey' 
    AND table_name = 'email_configurations'
  ) THEN
    ALTER TABLE email_configurations ADD CONSTRAINT email_configurations_user_id_fkey 
      FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte pour knowledge_sources
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'knowledge_sources_help_center_id_fkey' 
    AND table_name = 'knowledge_sources'
  ) THEN
    ALTER TABLE knowledge_sources ADD CONSTRAINT knowledge_sources_help_center_id_fkey 
      FOREIGN KEY (help_center_id) REFERENCES help_centers(id) ON DELETE CASCADE;
  END IF;

  -- Contrainte pour documents
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'documents_help_center_id_fkey' 
    AND table_name = 'documents'
  ) THEN
    ALTER TABLE documents ADD CONSTRAINT documents_help_center_id_fkey 
      FOREIGN KEY (help_center_id) REFERENCES help_centers(id) ON DELETE CASCADE;
  END IF;
END $$;

-- Ajouter les contraintes uniques si elles n'existent pas
DO $$
BEGIN
  -- Contrainte unique pour email_configurations
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.table_constraints 
    WHERE constraint_name = 'email_configurations_user_id_key' 
    AND table_name = 'email_configurations'
  ) THEN
    ALTER TABLE email_configurations ADD CONSTRAINT email_configurations_user_id_key UNIQUE (user_id);
  END IF;
END $$;

-- Activer RLS sur les tables nécessaires
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE response_templates ENABLE ROW LEVEL SECURITY;
ALTER TABLE email_configurations ENABLE ROW LEVEL SECURITY;

-- Supprimer les politiques existantes avant de les recréer
DROP POLICY IF EXISTS "Users can view their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update their own profile" ON profiles;
DROP POLICY IF EXISTS "Users can view their own templates" ON response_templates;
DROP POLICY IF EXISTS "Users can create their own templates" ON response_templates;
DROP POLICY IF EXISTS "Users can update their own templates" ON response_templates;
DROP POLICY IF EXISTS "Users can delete their own templates" ON response_templates;
DROP POLICY IF EXISTS "Users can view their own email config" ON email_configurations;
DROP POLICY IF EXISTS "Users can create their own email config" ON email_configurations;
DROP POLICY IF EXISTS "Users can update their own email config" ON email_configurations;

-- Créer les nouvelles politiques RLS
CREATE POLICY "Users can view their own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can view their own templates" ON response_templates
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own templates" ON response_templates
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own templates" ON response_templates
  FOR UPDATE USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own templates" ON response_templates
  FOR DELETE USING (auth.uid() = user_id);

CREATE POLICY "Users can view their own email config" ON email_configurations
  FOR SELECT USING (auth.uid() = user_id);

CREATE POLICY "Users can create their own email config" ON email_configurations
  FOR INSERT WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own email config" ON email_configurations
  FOR UPDATE USING (auth.uid() = user_id);

-- Fonction pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Supprimer les triggers existants avant de les recréer
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_response_templates_updated_at ON response_templates;
DROP TRIGGER IF EXISTS update_help_centers_updated_at ON help_centers;
DROP TRIGGER IF EXISTS update_knowledge_sources_updated_at ON knowledge_sources;
DROP TRIGGER IF EXISTS update_email_configurations_updated_at ON email_configurations;
DROP TRIGGER IF EXISTS update_documents_updated_at ON documents;

-- Créer les triggers pour updated_at automatique
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_response_templates_updated_at BEFORE UPDATE ON response_templates
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_help_centers_updated_at BEFORE UPDATE ON help_centers
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_knowledge_sources_updated_at BEFORE UPDATE ON knowledge_sources
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_email_configurations_updated_at BEFORE UPDATE ON email_configurations
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_documents_updated_at BEFORE UPDATE ON documents
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_response_templates_user_id ON response_templates(user_id);
CREATE INDEX IF NOT EXISTS idx_email_configurations_user_id ON email_configurations(user_id);
CREATE INDEX IF NOT EXISTS idx_tickets_email ON tickets(email);
CREATE INDEX IF NOT EXISTS idx_tickets_status ON tickets(status);
CREATE INDEX IF NOT EXISTS idx_tickets_created_at ON tickets(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_knowledge_sources_help_center_id ON knowledge_sources(help_center_id);
CREATE INDEX IF NOT EXISTS idx_documents_help_center_id ON documents(help_center_id);
CREATE INDEX IF NOT EXISTS idx_shopify_accounts_user_id ON shopify_accounts(user_id);