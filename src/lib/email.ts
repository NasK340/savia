import { supabase } from './supabase';
import { TicketService } from './tickets';
import { AIService } from './ai';

export interface EmailMessage {
  id: string;
  from: string;
  to: string;
  subject: string;
  body: string;
  receivedAt: Date;
  messageId: string;
}

export class EmailService {
  private static readonly GMAIL_SCOPES = [
    'https://www.googleapis.com/auth/gmail.readonly',
    'https://www.googleapis.com/auth/gmail.send',
  ];

  static async connectGmail(userId: string): Promise<string> {
    try {
      const clientId = import.meta.env.VITE_GMAIL_CLIENT_ID;
      if (!clientId) {
        throw new Error('Gmail Client ID non configuré');
      }

      // Construire l'URL d'autorisation OAuth2
      const params = new URLSearchParams({
        client_id: clientId,
        redirect_uri: `${window.location.origin}/auth/gmail/callback`,
        response_type: 'code',
        scope: this.GMAIL_SCOPES.join(' '),
        access_type: 'offline',
        prompt: 'consent',
        state: userId, // Pour identifier l'utilisateur au retour
      });

      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?${params.toString()}`;
      
      // Ouvrir dans une nouvelle fenêtre
      const popup = window.open(authUrl, 'gmail-auth', 'width=500,height=600');
      
      return new Promise((resolve, reject) => {
        const checkClosed = setInterval(() => {
          if (popup?.closed) {
            clearInterval(checkClosed);
            // Vérifier si la connexion a réussi
            this.checkGmailConnection(userId).then(connected => {
              if (connected) {
                resolve('Connexion Gmail réussie');
              } else {
                reject(new Error('Connexion Gmail annulée'));
              }
            });
          }
        }, 1000);
      });
    } catch (error) {
      console.error('Erreur lors de la connexion Gmail:', error);
      throw error;
    }
  }

  static async handleGmailCallback(code: string, userId: string) {
    try {
      // Échanger le code contre un token d'accès
      const response = await fetch('/api/auth/gmail/token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ code, userId }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'échange du token');
      }

      const { access_token, refresh_token } = await response.json();

      // Sauvegarder les tokens
      await supabase
        .from('integrations')
        .upsert({
          user_id: userId,
          type: 'email',
          connected: true,
          access_token,
          refresh_token,
          status: 'connected',
          last_sync: new Date().toISOString(),
        });

      return true;
    } catch (error) {
      console.error('Erreur lors du callback Gmail:', error);
      throw error;
    }
  }

  static async checkGmailConnection(userId: string): Promise<boolean> {
    try {
      const { data, error } = await supabase
        .from('integrations')
        .select('connected, access_token')
        .eq('user_id', userId)
        .eq('type', 'email')
        .single();

      if (error) return false;

      return data.connected && !!data.access_token;
    } catch (error) {
      console.error('Erreur lors de la vérification de connexion Gmail:', error);
      return false;
    }
  }

  static async syncEmails(userId: string): Promise<EmailMessage[]> {
    try {
      // Récupérer les tokens d'accès
      const { data: integration, error } = await supabase
        .from('integrations')
        .select('access_token, refresh_token')
        .eq('user_id', userId)
        .eq('type', 'email')
        .single();

      if (error || !integration.access_token) {
        throw new Error('Pas de token d\'accès Gmail');
      }

      // Appeler l'API Gmail
      const response = await fetch('/api/gmail/messages', {
        headers: {
          'Authorization': `Bearer ${integration.access_token}`,
          'X-User-ID': userId,
        },
      });

      if (!response.ok) {
        throw new Error('Erreur lors de la récupération des emails');
      }

      const emails: EmailMessage[] = await response.json();

      // Traiter chaque nouvel email
      for (const email of emails) {
        await this.processIncomingEmail(email, userId);
      }

      // Mettre à jour la date de dernière sync
      await supabase
        .from('integrations')
        .update({ last_sync: new Date().toISOString() })
        .eq('user_id', userId)
        .eq('type', 'email');

      return emails;
    } catch (error) {
      console.error('Erreur lors de la synchronisation des emails:', error);
      throw error;
    }
  }

  static async processIncomingEmail(email: EmailMessage, userId: string) {
    try {
      // Vérifier si ce ticket existe déjà
      const { data: existingTicket } = await supabase
        .from('tickets')
        .select('id')
        .eq('user_id', userId)
        .eq('subject', email.subject)
        .eq('customer_email', email.from)
        .single();

      if (existingTicket) {
        // Ajouter comme réponse au ticket existant
        await supabase.from('ticket_responses').insert({
          ticket_id: existingTicket.id,
          content: email.body,
          is_ai: false,
          sender: 'customer',
        });
        return;
      }

      // Extraire le nom du client depuis l'email
      const customerName = this.extractCustomerName(email.from);

      // Créer un nouveau ticket
      const ticket = await TicketService.createTicket(userId, {
        customerEmail: email.from,
        customerName,
        subject: email.subject,
        content: email.body,
      });

      // Traiter avec l'IA
      await AIService.processTicketWithAI(ticket.id, userId);

    } catch (error) {
      console.error('Erreur lors du traitement de l\'email:', error);
    }
  }

  static async sendEmail(userId: string, to: string, subject: string, body: string) {
    try {
      const { data: integration, error } = await supabase
        .from('integrations')
        .select('access_token')
        .eq('user_id', userId)
        .eq('type', 'email')
        .single();

      if (error || !integration.access_token) {
        throw new Error('Pas de token d\'accès Gmail');
      }

      const response = await fetch('/api/gmail/send', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${integration.access_token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          body,
        }),
      });

      if (!response.ok) {
        throw new Error('Erreur lors de l\'envoi de l\'email');
      }

      return await response.json();
    } catch (error) {
      console.error('Erreur lors de l\'envoi de l\'email:', error);
      throw error;
    }
  }

  private static extractCustomerName(email: string): string {
    // Extraire le nom depuis l'adresse email
    // Ex: "John Doe <john@example.com>" -> "John Doe"
    const match = email.match(/^(.+?)\s*<.+>$/);
    if (match) {
      return match[1].trim();
    }
    
    // Si pas de nom, utiliser la partie avant @
    const username = email.split('@')[0];
    return username.replace(/[._-]/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  }

  static async startEmailSync(userId: string) {
    // Démarrer la synchronisation périodique des emails
    const syncInterval = setInterval(async () => {
      try {
        await this.syncEmails(userId);
      } catch (error) {
        console.error('Erreur lors de la sync automatique:', error);
      }
    }, 30000); // Sync toutes les 30 secondes

    return syncInterval;
  }
}