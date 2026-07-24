// frontend/src/context/AuthContext.jsx
import { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import {
  loginUser,
  registerUser,
  googleAuth,
  logoutUser,
  refreshSession,
  getMyProfile,
} from '../services/authService';

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const bootstrapSession = useCallback(async () => {
    try {
      await refreshSession();
      const profile = await getMyProfile();
      setUser(profile);
    } catch {
      setUser(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    bootstrapSession();
  }, [bootstrapSession]);

  useEffect(() => {
    const handleForceLogout = () => setUser(null);
    window.addEventListener('auth:logout', handleForceLogout);
    return () => window.removeEventListener('auth:logout', handleForceLogout);
  }, []);

  const login = useCallback(async (credentials) => {
    setError(null);
    const data = await loginUser(credentials);
    setUser(data.user);
    return data.user;
  }, []);

  const register = useCallback(async (payload) => {
    setError(null);
    const data = await registerUser(payload);
    setUser(data.user);
    return data.user;
  }, []);

  const googleLogin = useCallback(async ({ credential, role }) => {
    setError(null);
    const data = await googleAuth({ credential, role });
    setUser(data.user);
    return data.user;
  }, []);

  const logout = useCallback(async () => {
    try {
      await logoutUser();
    } finally {
      setUser(null);
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    const profile = await getMyProfile();
    setUser(profile);
    return profile;
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isLoading,
      error,
      login,
      register,
      googleLogin,
      logout,
      refreshProfile,
      setUser,
    }),
    [user, isLoading, error, login, register, googleLogin, logout, refreshProfile]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};