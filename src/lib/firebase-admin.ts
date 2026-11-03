import type { Request, Response, NextFunction } from 'express';
import { supabaseAuth, type SupabaseVerifiedUser } from './supabase-auth.ts';

// Transitional export retained because server.ts currently imports this module by its
// previous filename. Authentication itself is now verified by Supabase Auth.
export const adminAuth = {
  verifyIdToken: (token: string) => supabaseAuth.verifyAccessToken(token),
};

export type { SupabaseVerifiedUser as DecodedIdToken };
