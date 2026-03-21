import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import axiosClient from '../api/axiosClient';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadUser = async () => {
    const token = localStorage.getItem('portal_token');
    if (!token) {
      setLoading(false);
      return;
    }

    try {
      const { data } = await axiosClient.get('/auth/me');
      setUser(data.user);
    } catch (error) {
      localStorage.removeItem('portal_token');
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  const login = async (payload) => {
    const { data } = await axiosClient.post('/auth/login', payload);
    localStorage.setItem('portal_token', data.token);
    setUser(data.user);
    return data;
  };

  const register = async (payload) => {
    const { data } = await axiosClient.post('/auth/register', payload);
    localStorage.setItem('portal_token', data.token);
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('portal_token');
    setUser(null);
  };

  const value = useMemo(
    () => ({ user, setUser, loading, login, register, logout, reloadProfile: loadUser }),
    [user, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => useContext(AuthContext);
