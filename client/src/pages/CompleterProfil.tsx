import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Briefcase, GraduationCap, MapPin, User, Calendar, Lock, CheckCircle, AlertCircle
} from 'lucide-react';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../contexts/AuthContext';

const CompleterProfil: React.FC = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    dateOfBirth: '',
    profession: '',
    education: '',
    localisation: '',
    password: '',
  });

  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    if (!user) return;

    const fetchProfil = async () => {
      const { data, error } = await supabase
        .from('utilisateurs')
        .select('prenom, nom, date_naissance, profession, education, localisation')
        .eq('utilisateur_id', user.id)
        .single();

      if (data) {
        setFormData((prev) => ({
          ...prev,
          firstName: data.prenom || '',
          lastName: data.nom || '',
          dateOfBirth: data.date_naissance || '',
          profession: data.profession || '',
          education: data.education || '',
          localisation: data.localisation || '',
        }));
      }
    };

    fetchProfil();
  }, [user]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    setLoading(true);
    setMessage(null);

    // Met à jour le profil
    const { error: updateError } = await supabase
      .from('utilisateurs')
      .update({
        prenom: formData.firstName,
        nom: formData.lastName,
        date_naissance: formData.dateOfBirth,
        profession: formData.profession,
        education: formData.education,
        localisation: formData.localisation,
      })
      .eq('utilisateur_id', user.id);

    // Mot de passe (optionnel pour Google, obligatoire s'il est vide)
    if (formData.password) {
      const { error: pwdError } = await supabase.auth.updateUser({ password: formData.password });
      if (pwdError) {
        setMessage({ type: 'error', text: pwdError.message });
        setLoading(false);
        return;
      }
    }

    if (updateError) {
      setMessage({ type: 'error', text: updateError.message });
    } else {
      setMessage({ type: 'success', text: 'Profil mis à jour avec succès !' });
      setTimeout(() => {
        navigate('/dashboard');
      }, 1500);
    }

    setLoading(false);
  };

  return (
    <div className="max-w-xl mx-auto mt-10 p-6 bg-white rounded-2xl shadow">
      <h2 className="text-2xl font-bold text-center mb-4">Compléter mon profil</h2>
      <form onSubmit={handleSubmit} className="space-y-4">

        <InputField icon={User} label="Prénom" name="firstName" value={formData.firstName} onChange={handleChange} />
        <InputField icon={User} label="Nom" name="lastName" value={formData.lastName} onChange={handleChange} />
        <InputField icon={Calendar} label="Date de naissance" name="dateOfBirth" type="date" value={formData.dateOfBirth} onChange={handleChange} />
        <InputField icon={Briefcase} label="Profession" name="profession" value={formData.profession} onChange={handleChange} />
        <InputField icon={GraduationCap} label="Éducation" name="education" value={formData.education} onChange={handleChange} />
        <InputField icon={MapPin} label="Localisation" name="localisation" value={formData.localisation} onChange={handleChange} />
        <InputField icon={Lock} label="Mot de passe" name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Changer ou définir un mot de passe" />

        {message && (
          <div className={`flex items-center gap-2 text-sm px-3 py-2 rounded-xl ${message.type === 'success' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
            {message.type === 'success' ? <CheckCircle className="w-4 h-4" /> : <AlertCircle className="w-4 h-4" />}
            {message.text}
          </div>
        )}

        <button
          type="submit"
          disabled={loading}
          className="w-full bg-blue-600 text-white font-medium py-2 rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'Enregistrement...' : 'Enregistrer et continuer'}
        </button>
      </form>
    </div>
  );
};

interface InputFieldProps {
  icon: React.ElementType;
  label: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  placeholder?: string;
}

const InputField: React.FC<InputFieldProps> = ({ icon: Icon, label, name, value, onChange, type = 'text', placeholder }) => (
  <div>
    <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
      <Icon className="w-4 h-4" /> {label}
    </label>
    <input
      type={type}
      name={name}
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      className="w-full mt-1 border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
    />
  </div>
);

export default CompleterProfil;
