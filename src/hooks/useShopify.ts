import { useState, useEffect } from 'react';
// Si tu utilises App Bridge, garde-le pour plus tard.
import { appBridge } from '../lib/app-bridge';

interface ShopData {
  id: string;
  name: string;
  domain: string;
  email: string;
  currency: string;
  timezone: string;
}

interface Order {
  id: string;
  order_number: string;
  customer: { id: string; email: string; first_name: string; last_name: string };
  total_price: string;
  created_at: string;
  financial_status: string;
  fulfillment_status: string;
}

// 👉 Mets ça dans un .env public si possible
const FUNCTIONS_BASE =
  // ex: Vite / Next public env
  (import.meta as any)?.env?.VITE_SUPABASE_FUNCTIONS_URL ||
  (typeof process !== 'undefined' ? (process as any).env?.NEXT_PUBLIC_SUPABASE_FUNCTIONS_URL : null) ||
  // fallback: remplace par ton URL Supabase
  'https://<PROJECT-REF>.functions.supabase.co';

export function useShopify() {
  const [shopData, setShopData] = useState<ShopData | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  // 1) À l'atterrissage après OAuth : mémorise le shop et passe en "connecté"
  useEffect(() => {
    try {
      const url = new URL(window.location.href);
      const shop = url.searchParams.get('shop');
      const installed = url.searchParams.get('installed');

      if (shop) {
        localStorage.setItem('shopify_shop', shop);
      }
      const shopDomain = shop || localStorage.getItem('shopify_shop') || '';

      if (shopDomain) {
        setShopData({
          id: 'local',
          name: 'Boutique Shopify',
          domain: shopDomain,
          email: '',
          currency: 'EUR',
          timezone: 'Europe/Paris',
        });
        // Si on revient de l’install, on peut enregistrer les webhooks
        if (installed === '1') {
          registerWebhooks(shopDomain).catch(() => {});
        }
        setIsAuthenticated(true);
      }
    } finally {
      setLoading(false);
    }
  }, []);

  // 2) Démarrer l'installation OAuth (redirige direct vers la fonction)
  const startInstall = async (shop: string, mode: 'online' | 'offline' = 'offline') => {
    const url =
      `${FUNCTIONS_BASE}/shopify-oauth-start` +
      `?shop=${encodeURIComponent(shop)}` +
      `&mode=${mode}&redirect=1`;
    window.location.href = url;
  };

  // 3) Enregistrer les webhooks (via Edge Function)
  const registerWebhooks = async (shop?: string) => {
    const domain = shop || localStorage.getItem('shopify_shop');
    if (!domain) return { success: false, error: 'Shop inconnu' };

    const r = await fetch(`${FUNCTIONS_BASE}/shopify-webhook-register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ shop: domain }),
    });
    if (!r.ok) throw new Error('Webhook register failed');
    return r.json();
  };

  // 4) (Optionnel plus tard) Récupérer des commandes via une Edge Function backend
  const fetchOrders = async (limit = 50): Promise<Order[]> => {
    // Crée une fonction Edge "shopify-orders" côté serveur qui lit en DB le token et appelle l’API Admin,
    // puis décommente ici. Pour l’instant on renvoie un tableau vide.
    return [];
    // Exemple d’appel :
    // const shop = localStorage.getItem('shopify_shop');
    // const r = await fetch(`${FUNCTIONS_BASE}/shopify-orders?shop=${encodeURIComponent(shop!)}&limit=${limit}`);
    // const { orders } = await r.json();
    // return orders as Order[];
  };

  // ⚠️ SUPPRIMÉ: exchangeCodeForToken —> c'est la fonction Edge `shopify-callback` qui fait l’échange, pas ce hook.
  // ⚠️ SUPPRIMÉ: checkSession / authenticatedFetch front '/api/shopify/*' —> bascule vers des Edge Functions.

  return {
    shopData,
    isAuthenticated,
    loading,
    startInstall,
    registerWebhooks,
    fetchOrders,
  };
}
