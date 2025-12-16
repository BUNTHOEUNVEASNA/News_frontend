// src/context/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { login as apiLogin, fetchProfile, register as apiRegister, verifyEmail as apiVerifyEmail } from "../api/users";
import { getTokens, clearAuth, saveTokens } from "../api/auth";

interface AuthContextType {
  user: any | null;
  loading: boolean;
  login: (username: string, password: string) => Promise<void>;
  register: (username: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  refreshUser: () => Promise<void>;
  verifyEmail: (token: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  const refreshUser = async () => {
    try {
      const profile = await fetchProfile();
      setUser(profile);
    } catch {
      setUser(null);
    }
  };

  const login = async (username: string, password: string) => {
    await apiLogin(username, password);
    await refreshUser();
  };

  const register = async (username: string, email: string, password: string) => {
    await apiRegister({ username, email, password });
  };

  const verifyEmail = async (token: string) => {
    await apiVerifyEmail(token);
  };

  const logout = () => {
    clearAuth();
    setUser(null);
  };

  useEffect(() => {
    if (getTokens().access) {
      refreshUser().finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading, login, logout, refreshUser, register, verifyEmail }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
