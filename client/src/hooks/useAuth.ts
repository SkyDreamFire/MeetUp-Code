import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';
import { AuthState } from '../types';

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
  });

  // Écoute les changements de session Supabase
  useEffect(() => {
    const getUser = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      const user = session?.user;

      if (user) {
        setAuthState({
          user: {
            id: user.id,
            name: user.user_metadata.full_name || 'Utilisateur',
            email: user.email!,
            photos: [],
            isPremium: false,
           lastActive:0,

            isOnline: true,
            bio: '',
            age: 0,
            location: '',
            interests: [],
            lookingFor: '',
            gender: '',
            occupation: '',
            education: '',
          },
          isAuthenticated: true,
          isLoading: false,
        });
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    };

    getUser();

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) {
        getUser();
      } else {
        setAuthState({
          user: null,
          isAuthenticated: false,
          isLoading: false,
        });
      }
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  // Connexion par email/mot de passe
  const login = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) throw error;
    return data;
  };

  // Déconnexion réelle Supabase
  const logout = async () => {
    await supabase.auth.signOut();
    setAuthState({
      user: null,
      isAuthenticated: false,
      isLoading: false,
    });
  };

  // Inscription
  const register = async (email: string, password: string) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
    });

    if (error) throw error;
    return data;
  };

  return {
    ...authState,
    login,
    logout,
    register,
  };
};
