import React, { useState } from 'react';
import { Bell, Search, Menu, User, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';

interface HeaderProps {
  onMenuClick: () => void;
  shop?: string | null;
  shopData?: any;
}

export function Header({ onMenuClick, shop, shopData }: HeaderProps) {
  const [showNotifications, setShowNotifications] = useState(false);

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMenuClick}
            className="lg:hidden"
          >
            <Menu size={20} />
          </Button>
          
          {shopData && (
            <div className="hidden md:block">
              <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                {shopData.name}
                <a 
                  href={`https://${shop}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:text-blue-600"
                >
                  <ExternalLink size={16} />
                </a>
              </h2>
              <p className="text-sm text-gray-500">SAV Assistant Shopify</p>
            </div>
          )}
          
          <div className="relative hidden md:block">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Rechercher des tickets, clients..."
              className="pl-10 pr-4 py-2 w-80 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        </div>

        <div className="flex items-center gap-4">
          {/* Notifications */}
          <div className="relative">
            <button 
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors hover:bg-gray-100 rounded-lg"
            >
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 h-5 w-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                3
              </span>
            </button>
          </div>
          
          <div className="hidden md:flex items-center gap-2 px-3 py-1.5 bg-green-100 text-green-800 rounded-full text-sm font-medium">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
            Shopify connecté
          </div>

          {/* User Profile */}
          <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
            <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white font-bold text-sm">
              {shopData?.name?.charAt(0) || 'S'}
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-900">{shopData?.name || 'Boutique'}</p>
              <p className="text-xs text-gray-500">{shop}</p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}