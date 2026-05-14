import { ReactNode, useMemo } from "react";
import { useAuth } from "../hooks/useAuth";
import { AuthContext } from "./authContext";
import type { AuthContextType } from "../types/auth";

/**
 * AuthProvider component that provides authentication state and methods to its children.
 */
export function AuthProvider({ children }: { children: ReactNode }) {
  const auth = useAuth();

  // Memoize the context value to prevent unnecessary re-renders of consumers
  const value: AuthContextType = useMemo(
    () => ({
      user: auth.user,
      userId: auth.user?.uid ?? null,
      loading: auth.loading,
      signIn: auth.signIn,
      signUp: auth.signUp,
      updateDisplayName: auth.updateDisplayName,
      updatePasswordWithConfirmation: auth.updatePasswordWithConfirmation,
      signOut: auth.signOut,
      signInWithGoogle: auth.signInWithGoogle,
    }),
    [
      auth.user,
      auth.loading,
      auth.signIn,
      auth.signUp,
      auth.updateDisplayName,
      auth.updatePasswordWithConfirmation,
      auth.signOut,
      auth.signInWithGoogle,
    ],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}
