/*
  # Tables pour l'authentification Google sécurisée

  1. Tables
    - `google_users` - Utilisateurs Google OAuth
    - `user_sessions` - Sessions utilisateur sécurisées

  2. Sécurité
    - RLS activé
    - Politiques de sécurité appropriées
    - Index pour les performances

  3. Fonctionnalités
    - Gestion des tokens OAuth
    - Sessions sécurisées
    - Nettoyage automatique des sessions expirées
*/

-- Table des utilisateurs Google
CREATE TABLE IF NOT EXISTS google_users (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  google_id text UNIQUE NOT NULL,
  email text UNIQUE NOT NULL,
  name text NOT NULL,
  given_name text,
  family_name text,
  picture text,
  locale text DEFAULT 'fr',
  access_token text NOT NULL,
  refresh_token text,
  token_expires_at timestamptz NOT NULL,
  last_login timestamptz DEFAULT now(),
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Table des sessions utilisateur
CREATE TABLE IF NOT EXISTS user_sessions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES google_users(id) ON DELETE CASCADE NOT NULL,
  session_token text UNIQUE NOT NULL,
  expires_at timestamptz NOT NULL,
  created_at timestamptz DEFAULT now(),
  last_accessed timestamptz DEFAULT now()
);

-- Activer RLS
ALTER TABLE google_users ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_sessions ENABLE ROW LEVEL SECURITY;

-- Politiques RLS pour google_users
CREATE POLICY "Users can view their own data" ON google_users
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM user_sessions 
      WHERE user_sessions.user_id = google_users.id 
      AND user_sessions.session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
      AND user_sessions.expires_at > now()
    )
  );

CREATE POLICY "Users can update their own data" ON google_users
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM user_sessions 
      WHERE user_sessions.user_id = google_users.id 
      AND user_sessions.session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
      AND user_sessions.expires_at > now()
    )
  );

-- Politiques RLS pour user_sessions
CREATE POLICY "Users can view their own sessions" ON user_sessions
  FOR SELECT USING (
    session_token = current_setting('request.jwt.claims', true)::json->>'session_token'
  );

-- Triggers pour updated_at automatique
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_google_users_updated_at BEFORE UPDATE ON google_users
  FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Fonction pour nettoyer les sessions expirées
CREATE OR REPLACE FUNCTION cleanup_expired_sessions()
RETURNS void AS $$
BEGIN
  DELETE FROM user_sessions WHERE expires_at < now();
END;
$$ language 'plpgsql';

-- Index pour les performances
CREATE INDEX IF NOT EXISTS idx_google_users_google_id ON google_users(google_id);
CREATE INDEX IF NOT EXISTS idx_google_users_email ON google_users(email);
CREATE INDEX IF NOT EXISTS idx_user_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_user_sessions_user_id ON user_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_user_sessions_expires ON user_sessions(expires_at);

-- Contraintes de sécurité
ALTER TABLE google_users ADD CONSTRAINT google_users_email_format 
  CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$');

ALTER TABLE user_sessions ADD CONSTRAINT user_sessions_expires_future 
  CHECK (expires_at > created_at);