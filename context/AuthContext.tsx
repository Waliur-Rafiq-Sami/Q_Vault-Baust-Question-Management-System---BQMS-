"use client";

import { createContext, useContext, useState } from "react";

const AuthContext = createContext<any>(null);

export const AuthProvider = ({ children }: any) => {
  const [user, setUser] = useState(null);

  // 🔥 SIGNUP FIX
  const signup = async (name: string, email: string, password: string) => {
    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ❗ MUST
      },
      body: JSON.stringify({
        name,
        email,
        password,
      }),
    });

    const data = await res.json();

    console.log("SIGNUP RESPONSE:", data); // debug

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  const login = async (email: string, password: string) => {
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json", // ❗ MUST
      },
      body: JSON.stringify({ email, password }),
    });

    const data = await res.json();

    console.log("LOGIN RESPONSE:", data);

    if (data.error) throw new Error("Login failed");

    setUser(data);
    localStorage.setItem("user", JSON.stringify(data));
  };

  return (
    <AuthContext.Provider value={{ user, login, signup }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
