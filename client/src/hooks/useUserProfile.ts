// 📁 src/hooks/useUserProfile.ts
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabaseClient';

export interface Photo {
  photo_id: string;
  url_photo: string;
  est_principale: boolean;
}

export interface Preference {
  genre_prefere: string;
  age_min: number;
  age_max: number;
  recherche: string;
  pays_recherche: string;
  but_recherche: string;
}

export interface Interet {
  nom: string;
}

export interface StyleDeVie {
  boire?: string;
  fumer?: string;
  statut_emploi?: string;
  profession?: string;
  revenu_annuel?: string;
  veut_enfants?: string;
}

export interface Apparence {
  couleur_cheveux?: string;
  couleur_yeux?: string;
  poids?: string;
  hauteur?: string;
  origine_ethnique?: string;
}

export interface ValeursCulturelles {
  nationalite?: string;
  langues_parlees?: string;
  religion?: string;
  niveau_francais?: string;
  niveau_anglais?: string;
}

export interface ProfilComplet {
  utilisateur_id: string;
  nom: string;
  prenom: string;
  email: string;
  date_naissance: string;
  genre: string;
  biographie?: string;
  ville?: string;
  pays?: string;
  profession?: string;
  education?: string;
  est_verifie?: boolean;
  est_en_ligne?: boolean;
  derniere_connexion?: string;
  photos?: Photo[];
  preferences?: Preference;
  interets_utilisateur?: { interets: Interet }[];
  style_de_vie?: StyleDeVie;
  valeurs_culturelles?: ValeursCulturelles;
  apparence?: Apparence;
}

export function useUserProfile() {
  const [profile, setProfile] = useState<ProfilComplet | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      const user = (await supabase.auth.getUser()).data.user;
      if (!user) {
        setError("Aucun utilisateur connecté");
        setLoading(false);
        return;
      }

      const { data, error } = await supabase
        .from('utilisateurs')
        .select(`
          *,
          preferences(*),
          photos(*),
          interets_utilisateur(interets(*)),
          style_de_vie(*),
          valeurs_culturelles(*),
          apparence(*)
        `)
        .eq('utilisateur_id', user.id)
        .single();

      if (error) {
        setError(error.message);
        setProfile(null);
      } else {
        setProfile(data);
        setError(null);
      }
      setLoading(false);
    };

    fetchProfile();
  }, []);

  return { profile, loading, error };
}
