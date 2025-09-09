import React, { useState } from 'react';
import { Bell, X, CheckCircle, AlertTriangle, Info, Zap } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { useApp } from '../../contexts/AppContext';

export function NotificationCenter() {
  const { notifications, unreadCount, markNotificationAsRead } = useApp();
  const [isExpanded, setIsExpanded] = useState(false);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_ticket':
        return <Info className="text-blue-500" size={16} />;
      case 'ai_response':
        return <Zap className="text-purple-500" size={16} />;
      case 'urgent_ticket':
        return <AlertTriangle className="text-red-500" size={16} />;
      case 'integration_error':
        return <X className="text-red-500" size={16} />;
      default:
        return <Bell className="text-gray-500" size={16} />;
    }
  };

  const formatTime = (date: Date) => {
    const now = new Date();
    const diffInMinutes = Math.floor((now.getTime() - date.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'À l\'instant';
    if (diffInMinutes < 60) return `Il y a ${diffInMinutes}min`;
    if (diffInMinutes < 1440) return `Il y a ${Math.floor(diffInMinutes / 60)}h`;
    return `Il y a ${Math.floor(diffInMinutes / 1440)}j`;
  };

  const recentNotifications = notifications.slice(0, isExpanded ? 10 : 3);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-blue-500" />
            Notifications
            {unreadCount > 0 && (
              <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1 min-w-[20px] text-center">
                {unreadCount}
              </span>
            )}
          </CardTitle>
          {notifications.length > 3 && (
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsExpanded(!isExpanded)}
            >
              {isExpanded ? 'Réduire' : 'Voir tout'}
            </Button>
          )}
        </div>
      </CardHeader>
      <CardContent>
        {notifications.length === 0 ? (
          <div className="text-center py-8">
            <Bell className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500">Aucune notification</p>
          </div>
        ) : (
          <div className="space-y-3">
            {recentNotifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-3 rounded-lg border transition-all duration-200 hover:shadow-sm cursor-pointer ${
                  notification.read 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-blue-50 border-blue-200'
                }`}
                onClick={() => !notification.read && markNotificationAsRead(notification.id)}
              >
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-0.5">
                    {getNotificationIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1">
                      <h4 className={`text-sm font-medium ${
                        notification.read ? 'text-gray-700' : 'text-gray-900'
                      }`}>
                        {notification.title}
                      </h4>
                      {!notification.read && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full flex-shrink-0"></div>
                      )}
                    </div>
                    <p className={`text-xs ${
                      notification.read ? 'text-gray-500' : 'text-gray-600'
                    } line-clamp-2`}>
                      {notification.message}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatTime(notification.createdAt)}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {notifications.length > 0 && (
          <div className="mt-4 pt-3 border-t border-gray-100">
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => {
                // Marquer toutes comme lues
                notifications.forEach(n => {
                  if (!n.read) markNotificationAsRead(n.id);
                });
              }}
            >
              <CheckCircle size={16} className="mr-2" />
              Marquer tout comme lu
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
}