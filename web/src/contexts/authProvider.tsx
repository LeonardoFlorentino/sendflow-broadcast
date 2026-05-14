import { ReactNode } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "./authContext";
import type { AuthContextType } from "../types/auth";

export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  const value: AuthContextType = {
    user: auth.user,
    userId: auth.user?.uid ?? null,
    loading: auth.loading,
    signIn: auth.signIn,
    signUp: auth.signUp,
    updateDisplayName: auth.updateDisplayName,
    updatePasswordWithConfirmation: auth.updatePasswordWithConfirmation,
    signOut: auth.signOut,
    signInWithGoogle: auth.signInWithGoogle,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
