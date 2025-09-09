import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import App from './App.tsx';
import { initiateShopifyAuth } from './utils/shopifyAuth.ts';
import './index.css';

// Initialisation de l'App Bridge dès le chargement
import './lib/app-bridge';

// Check if we need to initiate Shopify auth
const urlParams = new URLSearchParams(window.location.search);
const shop = urlParams.get('shop');

// If shop parameter is present and we're not already in the auth flow, start it
if (shop && !window.location.pathname.includes('/auth')) {
  initiateShopifyAuth(shop);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <App />
      <Toaster 
        position="top-right"
        toastOptions={{
          duration: 4000,
          style: {
            background: '#363636',
            color: '#fff',
          },
          success: {
            duration: 3000,
            iconTheme: {
              primary: '#4ade80',
              secondary: '#fff',
            },
          },
          error: {
            duration: 5000,
            iconTheme: {
              primary: '#ef4444',
              secondary: '#fff',
            },
          },
        }}
      />
    </BrowserRouter>
  </StrictMode>
);