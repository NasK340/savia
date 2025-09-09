import OpenAI from 'openai';
import { supabase } from './supabase';

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Note: En production, ceci devrait être côté serveur
});

export interface AIAnalysis {
  category: string;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  sentiment: 'positive' | 'neutral' | 'negative';
  confidence: number;
  suggestedResponse?: string;
  requiresHuman: boolean;
  extractedInfo: {
    orderNumber?: string;
    customerName?: string;
    issueType?: string;
  };
}

export class AIService {
  static async analyzeEmail(emailContent: string, businessInfo?: any): Promise<AIAnalysis> {
    try {
      const prompt = this.buildAnalysisPrompt(emailContent, businessInfo);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: "Tu es un assistant IA spécialisé dans l'analyse d'emails de service client e-commerce. Tu dois analyser les emails et fournir une réponse structurée en JSON."
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.3,
        max_tokens: 1000,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Pas de réponse de l\'IA');
      }

      // Parser la réponse JSON
      const analysis = JSON.parse(response);
      
      return {
        category: analysis.category || 'other',
        priority: analysis.priority || 'medium',
        sentiment: analysis.sentiment || 'neutral',
        confidence: analysis.confidence || 0.5,
        suggestedResponse: analysis.suggestedResponse,
        requiresHuman: analysis.requiresHuman || false,
        extractedInfo: analysis.extractedInfo || {},
      };
    } catch (error) {
      console.error('Erreur lors de l\'analyse IA:', error);
      
      // Fallback en cas d'erreur
      return {
        category: 'other',
        priority: 'medium',
        sentiment: 'neutral',
        confidence: 0,
        requiresHuman: true,
        extractedInfo: {},
      };
    }
  }

  static async generateResponse(
    emailContent: string, 
    analysis: AIAnalysis, 
    businessInfo?: any,
    customerHistory?: any[]
  ): Promise<{ response: string; confidence: number }> {
    try {
      const prompt = this.buildResponsePrompt(emailContent, analysis, businessInfo, customerHistory);
      
      const completion = await openai.chat.completions.create({
        model: "gpt-4",
        messages: [
          {
            role: "system",
            content: this.getSystemPrompt(businessInfo)
          },
          {
            role: "user",
            content: prompt
          }
        ],
        temperature: 0.7,
        max_tokens: 500,
      });

      const response = completion.choices[0]?.message?.content;
      if (!response) {
        throw new Error('Pas de réponse générée');
      }

      // Calculer la confiance basée sur l'analyse
      const confidence = this.calculateConfidence(analysis, response);

      return {
        response: response.trim(),
        confidence,
      };
    } catch (error) {
      console.error('Erreur lors de la génération de réponse:', error);
      throw error;
    }
  }

  private static buildAnalysisPrompt(emailContent: string, businessInfo?: any): string {
    return `
Analyse cet email de service client et retourne un JSON avec la structure suivante :

{
  "category": "delivery|return|exchange|order|complaint|other",
  "priority": "low|medium|high|urgent",
  "sentiment": "positive|neutral|negative",
  "confidence": 0.0-1.0,
  "requiresHuman": boolean,
  "extractedInfo": {
    "orderNumber": "string ou null",
    "customerName": "string ou null",
    "issueType": "string ou null"
  },
  "suggestedResponse": "string ou null"
}

Email à analyser :
${emailContent}

${businessInfo ? `
Contexte de la boutique :
- Nom: ${businessInfo.shopName}
- Secteur: ${businessInfo.sector}
- Politique de retour: ${businessInfo.returnPolicy}
- Politique de livraison: ${businessInfo.shippingPolicy}
` : ''}

Critères pour requiresHuman = true :
- Réclamations graves ou menaces légales
- Demandes de remboursement > 100€
- Problèmes techniques complexes
- Sentiment très négatif avec escalade
`;
  }

  private static buildResponsePrompt(
    emailContent: string, 
    analysis: AIAnalysis, 
    businessInfo?: any,
    customerHistory?: any[]
  ): string {
    return `
Génère une réponse professionnelle à cet email de service client.

Email original :
${emailContent}

Analyse :
- Catégorie: ${analysis.category}
- Priorité: ${analysis.priority}
- Sentiment: ${analysis.sentiment}

${businessInfo ? `
Informations boutique :
- Nom: ${businessInfo.shopName}
- Ton préféré: ${businessInfo.tonePreference}
- Politique de retour: ${businessInfo.returnPolicy}
- Politique de livraison: ${businessInfo.shippingPolicy}
` : ''}

${customerHistory?.length ? `
Historique client (derniers tickets) :
${customerHistory.map(h => `- ${h.subject}: ${h.status}`).join('\n')}
` : ''}

Instructions :
1. Utilise un ton ${businessInfo?.tonePreference || 'amical'}
2. Sois précis et utile
3. Inclus les informations pertinentes (délais, procédures)
4. Termine par une formule de politesse
5. Maximum 200 mots
`;
  }

  private static getSystemPrompt(businessInfo?: any): string {
    const tone = businessInfo?.tonePreference || 'friendly';
    const shopName = businessInfo?.shopName || 'notre équipe';

    return `
Tu es un assistant de service client pour ${shopName}. 

Ton de communication : ${tone === 'formal' ? 'formel et professionnel' : tone === 'friendly' ? 'amical et chaleureux' : 'neutre et factuel'}

Règles importantes :
1. Toujours commencer par "Bonjour [Nom]" si le nom est connu
2. Être empathique et compréhensif
3. Donner des informations précises et actionables
4. Proposer des solutions concrètes
5. Terminer par une signature appropriée
6. Ne jamais promettre ce qui ne peut pas être tenu
7. Rediriger vers un humain si nécessaire

Signature : "Cordialement,\nL'équipe SAV ${shopName}"
`;
  }

  private static calculateConfidence(analysis: AIAnalysis, response: string): number {
    let confidence = analysis.confidence;

    // Réduire la confiance si la réponse est trop courte ou générique
    if (response.length < 50) confidence *= 0.7;
    if (response.includes('je ne peux pas') || response.includes('contactez')) confidence *= 0.8;
    
    // Augmenter la confiance pour les catégories bien définies
    if (['delivery', 'return', 'order'].includes(analysis.category)) confidence *= 1.1;
    
    // Réduire pour les sentiments négatifs
    if (analysis.sentiment === 'negative') confidence *= 0.9;

    return Math.min(Math.max(confidence, 0), 1);
  }

  static async processTicketWithAI(ticketId: string, userId: string) {
    try {
      // 1. Récupérer le ticket
      const { data: ticket, error: ticketError } = await supabase
        .from('tickets')
        .select('*')
        .eq('id', ticketId)
        .single();

      if (ticketError) throw ticketError;

      // 2. Récupérer les infos business
      const { data: businessInfo } = await supabase
        .from('business_info')
        .select('*')
        .eq('user_id', userId)
        .single();

      // 3. Analyser avec l'IA
      const analysis = await this.analyzeEmail(ticket.content, businessInfo);

      // 4. Si l'IA peut traiter, générer une réponse
      if (!analysis.requiresHuman && analysis.confidence > 0.7) {
        const { response, confidence } = await this.generateResponse(
          ticket.content,
          analysis,
          businessInfo
        );

        // 5. Sauvegarder la réponse
        await supabase.from('ticket_responses').insert({
          ticket_id: ticketId,
          content: response,
          is_ai: true,
          sender: 'ai',
        });

        // 6. Mettre à jour le ticket
        await supabase
          .from('tickets')
          .update({
            status: 'pending',
            ai_handled: true,
            ai_confidence: confidence,
            tag: analysis.category,
            priority: analysis.priority,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ticketId);

        return { success: true, aiHandled: true, response, confidence };
      } else {
        // 7. Marquer pour traitement humain
        await supabase
          .from('tickets')
          .update({
            ai_handled: false,
            ai_confidence: analysis.confidence,
            tag: analysis.category,
            priority: analysis.priority,
            updated_at: new Date().toISOString(),
          })
          .eq('id', ticketId);

        return { success: true, aiHandled: false, reason: 'Requires human intervention' };
      }
    } catch (error) {
      console.error('Erreur lors du traitement IA:', error);
      throw error;
    }
  }
}