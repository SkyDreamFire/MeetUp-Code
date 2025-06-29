import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { motion} from 'framer-motion';
export const LogoutHandler = () => {
  const { logout } = useAuth(); // logout doit appeler supabase.auth.signOut() à l'intérieur
  const navigate = useNavigate();

  useEffect(() => {
    const handleLogout = async () => {
      await logout(); // Déconnexion via ton context
      navigate('/login', { replace: true }); // Redirection vers la page de login
    };

    handleLogout();
  }, [logout, navigate]);

  return (
     <div className="min-h-screen bg-gradient-romantic flex items-center justify-center">
        <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-4 shadow-2xl">
            <img src="/logo_final-removebg-preview.png" alt="logo" className="w-10 h-10 animate-pulse" />
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">MeeTup</h1>
          <div className="flex space-x-1 justify-center">
            <div className="w-2 h-2 bg-white rounded-full animate-bounce" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-100" />
            <div className="w-2 h-2 bg-white rounded-full animate-bounce delay-200" />
          </div>
        </motion.div>
      </div>
  );
  
};
