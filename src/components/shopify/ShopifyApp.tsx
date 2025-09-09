import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useShopify } from '../../hooks/useShopify';
import { useApp } from '../../contexts/AppContext';
import { Sidebar } from '../layout/Sidebar';
import { Header } from '../layout/Header';
import { Dashboard } from '../dashboard/Dashboard';
import { TicketList } from '../tickets/TicketList';
import { CustomerManagement } from '../customers/CustomerManagement';
import { TemplateManagement } from '../templates/TemplateManagement';
import { AnalyticsDashboard } from '../analytics/AnalyticsDashboard';
import { AutomationManagement } from '../automations/AutomationManagement';
import { Settings } from '../settings/Settings';
import { ConfigurationDashboard } from '../configuration/ConfigurationDashboard';
import { OnboardingFlow } from '../onboarding/OnboardingFlow';
import { Loader2 } from 'lucide-react';

export function ShopifyApp() {
  const [searchParams] = useSearchParams();
  const { currentView, setCurrentView, user } = useApp();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [showOnboarding, setShowOnboarding] = useState(false);
  const { shopData, isAuthenticated, loading } = useShopify();

  const shop = searchParams.get('shop') || localStorage.getItem('shopify_shop');
  
  // Sauvegarder le shop dans localStorage pour le conserver entre les navigations
  useEffect(() => {
    if (shop) {
      localStorage.setItem('shopify_shop', shop);
    }
  }, [shop]);

  // Vérifier si l'utilisateur a besoin de l'onboarding
  useEffect(() => {
    if (user && !user.onboardingCompleted) {
      setShowOnboarding(true);
    }
  }, [user]);

  // Afficher l'onboarding si nécessaire
  if (showOnboarding) {
    return <OnboardingFlow />;
  }

  // Afficher le loading pendant la vérification
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Chargement de votre boutique...</p>
        </div>
      </div>
    );
  }

  const renderCurrentView = () => {
    switch (currentView) {
      case 'dashboard':
        return <Dashboard />;
      case 'tickets':
        return <TicketList />;
      case 'customers':
        return <CustomerManagement />;
      case 'templates':
        return <TemplateManagement />;
      case 'analytics':
        return <AnalyticsDashboard />;
      case 'automations':
        return <AutomationManagement />;
      case 'ai-config':
        return <ConfigurationDashboard />;
      case 'settings':
        return <Settings />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar 
        collapsed={sidebarCollapsed} 
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
        currentView={currentView}
        setCurrentView={setCurrentView}
      />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header 
          onMenuClick={() => setSidebarCollapsed(!sidebarCollapsed)}
          shop={shop}
          shopData={shopData}
        />
        <main className="flex-1 overflow-y-auto p-6">
          {renderCurrentView()}
        </main>
      </div>
    </div>
  );
}