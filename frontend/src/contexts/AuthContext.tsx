import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

interface User {
  id: number;
  name: string;
  email: string;
  role_id: number;
  hasPassword?: boolean;
  order_count?: number;
}

interface AuthContextType {
  user: User | null;
  token: string | null;
  login: (userData: User, token: string, redirectTo?: string) => void;
  logout: () => void;
  isAuthenticated: boolean;
  isAdmin: boolean;
  incrementOrderCount: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedToken = localStorage.getItem("token");
    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setToken(savedToken);
    }
  }, []);

  const login = (userData: User, token: string, redirectTo?: string) => {
    setUser(userData);
    setToken(token);
    localStorage.setItem("user", JSON.stringify(userData));
    localStorage.setItem("token", token);
    
    if (userData.role_id === 1) {
      navigate("/admin");
    } else if (redirectTo) {
      navigate(redirectTo);
    } else {
      navigate("/");
    }
  };

  const incrementOrderCount = () => {
    if (user) {
      const updatedUser = { ...user, order_count: (user.order_count ?? 0) + 1 };
      setUser(updatedUser);
      localStorage.setItem("user", JSON.stringify(updatedUser));
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    window.dispatchEvent(new Event("ag_logout"));
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      token, 
      login, 
      logout, 
      incrementOrderCount,
      isAuthenticated: !!token,
      isAdmin: user?.role_id === 1 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
