import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { Session, User } from '@supabase/supabase-js';
import { supabase } from '../lib/supabaseClient';

interface Address {
  street?: string;
  city?: string;
  postalCode?: string;
}

type Gender = 'male' | 'female';

export interface RegisterData {
  email: string;
  password: string;
  confirmPassword: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: Gender;
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
  styleDeVie?: {
    fumer?: string;
    boire?: string;
  };
  apparence?: {
    couleur_cheveux?: string;
    couleur_yeux?: string;
    taille?: number;
    poids?: number;
  };
  preferences?: {
    genre_prefere?: string;
    age_min?: number;
    age_max?: number;
    pays_recherche?: string;
    but_recherche?: string;
  };
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>;
  register: (data: RegisterData) => Promise<{ success: boolean; message?: string }>;
  signInWithGoogle: () => Promise<{ success: boolean; message?: string }>;
  logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { data } = await supabase.auth.getSession();
      setUser(data.session?.user ?? null);
      setLoading(false);
    })();

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        setUser(session?.user ?? null);
        setLoading(false);
        if (session?.user) await ensureUserRecord(session.user);
      }
    );

    return () => {
      listener.subscription.unsubscribe();
    };
  }, []);

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    return error ? { success: false, message: error.message } : { success: true };
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
    const now = new Date().toISOString();

    const { error: insertUserError } = await supabase.from('utilisateurs').insert([{
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
      est_verifie: true,
      est_en_ligne: true,
      derniere_connexion: now,
      cree_le: now,
      mis_a_jour_le: now,
      user_id: utilisateur_id,
    }]);

    if (insertUserError) return { success: false, message: insertUserError.message };

    await supabase.from('preferences').upsert([{
      utilisateur_id,
      genre_prefere: data.preferences?.genre_prefere ?? 'peu_importe',
      age_min: data.preferences?.age_min ?? 18,
      age_max: data.preferences?.age_max ?? 99,
      recherche: 'rencontre',
      pays_recherche: data.preferences?.pays_recherche ?? data.country,
      but_recherche: data.preferences?.but_recherche ?? 'amitie',
    }], { onConflict: 'utilisateur_id' });

    await supabase.from('photos').insert([{
      utilisateur_id,
      url_photo: data.photoUrl || 'https://via.placeholder.com/150',
      est_principale: true,
    }]);

    if (data.interests?.length) {
      for (const nomInteret of data.interests) {
        const { data: existingInteret } = await supabase
          .from('interets')
          .select('interet_id')
          .eq('nom', nomInteret)
          .maybeSingle();

        let interetId: string;
        if (existingInteret) {
          interetId = existingInteret.interet_id;
        } else {
          const { data: newInteret } = await supabase
            .from('interets')
            .insert([{ nom: nomInteret }])
            .select()
            .single();
          interetId = newInteret!.interet_id;
        }

        await supabase.from('interets_utilisateur').insert([{ utilisateur_id, interet_id: interetId }]);
      }
    }

    await supabase.from('profil_apercu').upsert([{
      utilisateur_id,
      education: data.education,
      profession: data.profession,
    }], { onConflict: 'utilisateur_id' });

    await supabase.from('style_de_vie').upsert([{
      utilisateur_id,
      fumer: data.styleDeVie?.fumer ?? 'non spécifié',
      boire: data.styleDeVie?.boire ?? 'non spécifié',
    }], { onConflict: 'utilisateur_id' });

    await supabase.from('apparence').upsert([{
      utilisateur_id,
      couleur_cheveux: data.apparence?.couleur_cheveux ?? 'non spécifié',
      couleur_yeux: data.apparence?.couleur_yeux ?? 'non spécifié',
      taille: data.apparence?.taille ?? null,
      poids: data.apparence?.poids ?? null,
    }], { onConflict: 'utilisateur_id' });

    return {
      success: true,
      message: 'Compte et profil créés avec succès. Vérifiez votre boîte mail.',
    };
  };

  const signInWithGoogle = async () => {
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });
    return error ? { success: false, message: error.message } : { success: true };
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  const ensureUserRecord = async (supabaseUser: User) => {
    const { data: existing } = await supabase
      .from('utilisateurs')
      .select('utilisateur_id')
      .eq('utilisateur_id', supabaseUser.id)
      .maybeSingle();

    if (existing) return;

    const now = new Date().toISOString();

    await supabase.from('utilisateurs').insert([{
      utilisateur_id: supabaseUser.id,
      email: supabaseUser.email,
      nom: supabaseUser.user_metadata?.lastName ?? '',
      prenom: supabaseUser.user_metadata?.firstName ?? '',
      date_naissance: null,
      genre: 'homme',
      pays: supabaseUser.user_metadata?.country ?? '',
      est_verifie: true,
      est_en_ligne: true,
      derniere_connexion: now,
      cree_le: now,
      mis_a_jour_le: now,
      user_id: supabaseUser.id,
    }]);
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
