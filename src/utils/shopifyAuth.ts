// src/utils/shopifyAuth.ts

// URL publique de tes Edge Functions Supabase
const FUNCTIONS_BASE =
  (import.meta as any)?.env?.VITE_SUPABASE_FUNCTIONS_URL ||
  (typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL : null) ||
  'https://<PROJECT-REF>.functions.supabase.co'; // ← remplace par ton URL si besoin

export function initiateShopifyAuth(shop: string, mode: 'online' | 'offline' = 'offline'): void {
  // Normalise le domaine
  let s = shop.trim().toLowerCase();
  if (!s.endsWith('.myshopify.com')) s = `${s}.myshopify.com`;

  // Redirige vers la fonction qui génère l’URL d’authorize
  const url =
    `${FUNCTIONS_BASE}/shopify-oauth-start` +
    `?shop=${encodeURIComponent(s)}&mode=${mode}&redirect=1`;

  window.location.href = url;
}
