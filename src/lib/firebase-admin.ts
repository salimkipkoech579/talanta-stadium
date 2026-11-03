import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';

const projectId = process.env.GOOGLE_CLOUD_PROJECT || process.env.FIREBASE_PROJECT_ID || 'talanta-stadium-dev';

if (!getApps().length) {
  initializeApp({
    projectId,
    credential: undefined,
  });
}

export const adminAuth = getAuth();
