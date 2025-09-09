import React from 'react';
import { 
  LayoutDashboard, 
  Mail, 
  Settings, 
  Users, 
  BarChart3, 
  MessageSquare,
  Zap,
  ChevronLeft,
  ChevronRight,
  Brain,
  Puzzle
} from 'lucide-react';
import { cn } from '../../utils/cn';

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  currentView: string;
  setCurrentView: (view: string) => void;
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: LayoutDashboard },
  { id: 'tickets', name: 'Tickets', icon: Mail },
  { id: 'customers', name: 'Clients', icon: Users },
  { id: 'templates', name: 'Modèles', icon: MessageSquare },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'automations', name: 'Automatisation', icon: Zap },
  { id: 'integrations', name: 'Intégrations', icon: Puzzle },
  { id: 'ai-config', name: 'Configuration IA', icon: Brain },
  { id: 'settings', name: 'Paramètres', icon: Settings },
];

export function Sidebar({ collapsed, onToggle, currentView, setCurrentView }: SidebarProps) {
  return (
    <div className={cn(
      'bg-gray-900 text-white transition-all duration-300 flex flex-col',
      collapsed ? 'w-16' : 'w-64'
    )}>
      {/* Header */}
      <div className="p-4 border-b border-gray-800">
        <div className="flex items-center justify-between">
          {!collapsed && (
            <div>
              <h1 className="text-xl font-bold">Livia SAV</h1>
              <p className="text-sm text-gray-400">Shopify App</p>
            </div>
          )}
          <button
            onClick={onToggle}
            className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
          >
            {collapsed ? <ChevronRight size={20} /> : <ChevronLeft size={20} />}
          </button>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          
          return (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all duration-200',
                isActive 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'hover:bg-gray-800 text-gray-300 hover:text-white'
              )}
            >
              <Icon size={20} className="flex-shrink-0" />
              {!collapsed && (
                <span className="font-medium">{item.name}</span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-800">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-sm font-bold">
            S
          </div>
          {!collapsed && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium truncate">Shopify Store</p>
              <p className="text-xs text-gray-400 truncate">Connected</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}