// 📁 src/contexts/AuthContext.tsx
import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
}

interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: 'male' | 'female';
  country: string;
  city?: string;
  localisation?: string;
  latitude?: number;
  longitude?: number;
  profession?: string;
  education?: string;
  biography?: string;
  photoUrl?: string;
  address?: Address;
  acceptTerms: boolean;
  newsletter?: boolean;
  interests?: string[];
}

interface AuthContextType {
  user: any;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => {
      setUser(data.session?.user ?? null);
      setLoading(false);
    });

    const { data: listener } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
    });

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) return { success: false, message: error.message };
    return { success: true };
  };

  const register = async (data: RegisterData) => {
    if (data.password !== data.confirmPassword) {
      return { success: false, message: 'Les mots de passe ne correspondent pas.' };
    }

    const { data: signUpData, error } = await supabase.auth.signUp({
      email: data.email,
      password: data.password,
      options: {
        data: {
          firstName: data.firstName,
          lastName: data.lastName,
          gender: data.gender,
          country: data.country,
        },
      },
    });

    if (error || !signUpData.user) {
      return { success: false, message: error?.message || 'Erreur lors de la création du compte.' };
    }

    const utilisateur_id = signUpData.user.id;

    const { error: insertError } = await supabase.from('utilisateurs').insert([{
      utilisateur_id,
      email: data.email,
      nom: data.lastName,
      prenom: data.firstName,
      date_naissance: data.dateOfBirth,
      genre: data.gender === 'male' ? 'homme' : 'femme',
      pays: data.country,
      ville: data.city,
      localisation: data.localisation,
      latitude: data.latitude,
      longitude: data.longitude,
      profession: data.profession,
      education: data.education,
      biographie: data.biography,
      newsletter: data.newsletter,
      est_verifie: true,
      est_en_ligne: true,
      derniere_connexion: new Date().toISOString(),
    }]);

    if (insertError) {
      return { success: false, message: insertError.message };
    }

    await supabase.from('preferences').insert([{
      utilisateur_id,
      genre_prefere: 'peu_importe',
      age_min: 18,
      age_max: 99,
      recherche: 'rencontre',
      pays_recherche: data.country,
      but_recherche: 'amitie',
    }]);

    await supabase.from('photos').insert([{
      utilisateur_id,
      url_photo: data.photoUrl || 'https://via.placeholder.com/150',
      est_principale: true,
    }]);

    if (data.interests && data.interests.length > 0) {
      const interestsData = data.interests.map((interet) => ({
        utilisateur_id,
        nom_interet: interet,
      }));
      await supabase.from('interets_utilisateur').insert(interestsData);
    }

    if (data.address) {
      await supabase.from('adresses').insert([{
        utilisateur_id,
        rue: data.address.street,
        ville: data.address.city,
        code_postal: data.address.postalCode,
      }]);
    }

    return { success: true, message: 'Compte et profil créés avec succès.' };
  };

 const signInWithGoogle = async () => {
  const { error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${window.location.origin}/dashboard`, // ✅ redirection directe vers dashboard
    },
  });
  return error ? { success: false, message: error.message } : { success: true };
};


  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, signInWithGoogle, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error('useAuth must be used within an AuthProvider');
  return context;
};