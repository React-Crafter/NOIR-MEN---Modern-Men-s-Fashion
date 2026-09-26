import React, { createContext, useContext, useState, useEffect } from 'react';
import { adminLogin as apiAdminLogin } from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [adminUser, setAdminUser] = useState(() => {
    try {
      const saved = localStorage.getItem('noir_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [token, setToken] = useState(() => {
    return localStorage.getItem('noir_admin_token') || null;
  });

  const login = async (username, password) => {
    const res = await apiAdminLogin(username, password);
    if (res.success) {
      setAdminUser(res.user);
      setToken(res.token);
      localStorage.setItem('noir_admin_user', JSON.stringify(res.user));
      localStorage.setItem('noir_admin_token', res.token);
      return { success: true };
    }
    return { success: false, message: res.message || 'Invalid credentials' };
  };

  const logout = () => {
    setAdminUser(null);
    setToken(null);
    localStorage.removeItem('noir_admin_user');
    localStorage.removeItem('noir_admin_token');
  };

  const isAuthenticated = Boolean(token && adminUser);

  return (
    <AuthContext.Provider value={{ adminUser, token, isAuthenticated, login, logout }}>
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
