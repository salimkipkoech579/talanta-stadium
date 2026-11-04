import { supabaseAuth } from './supabase-auth.ts';

// Compatibility adapter for the existing server route during migration.
// This verifies Supabase access tokens and does not import Firebase SDKs.
export const adminAuth = {
  verifyIdToken: (token: string) => supabaseAuth.verifyAccessToken(token),
};

export type { SupabaseVerifiedUser as DecodedIdToken } from './supabase-auth.ts';
