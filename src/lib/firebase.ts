import { initializeApp, getApps } from 'firebase/app';
import { getAuth, GoogleAuthProvider } from 'firebase/auth';

const config = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
};

const isConfigured = Object.values(config).every((value) => typeof value === 'string' && value.trim().length > 0);
const app = isConfigured ? (getApps()[0] || initializeApp(config)) : null;

export const auth = app ? getAuth(app) : null;
export const googleAuthProvider = new GoogleAuthProvider();
