import { supabase } from './supabase';
import { User } from '../types';

export interface AuthUser {
  id: string;
  email: string;
  name: string;
  company: string;
  avatar?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  onboardingCompleted: boolean;
}

export class AuthService {
  static async signUp(email: string, password: string, userData: { name: string; company: string }) {
    try {
      // 1. Créer l'utilisateur dans Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erreur lors de la création du compte');
      }

      // 2. Créer le profil utilisateur dans notre table
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .insert({
          id: authData.user.id,
          email,
          name: userData.name,
          company: userData.company,
          plan: 'starter',
          onboarding_completed: false,
        })
        .select()
        .single();

      if (profileError) throw profileError;

      // 3. Créer les intégrations par défaut
      await supabase.from('integrations').insert([
        {
          user_id: authData.user.id,
          type: 'email',
          connected: false,
          status: 'disconnected',
        },
        {
          user_id: authData.user.id,
          type: 'shopify',
          connected: false,
          status: 'disconnected',
        },
      ]);

      return {
        user: this.mapToAuthUser(userProfile),
        session: authData.session,
      };
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      throw error;
    }
  }

  static async signIn(email: string, password: string) {
    try {
      const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (authError) throw authError;

      if (!authData.user) {
        throw new Error('Erreur lors de la connexion');
      }

      // Récupérer le profil utilisateur
      const { data: userProfile, error: profileError } = await supabase
        .from('users')
        .select('*')
        .eq('id', authData.user.id)
        .single();

      if (profileError) throw profileError;

      return {
        user: this.mapToAuthUser(userProfile),
        session: authData.session,
      };
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      throw error;
    }
  }

  static async signOut() {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors de la déconnexion:', error);
      throw error;
    }
  }

  static async getCurrentUser(): Promise<AuthUser | null> {
    try {
      const { data: { user } } = await supabase.auth.getUser();
      
      if (!user) return null;

      const { data: userProfile, error } = await supabase
        .from('users')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error) throw error;

      return this.mapToAuthUser(userProfile);
    } catch (error) {
      console.error('Erreur lors de la récupération de l\'utilisateur:', error);
      return null;
    }
  }

  static async updateUser(userId: string, updates: Partial<AuthUser>) {
    try {
      const { data, error } = await supabase
        .from('users')
        .update({
          name: updates.name,
          company: updates.company,
          onboarding_completed: updates.onboardingCompleted,
          updated_at: new Date().toISOString(),
        })
        .eq('id', userId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToAuthUser(data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur:', error);
      throw error;
    }
  }

  private static mapToAuthUser(dbUser: any): AuthUser {
    return {
      id: dbUser.id,
      email: dbUser.email,
      name: dbUser.name,
      company: dbUser.company,
      avatar: dbUser.avatar_url,
      plan: dbUser.plan,
      onboardingCompleted: dbUser.onboarding_completed,
    };
  }

  static onAuthStateChange(callback: (user: AuthUser | null) => void) {
    return supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        const user = await this.getCurrentUser();
        callback(user);
      } else {
        callback(null);
      }
    });
  }
}