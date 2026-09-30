import React, { createContext, useContext, useEffect, useState } from "react";
import type { User } from "../types/auth";
import { getCurrentUser, loginUser, logoutUser, registerUser } from "../services/authService";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (credentials: { email: string; password: string }) => Promise<void>;
  register: (userData: { email: string; password: string; fullName?: string }) => Promise<void>;
  logout: () => void;
  updateUser: (user: User) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    async function loadUser() {
      try {
        const currentUser = await getCurrentUser();
        setUser(currentUser);
      } catch {
        setUser(null);
      } finally {
        setLoading(false);
      }
    }
    loadUser();
  }, []);

  const handleLogin = async (credentials: { email: string; password: string }) => {
    await loginUser(credentials);
    const currentUser = await getCurrentUser();
    setUser(currentUser);
  };

  const handleRegister = async (userData: { email: string; password: string; fullName?: string }) => {
    await registerUser(userData);
  };

  const handleLogout = () => {
    logoutUser();
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        loading,
        isAuthenticated: !!user,
        isAdmin: user?.role === "Admin",
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        updateUser: setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
