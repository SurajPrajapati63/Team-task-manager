
import React, { createContext, useContext, useMemo, useState } from "react";
import api from "../api/client";

const AuthContext = createContext();

export function AuthProvider({ children }) {

  // Load user from localStorage
  const [user, setUser] = useState(() => {
    try {
      const storedUser = localStorage.getItem("teamTaskUser");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Error parsing user from localStorage:", error);
      return null;
    }
  });

  // Login
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", {
        email,
        password,
      });

      const { token, user } = response.data;

      localStorage.setItem("teamTaskToken", token);
      localStorage.setItem("teamTaskUser", JSON.stringify(user));

      setUser(user);

      return response.data;

    } catch (error) {
      console.error("Login Error:", error);
      throw error;
    }
  };

  // Signup
  const signup = async (payload) => {
    try {
      const response = await api.post("/auth/signup", payload);

      const { token, user } = response.data;

      localStorage.setItem("teamTaskToken", token);
      localStorage.setItem("teamTaskUser", JSON.stringify(user));

      setUser(user);

      return response.data;

    } catch (error) {
      console.error("Signup Error:", error);
      throw error;
    }
  };

  // Logout
  const logout = async () => {
    try {
      await api.post("/auth/logout");
    } catch (error) {
      console.error("Logout Error:", error);
    } finally {
      localStorage.removeItem("teamTaskToken");
      localStorage.removeItem("teamTaskUser");

      setUser(null);
    }
  };

  // Context value
  const value = useMemo(
    () => ({
      user,
      isAuthenticated: !!user,
      isAdmin: user?.role === "Admin",
      login,
      signup,
      logout,
    }),
    [user]
  );

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

// Custom Hook
export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within AuthProvider");
  }

  return context;
}