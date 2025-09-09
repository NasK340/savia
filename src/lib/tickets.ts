import { supabase } from './supabase';
import { Ticket, TicketResponse } from '../types';

export class TicketService {
  static async createTicket(userId: string, ticketData: {
    customerEmail: string;
    customerName: string;
    subject: string;
    content: string;
    tag?: string;
    priority?: string;
    orderNumber?: string;
  }) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .insert({
          user_id: userId,
          customer_email: ticketData.customerEmail,
          customer_name: ticketData.customerName,
          subject: ticketData.subject,
          content: ticketData.content,
          tag: ticketData.tag as any || 'other',
          priority: ticketData.priority as any || 'medium',
          order_number: ticketData.orderNumber,
          status: 'open',
          ai_handled: false,
        })
        .select()
        .single();

      if (error) throw error;

      return this.mapToTicket(data);
    } catch (error) {
      console.error('Erreur lors de la création du ticket:', error);
      throw error;
    }
  }

  static async getTickets(userId: string, filters?: {
    status?: string;
    priority?: string;
    tag?: string;
    search?: string;
  }) {
    try {
      let query = supabase
        .from('tickets')
        .select(`
          *,
          ticket_responses(*)
        `)
        .eq('user_id', userId)
        .order('created_at', { ascending: false });

      // Appliquer les filtres
      if (filters?.status && filters.status !== 'all') {
        query = query.eq('status', filters.status);
      }
      if (filters?.priority && filters.priority !== 'all') {
        query = query.eq('priority', filters.priority);
      }
      if (filters?.tag && filters.tag !== 'all') {
        query = query.eq('tag', filters.tag);
      }
      if (filters?.search) {
        query = query.or(`subject.ilike.%${filters.search}%,customer_name.ilike.%${filters.search}%,customer_email.ilike.%${filters.search}%`);
      }

      const { data, error } = await query;

      if (error) throw error;

      return data.map(this.mapToTicket);
    } catch (error) {
      console.error('Erreur lors de la récupération des tickets:', error);
      throw error;
    }
  }

  static async getTicket(ticketId: string) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .select(`
          *,
          ticket_responses(*)
        `)
        .eq('id', ticketId)
        .single();

      if (error) throw error;

      return this.mapToTicket(data);
    } catch (error) {
      console.error('Erreur lors de la récupération du ticket:', error);
      throw error;
    }
  }

  static async updateTicket(ticketId: string, updates: {
    status?: string;
    priority?: string;
    tag?: string;
    aiHandled?: boolean;
    aiConfidence?: number;
  }) {
    try {
      const { data, error } = await supabase
        .from('tickets')
        .update({
          ...updates,
          ai_handled: updates.aiHandled,
          ai_confidence: updates.aiConfidence,
          updated_at: new Date().toISOString(),
        })
        .eq('id', ticketId)
        .select()
        .single();

      if (error) throw error;

      return this.mapToTicket(data);
    } catch (error) {
      console.error('Erreur lors de la mise à jour du ticket:', error);
      throw error;
    }
  }

  static async deleteTicket(ticketId: string) {
    try {
      // Supprimer d'abord les réponses
      await supabase
        .from('ticket_responses')
        .delete()
        .eq('ticket_id', ticketId);

      // Puis supprimer le ticket
      const { error } = await supabase
        .from('tickets')
        .delete()
        .eq('id', ticketId);

      if (error) throw error;

      return true;
    } catch (error) {
      console.error('Erreur lors de la suppression du ticket:', error);
      throw error;
    }
  }

  static async addResponse(ticketId: string, responseData: {
    content: string;
    isAI: boolean;
    sender: 'customer' | 'agent' | 'ai';
  }) {
    try {
      const { data, error } = await supabase
        .from('ticket_responses')
        .insert({
          ticket_id: ticketId,
          content: responseData.content,
          is_ai: responseData.isAI,
          sender: responseData.sender,
        })
        .select()
        .single();

      if (error) throw error;

      return data;
    } catch (error) {
      console.error('Erreur lors de l\'ajout de la réponse:', error);
      throw error;
    }
  }

  static async getTicketStats(userId: string) {
    try {
      const { data: tickets, error } = await supabase
        .from('tickets')
        .select('status, ai_handled, priority, created_at')
        .eq('user_id', userId);

      if (error) throw error;

      const stats = {
        total: tickets.length,
        open: tickets.filter(t => t.status === 'open').length,
        pending: tickets.filter(t => t.status === 'pending').length,
        resolved: tickets.filter(t => t.status === 'resolved').length,
        aiHandled: tickets.filter(t => t.ai_handled).length,
        urgent: tickets.filter(t => t.priority === 'urgent').length,
      };

      return stats;
    } catch (error) {
      console.error('Erreur lors de la récupération des statistiques:', error);
      throw error;
    }
  }

  private static mapToTicket(dbTicket: any): Ticket {
    return {
      id: dbTicket.id,
      customerEmail: dbTicket.customer_email,
      customerName: dbTicket.customer_name,
      subject: dbTicket.subject,
      content: dbTicket.content,
      tag: dbTicket.tag,
      status: dbTicket.status,
      priority: dbTicket.priority,
      orderNumber: dbTicket.order_number,
      aiHandled: dbTicket.ai_handled,
      createdAt: new Date(dbTicket.created_at),
      updatedAt: new Date(dbTicket.updated_at),
      responses: dbTicket.ticket_responses?.map((response: any) => ({
        id: response.id,
        content: response.content,
        isAI: response.is_ai,
        timestamp: new Date(response.created_at),
        sender: response.sender,
      })) || [],
    };
  }
}