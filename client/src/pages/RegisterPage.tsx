// ✅ Fichier : src/pages/RegisterPage.tsx

import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Mail, Lock, User, Calendar, Globe, Eye, EyeOff, AlertCircle, CheckCircle, ImageIcon
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabaseClient';

const RegisterPage: React.FC = () => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    email: '', password: '', confirmPassword: '',
    firstName: '', lastName: '', dateOfBirth: '', gender: '', country: '',
    job: '', city: '', educationLevel: '', avatarUrl: '',
    interests: [], bio: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState<{ [key: string]: string }>({});
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);

  const { register } = useAuth();
  const navigate = useNavigate();

  const interestsList = [
    "Musique", "Sport", "Voyage", "Cuisine", "Cinéma", "Lecture",
    "Art", "Technologie", "Mode", "Photographie", "Jeux vidéo", "Danse"
  ];

  const africanCountries = [
"Afghanistan", "Albania", "Algeria", "Andorra", "Angola", "Antigua and Barbuda", "Argentina", "Armenia", "Australia", "Austria", "Azerbaijan",
"Bahamas", "Bangladesh", "Barbados", "Belarus", "Belgium", "Belize", "Benin", "Bhutan", "Bolivia", "Bosnia and Herzegovina", "Botswana", "Brazil", "Brunei", "Bulgaria", "Burkina Faso", "Burundi",
"Cambodia", "Cameroon", "Canada", "Cape Verde", "Central African Republic", "Chad", "Chile", "China", "Colombia", "Comoros", "Congo", "Costa Rica", "Croatia", "Cuba", "Cyprus", "Czech Republic",
"Democratic Republic of the Congo", "Denmark", "Djibouti", "Dominica", "Dominican Republic",
"East Timor", "Ecuador", "El Salvador", "Equatorial Guinea", "Eritrea", "Estonia", "Ethiopia",
"Fiji", "Finland", "France",
"Gabon", "Gambia", "Georgia", "Germany", "Ghana", "Greece", "Grenada", "Guatemala", "Guinea", "Guinea-Bissau", "Guyana",
"Haiti", "Honduras", "Hungary",
"Iceland", "India", "Indonesia", "Ireland", "Israel", "Italy",
"Jamaica", "Japan",
"Kazakhstan", "Kenya", "Kiribati", "North Korea", "South Korea", "Kosovo", "Kyrgyzstan",
"Laos", "Latvia", "Lesotho", "Liberia", "Liechtenstein", "Lithuania", "Luxembourg",
"Madagascar", "Malawi", "Malaysia", "Maldives", "Mali", "Malta", "Marshall Islands", "Mauritania", "Mauritius", "Mexico", "Micronesia", "Moldova", "Monaco", "Mongolia", "Montenegro", "Mozambique", "Myanmar",
"Namibia", "Nauru", "Nepal", "Netherlands", "New Zealand", "Nicaragua", "Niger", "Nigeria", "North Macedonia", "Norway",
"Pakistan", "Palau", "Panama", "Papua New Guinea", "Paraguay", "Peru", "Philippines", "Poland", "Portugal",
"Romania", "Russia", "Rwanda",
"Saint Kitts and Nevis", "Saint Lucia", "Saint Vincent and the Grenadines", "Samoa", "San Marino", "Sao Tome and Principe", "Senegal", "Serbia", "Seychelles", "Sierra Leone", "Singapore", "Slovakia", "Slovenia", "Solomon Islands", "Somalia", "South Africa", "South Sudan", "Spain", "Sri Lanka", "Sudan", "Suriname", "Swaziland", "Sweden", "Switzerland",
"Taiwan", "Tajikistan", "Tanzania", "Thailand", "Togo", "Tonga", "Trinidad and Tobago", "Turkey", "Turkmenistan", "Tuvalu",
"Uganda", "Ukraine", "United Kingdom", "United States", "Uruguay", "Uzbekistan",
"Vanuatu", "Vatican City", "Venezuela", "Vietnam",
"Zambia", "Zimbabwe"];

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    if (errors[name]) setErrors(prev => ({ ...prev, [name]: '' }));
  };

  const handleInterestToggle = (interest: string) => {
    setSelectedInterests(prev =>
      prev.includes(interest) ? prev.filter(i => i !== interest) : [...prev, interest]
    );
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewImage(reader.result as string);
      reader.readAsDataURL(file);
      setFormData(prev => ({ ...prev, avatarUrl: file.name }));
    }
  };

  const validateStep = (stepNumber: number) => {
    const newErrors: { [key: string]: string } = {};

    if (stepNumber === 1) {
      if (!formData.email) newErrors.email = 'Email requis';
      else if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Email invalide';
      if (!formData.password) newErrors.password = 'Mot de passe requis';
      else if (formData.password.length < 6) newErrors.password = 'Mot de passe trop court';
      if (!formData.confirmPassword) newErrors.confirmPassword = 'Confirmation requise';
      else if (formData.password !== formData.confirmPassword) newErrors.confirmPassword = 'Les mots de passe ne correspondent pas';
    }

    if (stepNumber === 2) {
      if (!formData.firstName) newErrors.firstName = 'Prénom requis';
      if (!formData.lastName) newErrors.lastName = 'Nom requis';
      if (!formData.dateOfBirth) newErrors.dateOfBirth = 'Date de naissance requise';
      else {
        const age = new Date().getFullYear() - new Date(formData.dateOfBirth).getFullYear();
        if (age < 18) newErrors.dateOfBirth = 'Vous devez avoir au moins 18 ans';
      }
      if (!formData.gender) newErrors.gender = 'Genre requis';
      if (!formData.country) newErrors.country = 'Pays requis';
      if (!formData.job) newErrors.job = 'Profession requise';
      if (!formData.city) newErrors.city = 'Ville requise';
      if (!formData.educationLevel) newErrors.educationLevel = 'Niveau d\'études requis';
    }

    if (stepNumber === 3) {
      if (selectedInterests.length === 0) newErrors.interests = 'Sélectionnez au moins un centre d’intérêt';
      if (!formData.bio) newErrors.bio = 'Biographie requise';
    }

    if (stepNumber === 4 && !formData.avatarUrl) {
      newErrors.avatarUrl = 'Photo requise';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    const valid = validateStep(step);
    if (valid) {
      if (step === 3) {
        setFormData(prev => ({ ...prev, interests: selectedInterests }));
      }
      setStep(prev => prev + 1);
    }
  };

  const handleBack = () => setStep(prev => prev - 1);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(4)) return;

    setLoading(true);
    setMessage('');

    try {
      const result = await register({ ...formData });
      if (result.success) navigate('/dashboard');
      else setMessage(result.message);
    } catch (error: any) {
      setMessage(error.message || 'Erreur lors de l’inscription');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 via-secondary-50 to-yellow-50 flex items-center justify-center py-10 px-4">
      <div className="max-w-md w-full">
        {/* Header */}
        <div className="text-center mb-0">
          <Link to="/" className="inline-flex items-center space-x-2">
            <span className="text-4xl font-display font-bold bg-gradient-romantic bg-clip-text text-transparent">MeetUp</span>
          </Link>
          <h2 className="mt-2 text-3xl font-bold text-gray-800">Créer un compte</h2>
          <p className="mt-0 text-gray-600">Rejoignez notre communauté</p>
        </div>

        {/* Progress Bar */}
        <div className="mb-2 justify-between ">
          <div className="flex items-center justify-between">
            {['Compte', 'Profil', 'Centres d\'intérêt', 'Confirmation'].map((label, index) => {
              const currentStep = index + 1;
              return (
                <React.Fragment key={label}>
                  <div className={`flex items-center ${step >= currentStep ? 'text-secondary-600' : 'text-gray-400'}`}>
                    <div className={`w-8 h-8 rounded-full border-2 flex items-center justify-center ${step >= currentStep ? 'border-secondary-600 bg-secondary-400 text-white' : 'border-gray-300'}`}>
                      {step > currentStep ? <CheckCircle className="h-5 w-5" /> : currentStep}
                    </div>
                    <span className="ml-2 text-sm font-medium">{label}</span>
                  </div>
                  {index < 3 && (
                    <div className={`w-16 h-1 mx-2 ${step > currentStep ? 'bg-secondary-400' : 'bg-secondary-300'}`} />
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Form Card */}
        <div className="bg-white shadow-2xl rounded-2xl p-8 mt-4">
          {/* Alert Message */}
          {message && (
            <div className="mb-4 p-4 bg-secondary-50 border border-secondary-200 rounded-lg flex items-center space-x-2">
              <AlertCircle className="h-5 w-5 text-red-600" />
              <span className="text-red-700 text-sm">{message}</span>
            </div>
          )}

          {/* Form */}
          <form onSubmit={step === 1 ? (e) => { e.preventDefault(); handleNext(); } : handleSubmit}>
            {/* Étape 1 - Compte */}
            {step === 1 && (
              <div className="space-y-3">
                <h3 className="text-xl font-semibold text-gray-800 mb-1 text-center">Informations de connexion</h3>

                {/* Email */}
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Adresse email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.email ? 'border-secondary-500' : 'border-gray-300'}`}
                      placeholder="votre@email.com"
                      required
                    />
                  </div>
                  {errors.email && <p className="mt-1 text-sm text-secondary-600">{errors.email}</p>}
                </div>

                {/* Password */}
                <div>
                  <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">Mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? 'text' : 'password'}
                      value={formData.password}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.password ? 'border-secondary-500' : 'border-gray-300'}`}
                      placeholder="Votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.password && <p className="mt-1 text-sm text-secondary-600">{errors.password}</p>}
                </div>

                {/* Confirm Password */}
                <div>
                  <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">Confirmer le mot de passe</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={formData.confirmPassword}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.confirmPassword ? 'border-secondary-500' : 'border-gray-300'}`}
                      placeholder="Confirmer votre mot de passe"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      className="absolute right-3 top-3"
                    >
                      {showConfirmPassword ? <EyeOff className="h-5 w-5 text-gray-400" /> : <Eye className="h-5 w-5 text-gray-400" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p className="mt-1 text-sm text-secondary-600">{errors.confirmPassword}</p>}
                </div>

                <button
                  type="submit"
                  className="w-full bg-gradient-to-r from-secondary-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-orange-700 transition-all duration-200 transform hover:scale-105"
                >
                  Continuer
                </button>
              </div>
            )}

            {/* Étape 2 - Profil */}
            {step === 2 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Informations personnelles</h3>
                  <button type="button" onClick={handleBack} className="text-secondary-600 text-sm font-medium">Retour</button>
                </div>

                {/* First Name */}
                <div>
                  <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">Prénom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="firstName"
                      name="firstName"
                      type="text"
                      value={formData.firstName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.firstName ? 'border-secondary-500' : 'border-gray-300'}`}
                      placeholder="Votre prénom"
                      required
                    />
                  </div>
                  {errors.firstName && <p className="mt-1 text-sm text-secondary-600">{errors.firstName}</p>}
                </div>

                {/* Last Name */}
                <div>
                  <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">Nom</label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="lastName"
                      name="lastName"
                      type="text"
                      value={formData.lastName}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.lastName ? 'border-secondary-500' : 'border-gray-300'}`}
                      placeholder="Votre nom"
                      required
                    />
                  </div>
                  {errors.lastName && <p className="mt-1 text-sm text-secondary-600">{errors.lastName}</p>}
                </div>

                {/* Date of Birth */}
                <div>
                  <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">Date de naissance</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="dateOfBirth"
                      name="dateOfBirth"
                      type="date"
                      value={formData.dateOfBirth}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.dateOfBirth ? 'border-secondary-500' : 'border-gray-300'}`}
                      required
                    />
                  </div>
                  {errors.dateOfBirth && <p className="mt-1 text-sm text-secondary-600">{errors.dateOfBirth}</p>}
                </div>

                {/* Gender */}
                <div>
                  <label htmlFor="gender" className="block text-sm font-medium text-gray-700 mb-1">Genre</label>
                  <select
                    id="gender"
                    name="gender"
                    value={formData.gender}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.gender ? 'border-secondary-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Sélectionner votre genre</option>
                    <option value="male">Homme</option>
                    <option value="female">Femme</option>
                  </select>
                  {errors.gender && <p className="mt-1 text-sm text-secondary-600">{errors.gender}</p>}
                </div>

                {/* Country */}
                <div>
                  <label htmlFor="country" className="block text-sm font-medium text-gray-700 mb-1">Pays</label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <select
                      id="country"
                      name="country"
                      value={formData.country}
                      onChange={handleChange}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.country ? 'border-secondary-500' : 'border-gray-300'}`}
                      required
                    >
                      <option value="">Sélectionner votre pays</option>
                      {africanCountries.map(country => (
                        <option key={country} value={country}>{country}</option>
                      ))}
                    </select>
                  </div>
                  {errors.country && <p className="mt-1 text-sm text-secondary-600">{errors.country}</p>}
                </div>
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">Ville</label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    value={formData.city}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.city ? 'border-secondary-500' : 'border-gray-300'}`}
                    placeholder="Votre ville"
                    required
                  />
                  {errors.city && <p className="mt-1 text-sm text-secondary-600">{errors.city}</p>}
                </div>

                {/* Job */}
                <div>
                  <label htmlFor="job" className="block text-sm font-medium text-gray-700 mb-1">Profession</label>
                  <input
                    id="job"
                    name="job"
                    type="text"
                    value={formData.job}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.job ? 'border-secondary-500' : 'border-gray-300'}`}
                    placeholder="Votre profession"
                    required
                  />
                  {errors.job && <p className="mt-1 text-sm text-secondary-600">{errors.job}</p>}
                </div>

                {/* Education Level */}
                <div>
                  <label htmlFor="educationLevel" className="block text-sm font-medium text-gray-700 mb-1">Niveau d'études</label>
                  <select
                    id="educationLevel"
                    name="educationLevel"
                    value={formData.educationLevel}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${errors.educationLevel ? 'border-secondary-500' : 'border-gray-300'}`}
                    required
                  >
                    <option value="">Sélectionner votre niveau d'études</option>
                    <option value="high-school">Lycée</option>
                    <option value="bachelor">Licence</option>
                    <option value="master">Master</option>
                    <option value="phd">Doctorat</option>
                    <option value="other">Autre</option>
                  </select>
                  {errors.educationLevel && <p className="mt-1 text-sm text-secondary-600">{errors.educationLevel}</p>}
                </div>

               <button
  type="button"
  onClick={handleNext}
  className="w-full bg-gradient-to-r from-secondary-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-orange-700 focus:ring-4 focus:ring-secondary-500/50 transition-all duration-200 transform hover:scale-105"
>
  Continuer
</button>
              </div>
            )}

            {/* Étape 3 - Centres d’intérêt + Bio */}
            {step === 3 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Centres d’intérêt</h3>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    Retour
                  </button>
                </div>

                {/* Interests */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Choisissez vos intérêts</label>
                  <div className="grid grid-cols-3 gap-2">
                    {interestsList.map((interest) => (
                      <button
                        key={interest}
                        type="button"
                        onClick={() => handleInterestToggle(interest)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium ${
                          selectedInterests.includes(interest)
                            ? 'bg-secondary-600 text-white'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                        }`}
                      >
                        {interest}
                      </button>
                    ))}
                  </div>
                  {errors.interests && <p className="mt-1 text-sm text-secondary-600">{errors.interests}</p>}
                </div>

                {/* Bio */}
                <div>
                  <label htmlFor="bio" className="block text-sm font-medium text-gray-700 mb-1">Biographie</label>
                  <textarea
                    id="bio"
                    name="bio"
                    rows={4}
                    value={formData.bio}
                    onChange={handleChange}
                    className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-secondary-500 ${
                      errors.bio ? 'border-secondary-500' : 'border-gray-300'
                    }`}
                    placeholder="Parlez-nous un peu de vous..."
                  />
                  {errors.bio && <p className="mt-1 text-sm text-secondary-600">{errors.bio}</p>}
                </div>

             <button
  type="button"
  onClick={handleNext}
  className="w-full bg-gradient-to-r from-secondary-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-orange-700 focus:ring-4 focus:ring-secondary-500/50 transition-all duration-200 transform hover:scale-105"
>
  Continuer
</button>
              </div>
            )}

            {/* Étape 4 - Avatar */}
            {step === 4 && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-xl font-semibold text-gray-800">Photo de profil</h3>
                  <button
                    type="button"
                    onClick={handleBack}
                    className="text-secondary-600 hover:text-secondary-700 text-sm font-medium"
                  >
                    Retour
                  </button>
                </div>

                {/* Upload Preview */}
                <div className="flex flex-col items-center space-y-4">
                  <div className="w-32 h-32 rounded-full bg-gray-200 overflow-hidden">
                    {previewImage ? (
                      <img src={previewImage} alt="Preview" className="w-full h-full object-cover" />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center">
                        <ImageIcon className="w-10 h-10 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="profile-upload"
                  />
                  <label
                    htmlFor="profile-upload"
                    className="cursor-pointer bg-secondary-50 text-secondary-600 px-4 py-2 rounded-lg hover:bg-secondary-100 transition-colors duration-200"
                  >
                    Choisir une photo
                  </label>
                  {errors.avatarUrl && <p className="text-sm text-secondary-600">{errors.avatarUrl}</p>}
                </div>

                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-gradient-to-r from-secondary-600 to-orange-600 text-white py-3 px-4 rounded-lg font-semibold hover:from-secondary-700 hover:to-orange-700 focus:ring-4 focus:ring-secondary-500/50 transition-all duration-200 transform hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <div className="flex items-center justify-center space-x-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white" />
                      <span>Création du compte...</span>
                    </div>
                  ) : (
                    "Créer mon compte"
                  )}
                </button>
              </div>
            )}
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Vous avez déjà un compte ?{' '}
              <Link
                to="/login"
                className="text-secondary-600 hover:text-secondary-700 font-semibold transition-colors duration-200"
              >
                Se connecter
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
