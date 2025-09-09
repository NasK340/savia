import React, { useState } from 'react';
import { StatsCards } from './StatsCards';
import { RecentTickets } from './RecentTickets';
import { ActivityChart } from './ActivityChart';
import { QuickActions } from './QuickActions';
import { TopProblems } from './TopProblems';
import { AIPerformance } from './AIPerformance';
import { useApp } from '../../contexts/AppContext';

export function Dashboard() {
  const { user } = useApp();
  const [greeting] = useState(() => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Bonjour';
    if (hour < 18) return 'Bon après-midi';
    return 'Bonsoir';
  });

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-6 text-white animate-fade-in">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold mb-2">
              {greeting} {user?.name || 'Utilisateur'} 👋
            </h1>
            <p className="text-blue-100">
              12 tickets ont été traités automatiquement aujourd'hui
            </p>
          </div>
          <div className="text-right">
            <div className="text-3xl font-bold">92%</div>
            <div className="text-blue-100 text-sm">Automatisation IA</div>
          </div>
        </div>
      </div>

      <StatsCards />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <ActivityChart />
          <TopProblems />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <AIPerformance />
        </div>
      </div>

      <RecentTickets />
    </div>
  );
}