import { useEffect, useState } from "react";
import {
  EmailAuthProvider,
  onAuthStateChanged,
  reauthenticateWithCredential,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut as firebaseSignOut,
  GoogleAuthProvider,
  signInWithPopup,
  updatePassword,
  updateProfile,
  type User,
} from "firebase/auth";
import { auth } from "../firebaseConfig";

interface AuthState {
  user: User | null;
  loading: boolean;
}

interface UseAuth extends AuthState {
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

export function useAuth(): UseAuth {
  const [state, setState] = useState<AuthState>({ user: null, loading: true });

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setState({ user, loading: false });
    });
    return unsubscribe;
  }, []);

  async function signIn(email: string, password: string): Promise<void> {
    await signInWithEmailAndPassword(auth, email, password);
  }

  async function signUp(
    email: string,
    password: string,
    displayName: string,
  ): Promise<void> {
    const credentials = await createUserWithEmailAndPassword(
      auth,
      email,
      password,
    );

    if (displayName.trim()) {
      await updateProfile(credentials.user, {
        displayName: displayName.trim(),
      });
      setState((current) => ({
        ...current,
        user: auth.currentUser,
      }));
    }
  }

  async function signOut(): Promise<void> {
    await firebaseSignOut(auth);
  }

  async function updateDisplayName(displayName: string): Promise<void> {
    if (!auth.currentUser) {
      throw new Error("Usuário não autenticado");
    }

    await updateProfile(auth.currentUser, {
      displayName: displayName.trim(),
    });

    setState((current) => ({
      ...current,
      user: auth.currentUser,
    }));
  }

  async function updatePasswordWithConfirmation(
    currentPassword: string,
    newPassword: string,
  ): Promise<void> {
    const currentUser = auth.currentUser;

    if (!currentUser) {
      throw new Error("Usuário não autenticado");
    }

    if (!currentUser.email) {
      throw new Error("Este usuário não possui email vinculado");
    }

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword,
    );

    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  }

  async function signInWithGoogle(): Promise<void> {
    const provider = new GoogleAuthProvider();
    await signInWithPopup(auth, provider);
  }

  return {
    user: state.user,
    loading: state.loading,
    signIn,
    signUp,
    updateDisplayName,
    updatePasswordWithConfirmation,
    signOut,
    signInWithGoogle,
  };
}
