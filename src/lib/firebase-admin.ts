// Deprecated import-path shim retained for the existing server.ts route.
// This module contains no Firebase SDK code; remove after server.ts imports supabase-auth.ts.
export { adminAuth, supabaseAuth } from './supabase-auth.ts';
export type { SupabaseVerifiedUser, SupabaseVerifiedUser as DecodedIdToken } from './supabase-auth.ts';
