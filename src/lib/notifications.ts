import { supabase } from './supabase';

export interface Notification {
  id: string;
  userId: string;
  type: 'new_ticket' | 'ai_response' | 'urgent_ticket' | 'integration_error';
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  data?: any;
}

export class NotificationService {
  private static listeners: Map<string, (notification: Notification) => void> = new Map();

  static async createNotification(userId: string, notification: {
    type: Notification['type'];
    title: string;
    message: string;
    data?: any;
  }) {
    try {
      const { data, error } = await supabase
        .from('notifications')
        .insert({
          user_id: userId,
          type: notification.type,
          title: notification.title,
          message: notification.message,
          data: notification.data,
          read: false,
        })
        .select()
        .single();

      if (error) throw error;

      // Notifier les listeners
      const listener = this.listeners.get(userId);
      if (listener) {
        listener(this.mapToNotification(data));
      }

      return this.mapToNotification(data);
    } catch (error) {
      console.error('Erreur lors de la création de notification:', error);
      throw error;
    }
  }

  static async getNotifications(userId: string, unreadOnly = false) {
    try {
      let query = supabase
        .from('notifications')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      if (unreadOnly) {
        query = query.eq('read', false);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(this.mapToNotification);
    } catch (error) {
      console.error('Erreur lors de la récupération des notifications:', error);
      throw error;
    }
  }

  static async markAsRead(notificationId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('id', notificationId);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors du marquage comme lu:', error);
      throw error;
    }
  }

  static async markAllAsRead(userId: string) {
    try {
      const { error } = await supabase
        .from('notifications')
        .update({ read: true })
        .eq('user_id', userId)
        .eq('read', false);

      if (error) throw error;
    } catch (error) {
      console.error('Erreur lors du marquage de toutes comme lues:', error);
      throw error;
    }
  }

  static subscribe(userId: string, callback: (notification: Notification) => void) {
    this.listeners.set(userId, callback);

    // Écouter les changements en temps réel
    const subscription = supabase
      .channel('notifications')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'notifications',
          filter: `user_id=eq.${userId}`,
        },
        (payload) => {
          callback(this.mapToNotification(payload.new));
        }
      )
      .subscribe();

    return () => {
      this.listeners.delete(userId);
      subscription.unsubscribe();
    };
  }

  static async notifyNewTicket(userId: string, ticketData: any) {
    await this.createNotification(userId, {
      type: 'new_ticket',
      title: 'Nouveau ticket reçu',
      message: `Nouveau ticket de ${ticketData.customerName}: ${ticketData.subject}`,
      data: { ticketId: ticketData.id },
    });
  }

  static async notifyAIResponse(userId: string, ticketData: any, confidence: number) {
    await this.createNotification(userId, {
      type: 'ai_response',
      title: 'Réponse IA générée',
      message: `L'IA a répondu au ticket "${ticketData.subject}" (confiance: ${Math.round(confidence * 100)}%)`,
      data: { ticketId: ticketData.id, confidence },
    });
  }

  static async notifyUrgentTicket(userId: string, ticketData: any) {
    await this.createNotification(userId, {
      type: 'urgent_ticket',
      title: 'Ticket urgent détecté',
      message: `Ticket urgent nécessitant une attention immédiate: ${ticketData.subject}`,
      data: { ticketId: ticketData.id },
    });
  }

  static async notifyIntegrationError(userId: string, integrationType: string, error: string) {
    await this.createNotification(userId, {
      type: 'integration_error',
      title: 'Erreur d\'intégration',
      message: `Problème avec l'intégration ${integrationType}: ${error}`,
      data: { integrationType, error },
    });
  }

  private static mapToNotification(dbNotification: any): Notification {
    return {
      id: dbNotification.id,
      userId: dbNotification.user_id,
      type: dbNotification.type,
      title: dbNotification.title,
      message: dbNotification.message,
      read: dbNotification.read,
      createdAt: new Date(dbNotification.created_at),
      data: dbNotification.data,
    };
  }
}