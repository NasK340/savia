import React, { createContext, useContext, ReactNode, useState } from 'react';

interface ShopifyContextType {
  shop: string | null;
  setShop: (shop: string | null) => void;
  accessToken: string | null;
  setAccessToken: (token: string | null) => void;
}

const ShopifyContext = createContext<ShopifyContextType | undefined>(undefined);

export function ShopifyProvider({ children }: { children: ReactNode }) {
  const [shop, setShop] = useState<string | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  return (
    <ShopifyContext.Provider value={{
      shop,
      setShop,
      accessToken,
      setAccessToken,
    }}>
      {children}
    </ShopifyContext.Provider>
  );
}

export function useShopifyContext() {
  const context = useContext(ShopifyContext);
  if (context === undefined) {
    throw new Error('useShopifyContext must be used within a ShopifyProvider');
  }
  return context;
}