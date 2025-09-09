// Singleton App Bridge - Utilise l'instance injectée par le script CDN
// OBLIGATOIRE pour les validations automatiques Shopify

interface ShopifyAppBridge {
  createApp: (config: any) => any;
  actions: {
    Redirect: {
      Action: {
        APP: string;
        ADMIN_SECTION: string;
        REMOTE: string;
      };
      create: (app: any, options: any) => any;
    };
    TitleBar: {
      create: (app: any, options: any) => any;
    };
    Toast: {
      create: (app: any, options: any) => any;
    };
    Modal: {
      create: (app: any, options: any) => any;
    };
  };
  authenticatedFetch: (app: any) => (url: string, options?: any) => Promise<Response>;
  getSessionToken: (app: any) => Promise<string>;
}

declare global {
  interface Window {
    ShopifyAppBridge: ShopifyAppBridge;
  }
}

class AppBridgeManager {
  private app: any = null;
  private isInitialized = false;

  initialize(shop: string, apiKey: string): any {
    if (this.isInitialized && this.app) {
      return this.app;
    }

    // Vérifier que App Bridge est chargé depuis le CDN
    if (!window.ShopifyAppBridge) {
      console.error('Shopify App Bridge not loaded from CDN');
      throw new Error('Shopify App Bridge not available');
    }

    try {
      this.app = window.ShopifyAppBridge.createApp({
        apiKey,
        shop,
        forceRedirect: true,
      });

      this.isInitialized = true;
      console.log('App Bridge initialized successfully');
      return this.app;
    } catch (error) {
      console.error('Failed to initialize App Bridge:', error);
      throw error;
    }
  }

  getApp(): any {
    if (!this.app) {
      throw new Error('App Bridge not initialized');
    }
    return this.app;
  }

  // Redirection via App Bridge (requis pour les validations)
  redirect(url: string) {
    if (!this.app) {
      // Fallback pour le développement
      if (import.meta.env.DEV) {
        window.location.href = url;
        return;
      }
      throw new Error('App Bridge not initialized');
    }

    const redirect = window.ShopifyAppBridge.actions.Redirect.create(this.app, {
      url,
    });
    redirect.dispatch(window.ShopifyAppBridge.actions.Redirect.Action.APP);
  }

  // Obtenir le session token (requis pour l'authentification)
  async getSessionToken(): Promise<string> {
    if (!this.app) {
      throw new Error('App Bridge not initialized');
    }

    try {
      return await window.ShopifyAppBridge.getSessionToken(this.app);
    } catch (error) {
      console.error('Failed to get session token:', error);
      throw error;
    }
  }

  // Fetch authentifié avec session token
  async authenticatedFetch(url: string, options: RequestInit = {}): Promise<Response> {
    const sessionToken = await this.getSessionToken();
    
    return fetch(url, {
      ...options,
      headers: {
        ...options.headers,
        'Authorization': `Bearer ${sessionToken}`,
        'Content-Type': 'application/json',
      },
    });
  }

  // Afficher un toast
  showToast(message: string, isError = false) {
    if (!this.app) return;

    const toast = window.ShopifyAppBridge.actions.Toast.create(this.app, {
      message,
      duration: 5000,
      isError,
    });
    toast.dispatch(window.ShopifyAppBridge.actions.Toast.Action.SHOW);
  }
}

// Instance singleton
export const appBridge = new AppBridgeManager();

// Configuration par défaut avec l'URL de redirection correcte
export const SHOPIFY_CONFIG = {
  apiKey: '35e0dfe82aa9795b8f7f3ec8a1cf58bf',
  scopes: 'read_orders,write_orders,read_customers,write_customers,read_products,read_content',
  // Utiliser l'URL complète pour la validation Shopify
  redirectUri: `${window.location.origin}/auth/callback`,
  clientSecret: 'd51b32370a09a451de785957399f386c',
  webhookSecret: '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'
};