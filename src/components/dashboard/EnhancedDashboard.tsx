import React, { useState, useEffect } from 'react';
import { StatsCards } from './StatsCards';
import { RecentTickets } from './RecentTickets';
import { ActivityChart } from './ActivityChart';
import { QuickActions } from './QuickActions';
import { TopProblems } from './TopProblems';
import { AIPerformance } from './AIPerformance';
import { NotificationCenter } from './NotificationCenter';
import { useApp } from '../../contexts/AppContext';
import { Bell, Zap, TrendingUp, Users } from 'lucide-react';

export function EnhancedDashboard() {
  const { user, notifications, unreadCount } = useApp();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  });

  const [realTimeStats, setRealTimeStats] = useState({
    todayTickets: 12,
    automationRate: 92,
    avgResponseTime: '2.4h',
    satisfactionScore: 4.8
  });

  // Simulation de mise à jour en temps réel
  useEffect(() => {
    const interval = setInterval(() => {
      setRealTimeStats(prev => ({
        ...prev,
        todayTickets: prev.todayTickets + Math.floor(Math.random() * 3),
        automationRate: Math.min(95, prev.automationRate + Math.random() * 2 - 1),
      }));
    }, 30000); // Mise à jour toutes les 30 secondes

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="space-y-6">
      {/* Enhanced Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="relative flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {greeting} {user?.name || 'Utilisateur'} 👋
            </h1>
            <p className="text-blue-100 mb-4">
              {realTimeStats.todayTickets} tickets ont été traités automatiquement aujourd'hui
            </p>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Zap size={16} />
                <span>IA active</span>
              </div>
              <div className="flex items-center gap-2">
                <TrendingUp size={16} />
                <span>Performance optimale</span>
              </div>
              <div className="flex items-center gap-2">
                <Users size={16} />
                <span>Clients satisfaits</span>
              </div>
            </div>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">{realTimeStats.automationRate}%</div>
            <div className="text-blue-100 text-sm">Automatisation IA</div>
            {unreadCount > 0 && (
              <div className="mt-2 flex items-center gap-2 bg-white/20 rounded-full px-3 py-1">
                <Bell size={16} />
                <span className="text-sm">{unreadCount} nouvelles notifications</span>
              </div>
            )}
          </div>
        </div>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3 space-y-6">
          <ActivityChart />
          <TopProblems />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <AIPerformance />
          <NotificationCenter />
        </div>
      </div>

      <RecentTickets />
    </div>
  );
}