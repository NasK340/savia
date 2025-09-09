export interface User {
  id: string;
  email: string;
  name: string;
  company: string;
  avatar?: string;
  plan: 'starter' | 'pro' | 'enterprise';
  onboardingCompleted: boolean;
}

export interface BusinessInfo {
  shopName: string;
  shopUrl: string;
  sector: string;
  responseTimePreference: string;
  returnPolicy: string;
  shippingPolicy: string;
  tonePreference: 'formal' | 'friendly' | 'neutral';
}

export interface Ticket {
  id: string;
  customerEmail: string;
  customerName: string;
  subject: string;
  content: string;
  tag: 'return' | 'exchange' | 'delivery' | 'order' | 'complaint' | 'other';
  status: 'open' | 'pending' | 'resolved' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  createdAt: Date;
  updatedAt: Date;
  responses: TicketResponse[];
  orderNumber?: string;
  aiHandled: boolean;
}

export interface TicketResponse {
  id: string;
  content: string;
  isAI: boolean;
  timestamp: Date;
  sender: 'customer' | 'agent' | 'ai';
}

export interface DashboardStats {
  totalTickets: number;
  resolvedTickets: number;
  pendingTickets: number;
  avgResponseTime: number;
  aiResponseRate: number;
  customerSatisfaction: number;
}

export interface Integration {
  type: 'email' | 'shopify';
  connected: boolean;
  lastSync?: Date;
  status: 'connected' | 'error' | 'disconnected';
}