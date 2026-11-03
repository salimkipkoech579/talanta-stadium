import { initializeApp, getApps } from 'firebase-admin/app';
import { getAuth } from 'firebase-admin/auth';
import { readFileSync, existsSync } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const configPath = path.resolve(__dirname, '../../firebase-applet-config.json');

let firebaseConfig: { projectId?: string } = {
  projectId: process.env.GOOGLE_CLOUD_PROJECT || 'expanded-river-bt8c4',
};

if (existsSync(configPath)) {
  try {
    firebaseConfig = JSON.parse(readFileSync(configPath, 'utf-8'));
  } catch (e) {
    console.warn('Failed to parse firebase-applet-config.json, falling back to default projectId');
  }
}

if (!getApps().length) {
  initializeApp({
    projectId: firebaseConfig.projectId || process.env.GOOGLE_CLOUD_PROJECT || 'expanded-river-bt8c4',
  });
}

export const adminAuth = getAuth();
