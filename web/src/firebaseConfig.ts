import { initializeApp, getApps, getApp } from "firebase/app";
import { connectAuthEmulator, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

// Validate Firebase config
const isConfigured = Object.values(firebaseConfig).every(
  (val) => val && typeof val === "string",
);

if (!isConfigured) {
  console.warn(
    "Firebase not configured. Please set environment variables in .env.local:\n" +
      "VITE_FIREBASE_API_KEY\n" +
      "VITE_FIREBASE_AUTH_DOMAIN\n" +
      "VITE_FIREBASE_PROJECT_ID\n" +
      "VITE_FIREBASE_STORAGE_BUCKET\n" +
      "VITE_FIREBASE_MESSAGING_SENDER_ID\n" +
      "VITE_FIREBASE_APP_ID",
  );
}

// Evita reinicialização em hot-reload (HMR)
const app =
  isConfigured && getApps().length === 0
    ? initializeApp(firebaseConfig)
    : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);
export const isFirebaseConfigured = isConfigured;

const useAuthEmulator =
  import.meta.env.DEV && import.meta.env.VITE_USE_AUTH_EMULATOR === "true";

if (useAuthEmulator) {
  const globalKey = "__sendflow_auth_emulator_connected__";
  const globalState = globalThis as typeof globalThis & Record<string, boolean>;

  if (!globalState[globalKey]) {
    connectAuthEmulator(auth, "http://127.0.0.1:9099", {
      disableWarnings: true,
    });
    globalState[globalKey] = true;
  }
}
