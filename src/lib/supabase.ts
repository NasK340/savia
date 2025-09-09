import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

// Use demo/placeholder values if environment variables are not set
const defaultUrl = 'https://demo.supabase.co';
const defaultKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZS1kZW1vIiwicm9sZSI6ImFub24iLCJleHAiOjE5ODM4MTI5OTZ9.CRXP1A7WOeoJeXxjNni43kdQwgnWNReilDMblYTn_I0';

export const supabase = createClient(
  supabaseUrl || defaultUrl,
  supabaseAnonKey || defaultKey
);

// Log warning if using demo values
if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('⚠️ Using demo Supabase configuration. Please set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY environment variables for production use.');
}

// Types pour la base de données
export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string;
          email: string;
          name: string;
          company: string;
          avatar_url?: string;
          plan: 'starter' | 'pro' | 'enterprise';
          onboarding_completed: boolean;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          company: string;
          avatar_url?: string;
          plan?: 'starter' | 'pro' | 'enterprise';
          onboarding_completed?: boolean;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          company?: string;
          avatar_url?: string;
          plan?: 'starter' | 'pro' | 'enterprise';
          onboarding_completed?: boolean;
          updated_at?: string;
        };
      };
      business_info: {
        Row: {
          id: string;
          user_id: string;
          shop_name: string;
          shop_url?: string;
          sector: string;
          response_time_preference: string;
          return_policy?: string;
          shipping_policy?: string;
          tone_preference: 'formal' | 'friendly' | 'neutral';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          shop_name: string;
          shop_url?: string;
          sector: string;
          response_time_preference?: string;
          return_policy?: string;
          shipping_policy?: string;
          tone_preference?: 'formal' | 'friendly' | 'neutral';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          shop_name?: string;
          shop_url?: string;
          sector?: string;
          response_time_preference?: string;
          return_policy?: string;
          shipping_policy?: string;
          tone_preference?: 'formal' | 'friendly' | 'neutral';
          updated_at?: string;
        };
      };
      tickets: {
        Row: {
          id: string;
          user_id: string;
          customer_email: string;
          customer_name: string;
          subject: string;
          content: string;
          tag: 'return' | 'exchange' | 'delivery' | 'order' | 'complaint' | 'other';
          status: 'open' | 'pending' | 'resolved' | 'closed';
          priority: 'low' | 'medium' | 'high' | 'urgent';
          order_number?: string;
          ai_handled: boolean;
          ai_confidence?: number;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          customer_email: string;
          customer_name: string;
          subject: string;
          content: string;
          tag?: 'return' | 'exchange' | 'delivery' | 'order' | 'complaint' | 'other';
          status?: 'open' | 'pending' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          order_number?: string;
          ai_handled?: boolean;
          ai_confidence?: number;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          customer_email?: string;
          customer_name?: string;
          subject?: string;
          content?: string;
          tag?: 'return' | 'exchange' | 'delivery' | 'order' | 'complaint' | 'other';
          status?: 'open' | 'pending' | 'resolved' | 'closed';
          priority?: 'low' | 'medium' | 'high' | 'urgent';
          order_number?: string;
          ai_handled?: boolean;
          ai_confidence?: number;
          updated_at?: string;
        };
      };
      ticket_responses: {
        Row: {
          id: string;
          ticket_id: string;
          content: string;
          is_ai: boolean;
          sender: 'customer' | 'agent' | 'ai';
          created_at: string;
        };
        Insert: {
          id?: string;
          ticket_id: string;
          content: string;
          is_ai?: boolean;
          sender: 'customer' | 'agent' | 'ai';
          created_at?: string;
        };
        Update: {
          id?: string;
          ticket_id?: string;
          content?: string;
          is_ai?: boolean;
          sender?: 'customer' | 'agent' | 'ai';
        };
      };
      integrations: {
        Row: {
          id: string;
          user_id: string;
          type: 'email' | 'shopify';
          connected: boolean;
          access_token?: string;
          refresh_token?: string;
          last_sync?: string;
          status: 'connected' | 'error' | 'disconnected';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          type: 'email' | 'shopify';
          connected?: boolean;
          access_token?: string;
          refresh_token?: string;
          last_sync?: string;
          status?: 'connected' | 'error' | 'disconnected';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: 'email' | 'shopify';
          connected?: boolean;
          access_token?: string;
          refresh_token?: string;
          last_sync?: string;
          status?: 'connected' | 'error' | 'disconnected';
          updated_at?: string;
        };
      };
    };
  };
}