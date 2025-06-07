import React, { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../services/supabase";

// PUBLIC_INTERFACE
const AuthContext = createContext();

/**
 * Provides authentication context for SplitSnap.
 */
export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Fetch and subscribe to auth changes
  useEffect(() => {
    const session = supabase.auth.getSession();
    setUser(session?.user || null);
    setLoading(false);
    const { data: listener } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setUser(session?.user || null);
      }
    );
    return () => listener?.unsubscribe?.();
  }, []);

  // PUBLIC_INTERFACE
  const login = (email, password) => supabase.auth.signInWithPassword({ email, password });
  // PUBLIC_INTERFACE
  const loginWithProvider = (provider) => supabase.auth.signInWithOAuth({ provider });
  // PUBLIC_INTERFACE
  const register = (email, password) => supabase.auth.signUp({ email, password });
  // PUBLIC_INTERFACE
  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, loginWithProvider, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

/**
 * Access authentication context.
 */
export function useAuth() {
  return useContext(AuthContext);
}
