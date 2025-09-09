import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { useApp } from '../../contexts/AppContext';

interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps) {
  const { user } = useApp();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Vérifier l'authentification
    const checkAuth = () => {
      if (!user) {
        // Pas d'utilisateur connecté, rediriger vers la landing page
        navigate('/', { replace: true });
        return;
      }
      
      setIsLoading(false);
    };

    // Petit délai pour permettre au contexte de se charger
    const timer = setTimeout(checkAuth, 100);
    
    return () => clearTimeout(timer);
  }, [user, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 text-blue-500 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Vérification de l'authentification...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return null; // La redirection est gérée dans useEffect
  }

  return <>{children}</>;
}