import { initializeApp, getApps, applicationDefault } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID;
if (!projectId) {
  throw new Error('Firebase Admin is not configured. Set GOOGLE_CLOUD_PROJECT or FIREBASE_PROJECT_ID.');
}

if (!getApps().length) {
  initializeApp({ projectId, credential: applicationDefault() });
}

export const adminAuth = getAuth();
