import React, { createContext, useContext, ReactNode, useEffect, useState } from 'react';
import { User, BusinessInfo, Ticket, Integration } from '../types';
import { AuthService, AuthUser } from '../lib/auth';
import { TicketService } from '../lib/tickets';
import { NotificationService, Notification } from '../lib/notifications';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';

interface AppContextType {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
  businessInfo: BusinessInfo | null;
  setBusinessInfo: (info: BusinessInfo) => void;
  tickets: Ticket[];
  setTickets: (tickets: Ticket[]) => void;
  integrations: Integration[];
  setIntegrations: (integrations: Integration[]) => void;
  currentView: string;
  setCurrentView: (view: string) => void;
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  // Actions
  signUp: (email: string, password: string, userData: { name: string; company: string }) => Promise<void>;
  signIn: (email: string, password: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshTickets: () => Promise<void>;
  markNotificationAsRead: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

// Comptes de démonstration par défaut
const DEFAULT_DEMO_ACCOUNTS = [
  {
    id: 'demo1',
    email: 'demo@livia.ai',
    password: 'demo123',
    name: 'Utilisateur Démo',
    company: 'Livia Demo',
    plan: 'starter',
    onboardingCompleted: true
  },
  {
    id: 'demo2',
    email: 'marie@boutique.com',
    password: 'marie123',
    name: 'Marie Dubois',
    company: 'Boutique Mode',
    plan: 'starter',
    onboardingCompleted: true
  },
  {
    id: 'demo3',
    email: 'pierre@techstore.com',
    password: 'pierre123',
    name: 'Pierre Martin',
    company: 'Tech Store',
    plan: 'starter',
    onboardingCompleted: true
  }
];

export function AppProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [businessInfo, setBusinessInfo] = useState<BusinessInfo | null>(null);
  const [tickets, setTickets] = useState<Ticket[]>([]);
  const [integrations, setIntegrations] = useState<Integration[]>([
    { type: 'email', connected: false, status: 'disconnected' },
    { type: 'shopify', connected: false, status: 'disconnected' }
  ]);
  const [currentView, setCurrentView] = useState('dashboard');
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(false);

  // Calculer le nombre de notifications non lues
  const unreadCount = notifications.filter(n => !n.read).length;

  // Initialiser les comptes de démonstration
  const initializeDemoAccounts = () => {
    const existingUsers = JSON.parse(localStorage.getItem('livia_users') || '[]');
    let hasChanges = false;

    DEFAULT_DEMO_ACCOUNTS.forEach(demoAccount => {
      const existingUser = existingUsers.find((u: any) => u.email === demoAccount.email);
      if (!existingUser) {
        existingUsers.push(demoAccount);
        hasChanges = true;

        // Créer les informations business par défaut pour ce compte
        const defaultBusinessInfo: BusinessInfo = {
          shopName: demoAccount.company,
          shopUrl: demoAccount.company === 'Boutique Mode' ? 'boutique-mode.com' : 
                   demoAccount.company === 'Tech Store' ? 'tech-store.com' : 'demo.livia.ai',
          sector: demoAccount.company === 'Boutique Mode' ? 'fashion' : 
                  demoAccount.company === 'Tech Store' ? 'electronics' : 'other',
          responseTimePreference: '24',
          returnPolicy: 'Retours acceptés sous 30 jours avec facture',
          shippingPolicy: 'Livraison gratuite dès 50€ d\'achat, sous 2-3 jours ouvrés',
          tonePreference: 'friendly'
        };
        localStorage.setItem(`livia_business_info_${demoAccount.id}`, JSON.stringify(defaultBusinessInfo));
      }
    });

    if (hasChanges) {
      localStorage.setItem('livia_users', JSON.stringify(existingUsers));
    }
  };

  // Vérifier si l'utilisateur est déjà connecté au chargement
  useEffect(() => {
    // Initialiser les comptes de démonstration
    initializeDemoAccounts();

    const checkExistingSession = () => {
      const savedUser = localStorage.getItem('livia_user');
      
      if (savedUser) {
        try {
          const parsedUser = JSON.parse(savedUser);
          setUser(parsedUser);
          
          // Récupérer les informations business pour cet utilisateur
          const savedBusinessInfo = localStorage.getItem(`livia_business_info_${parsedUser.id}`) || 
                                   localStorage.getItem('livia_business_info');
          
          if (savedBusinessInfo) {
            const parsedBusinessInfo = JSON.parse(savedBusinessInfo);
            setBusinessInfo(parsedBusinessInfo);
          }
        } catch (error) {
          console.error('Erreur lors de la récupération de la session:', error);
          localStorage.removeItem('livia_user');
          localStorage.removeItem('livia_business_info');
        }
      }
    };

    checkExistingSession();
  }, []);

  // Actions d'authentification
  const signUp = async (email: string, password: string, userData: { name: string; company: string }) => {
    try {
      setLoading(true);
      
      // Validation des données
      if (!email || !password || !userData.name || !userData.company) {
        throw new Error('Tous les champs sont requis');
      }

      if (password.length < 6) {
        throw new Error('Le mot de passe doit contenir au moins 6 caractères');
      }

      // Vérifier si l'email existe déjà
      const existingUsers = JSON.parse(localStorage.getItem('livia_users') || '[]');
      if (existingUsers.find((u: any) => u.email === email)) {
        throw new Error('Un compte avec cet email existe déjà');
      }
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Créer un utilisateur
      const newUser: AuthUser = {
        id: Date.now().toString(),
        email,
        name: userData.name,
        company: userData.company,
        plan: 'starter',
        onboardingCompleted: true
      };
      
      // Créer des informations business par défaut
      const defaultBusinessInfo: BusinessInfo = {
        shopName: userData.company,
        shopUrl: '',
        sector: 'other',
        responseTimePreference: '24',
        returnPolicy: '',
        shippingPolicy: '',
        tonePreference: 'friendly'
      };
      
      // Sauvegarder dans localStorage
      const users = JSON.parse(localStorage.getItem('livia_users') || '[]');
      const userWithPassword = { ...newUser, password };
      users.push(userWithPassword);
      localStorage.setItem('livia_users', JSON.stringify(users));
      localStorage.setItem('livia_user', JSON.stringify(newUser));
      localStorage.setItem(`livia_business_info_${newUser.id}`, JSON.stringify(defaultBusinessInfo));
      
      setUser(newUser);
      setBusinessInfo(defaultBusinessInfo);
      toast.success('Compte créé avec succès ! Bienvenue dans Livia 🎉');
      
    } catch (error: any) {
      console.error('Erreur lors de l\'inscription:', error);
      toast.error(error.message || 'Erreur lors de l\'inscription');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signIn = async (email: string, password: string) => {
    try {
      setLoading(true);
      
      // Validation des données
      if (!email || !password) {
        throw new Error('Email et mot de passe requis');
      }
      
      // Simulation d'un délai d'API
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      // Vérifier les identifiants
      const users = JSON.parse(localStorage.getItem('livia_users') || '[]');
      const foundUser = users.find((u: any) => u.email === email && u.password === password);
      
      if (!foundUser) {
        throw new Error('Email ou mot de passe incorrect');
      }
      
      // Créer l'objet utilisateur sans le mot de passe
      const loggedUser: AuthUser = {
        id: foundUser.id,
        email: foundUser.email,
        name: foundUser.name,
        company: foundUser.company,
        plan: foundUser.plan || 'starter',
        onboardingCompleted: foundUser.onboardingCompleted || true
      };
      
      // Récupérer les informations business pour cet utilisateur
      let businessInfo = null;
      const savedBusinessInfo = localStorage.getItem(`livia_business_info_${foundUser.id}`);
      
      if (savedBusinessInfo) {
        businessInfo = JSON.parse(savedBusinessInfo);
      } else {
        // Créer des informations business par défaut si elles n'existent pas
        businessInfo = {
          shopName: foundUser.company,
          shopUrl: foundUser.company === 'Boutique Mode' ? 'boutique-mode.com' : 
                   foundUser.company === 'Tech Store' ? 'tech-store.com' : 
                   foundUser.company === 'Livia Demo' ? 'demo.livia.ai' : '',
          sector: foundUser.company === 'Boutique Mode' ? 'fashion' : 
                  foundUser.company === 'Tech Store' ? 'electronics' : 'other',
          responseTimePreference: '24',
          returnPolicy: 'Retours acceptés sous 30 jours avec facture',
          shippingPolicy: 'Livraison gratuite dès 50€ d\'achat, sous 2-3 jours ouvrés',
          tonePreference: 'friendly'
        };
        localStorage.setItem(`livia_business_info_${foundUser.id}`, JSON.stringify(businessInfo));
      }
      
      // Sauvegarder la session
      localStorage.setItem('livia_user', JSON.stringify(loggedUser));
      
      setUser(loggedUser);
      setBusinessInfo(businessInfo);
      toast.success('Connexion réussie ! Redirection vers votre dashboard... 👋');
      
    } catch (error: any) {
      console.error('Erreur lors de la connexion:', error);
      toast.error(error.message || 'Erreur lors de la connexion');
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const signOut = async () => {
    try {
      // Nettoyer la session
      localStorage.removeItem('livia_user');
      
      setUser(null);
      setBusinessInfo(null);
      setTickets([]);
      setNotifications([]);
      setCurrentView('dashboard');
      toast.success('Déconnexion réussie');
      
      // Redirection vers la page d'accueil
      setTimeout(() => {
        window.location.href = '/';
      }, 500);
      
    } catch (error: any) {
      console.error('Erreur lors de la déconnexion:', error);
      toast.error('Erreur lors de la déconnexion');
    }
  };

  // Rafraîchir les tickets
  const refreshTickets = async () => {
    if (!user) return;
    
    try {
      // Simulation de données
      const mockTickets: Ticket[] = [
        {
          id: '1',
          customerEmail: 'marie@example.com',
          customerName: 'Marie Dubois',
          subject: 'Problème de livraison',
          content: 'Bonjour, je n\'ai pas reçu ma commande...',
          tag: 'delivery',
          status: 'open',
          priority: 'medium',
          createdAt: new Date(),
          updatedAt: new Date(),
          responses: [],
          aiHandled: false
        }
      ];
      setTickets(mockTickets);
    } catch (error) {
      console.error('Erreur lors du rafraîchissement des tickets:', error);
      toast.error('Erreur lors du rafraîchissement des tickets');
    }
  };

  // Marquer une notification comme lue
  const markNotificationAsRead = async (id: string) => {
    try {
      setNotifications(prev => 
        prev.map(n => n.id === id ? { ...n, read: true } : n)
      );
    } catch (error) {
      console.error('Erreur lors du marquage de la notification:', error);
    }
  };

  return (
    <AppContext.Provider value={{
      user,
      setUser,
      businessInfo,
      setBusinessInfo,
      tickets,
      setTickets,
      integrations,
      setIntegrations,
      currentView,
      setCurrentView,
      notifications,
      unreadCount,
      loading,
      signUp,
      signIn,
      signOut,
      refreshTickets,
      markNotificationAsRead,
    }}>
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}