"use client";

import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Persistence: Check localStorage on initial load
  useEffect(() => {
    const stored = localStorage.getItem("user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch (error) {
        console.error("Failed to parse stored user", error);
        localStorage.removeItem("user");
      }
    }
    setLoading(false);
  }, []);

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Login failed");
    }

    // Save to state and localStorage
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  // ✅ SIGNUP
  const signup = async (userData: any) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(userData),
    });

    const data = await res.json();

    if (!res.ok || data.error) {
      throw new Error(data.error || "Signup failed");
    }

    // Automatically log the user in after successful signup
    setUser(data.user);
    localStorage.setItem("user", JSON.stringify(data.user));
    return data;
  };

  // ✅ LOGOUT
  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, signup, logout, loading }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) throw new Error("useAuth must be used within an AuthProvider");
  return context;
};
