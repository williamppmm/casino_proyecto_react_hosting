// src/hooks/useAuth.js
import { useNavigate } from 'react-router-dom';

export const useAuth = () => {
  const navigate = useNavigate();

  const logout = async () => {
    try {
      sessionStorage.clear();
      localStorage.clear();
      navigate('/login-usuario', { replace: true });
      return { success: true };
    } catch (error) {
      console.error('Error durante logout:', error);
      return { success: false, error };
    }
  };

  const isAuthenticated = () => {
    return !!sessionStorage.getItem('token');
  };

  return {
    logout,
    isAuthenticated
  };
};