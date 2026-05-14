import { useContext } from "react";
import { AuthContext } from "../contexts/authContext";
import type { AuthContextType } from "../types/auth";

export function useAuthContext(): AuthContextType {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuthContext deve ser usado dentro de um AuthProvider");
  }
  return context;
}
