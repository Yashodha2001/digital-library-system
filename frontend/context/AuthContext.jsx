'use client';

import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { flushSync } from 'react-dom';
import { api } from '@/lib/api';
import { getStoredAuth, setStoredAuth, clearStoredAuth } from '@/lib/authStorage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const { user: storedUser, token: storedToken } = getStoredAuth();
    setUser(storedUser);
    setToken(storedToken);
    setLoading(false);
  }, []);

  const persist = useCallback((u, t) => {
    setStoredAuth(u, t);
    flushSync(() => {
      setUser(u);
      setToken(t);
      setLoading(false);
    });
  }, []);

  const login = useCallback(
    async (role, credentials) => {
      const data =
        role === 'admin'
          ? await api.adminLogin(credentials)
          : await api.studentLogin(credentials);
      persist(data.user, data.token);
      return data.user;
    },
    [persist]
  );

  const register = useCallback(
    async (credentials) => {
      const data = await api.studentRegister(credentials);
      persist(data.user, data.token);
      return data.user;
    },
    [persist]
  );

  const logout = useCallback(() => {
    clearStoredAuth();
    flushSync(() => {
      setUser(null);
      setToken(null);
    });
  }, []);

  return (
    <AuthContext.Provider value={{ user, token, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
