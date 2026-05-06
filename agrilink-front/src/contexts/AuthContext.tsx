import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import api from '../services/api';

type User = {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'producer' | 'admin';
};

type AuthContextType = {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (userData: { name: string; email: string; password: string; role: 'user' | 'producer' }) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('agrilink_token') || localStorage.getItem('userToken');
      if (token) {
        try {
          const response = await api.get('/auth/me');
          setUser(response.data);
        } catch (error) {
          console.error("Erreur de verification de l'authentification:", error);
          localStorage.removeItem('agrilink_token');
          localStorage.removeItem('userToken');
        }
      }
      setLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token, user } = response.data;
      localStorage.setItem('agrilink_token', token);
      localStorage.setItem('userToken', token);
      setUser(user);
    } catch (error) {
      console.error('Echec de la connexion:', error);
      throw error;
    }
  };

  const register = async (userData: { name: string; email: string; password: string; role: 'user' | 'producer' }) => {
    try {
      await api.post('/auth/register', userData);
      await login(userData.email, userData.password);
    } catch (error) {
      console.error("Echec de l'inscription:", error);
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('agrilink_token');
    localStorage.removeItem('userToken');
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, isAuthenticated: !!user }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth doit etre utilise a l'interieur d'un AuthProvider");
  }
  return context;
};
