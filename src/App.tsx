import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './contexts/AppContext';
import { ShopifyProvider } from './contexts/ShopifyContext';
import { AuthCallback } from './components/auth/AuthCallback';
import { LandingPage } from './components/landing/LandingPage';
import { GoogleCallback } from './components/auth/GoogleCallback';
import { ShopifyApp } from './components/shopify/ShopifyApp';
import { AuthGuard } from './components/auth/AuthGuard';

function App() {
  return (
    <AppProvider>
      <ShopifyProvider>
        <Routes>
          {/* Landing page publique */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Callback OAuth Shopify - DOIT être en premier pour capturer tous les paramètres */}
          <Route path="/auth/callback" element={<AuthCallback />} />
          
          {/* Callback OAuth Google */}
          <Route path="/auth/google/callback" element={<GoogleCallback />} />
          
          {/* Application principale protégée */}
          <Route 
            path="/app" 
            element={
              <AuthGuard>
                <ShopifyApp />
              </AuthGuard>
            } 
          />
          
          {/* Redirection pour /dashboard vers /app */}
          <Route path="/dashboard" element={<Navigate to="/app" replace />} />
          
          {/* Redirection pour /login et /register vers / (landing page) */}
          <Route path="/login" element={<Navigate to="/" replace />} />
          <Route path="/register" element={<Navigate to="/" replace />} />
          
          {/* Fallback - gère toutes les autres routes */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </ShopifyProvider>
    </AppProvider>
  );
}

export default App;