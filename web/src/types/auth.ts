import type { User } from "firebase/auth";

export interface AuthContextType {
  user: User | null;
  userId: string | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<void>;
  signUp: (email: string, password: string, displayName: string) => Promise<void>;
  updateDisplayName: (displayName: string) => Promise<void>;
  updatePasswordWithConfirmation: (
    currentPassword: string,
    newPassword: string,
  ) => Promise<void>;
  signOut: () => Promise<void>;
  signInWithGoogle: () => Promise<void>;
}
