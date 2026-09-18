import React, { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../services/api';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('actionvault_admin_token') || null);
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('actionvault_admin_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [settings, setSettings] = useState({
    showroomName: 'ActionVault',
    showroomTagline: 'Exhibición & Venta de Figuras de Acción de Alta Gama',
    whatsappNumber: '+5491123456789',
    currency: 'USD'
  });

  const isAuthenticated = Boolean(token);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const data = await api.getSettings();
      setSettings(prev => ({ ...prev, ...data }));
    } catch (e) {
      console.error('Error fetching settings:', e);
    }
  };

  const login = async (password) => {
    const res = await api.login(password);
    if (res.token) {
      setToken(res.token);
      setUser(res.user);
      localStorage.setItem('actionvault_admin_token', res.token);
      localStorage.setItem('actionvault_admin_user', JSON.stringify(res.user));
    }
    return res;
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('actionvault_admin_token');
    localStorage.removeItem('actionvault_admin_user');
  };

  return (
    <AuthContext.Provider value={{
      token,
      user,
      isAuthenticated,
      settings,
      setSettings,
      fetchSettings,
      login,
      logout
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
