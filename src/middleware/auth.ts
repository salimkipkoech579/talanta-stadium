import type { Request, Response, NextFunction } from 'express';
import { supabaseAuth, type SupabaseVerifiedUser } from '../lib/supabase-auth.ts';

export interface AuthRequest extends Request {
  user?: SupabaseVerifiedUser;
}

async function getBearerUser(req: Request): Promise<SupabaseVerifiedUser | null> {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith('Bearer ')) return null;

  const token = authHeader.slice('Bearer '.length).trim();
  if (!token) return null;
  return supabaseAuth.verifyAccessToken(token);
}

export const requireAuth = async (
  req: AuthRequest,
  res: Response,
  next: NextFunction,
) => {
  try {
    const user = await getBearerUser(req);
    if (!user) return res.status(401).json({ error: 'Unauthorized: Missing token' });
    req.user = user;
    return next();
  } catch (error) {
    console.error('Error verifying Supabase access token:', error);
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

export const optionalAuth = async (
  req: AuthRequest,
  _res: Response,
  next: NextFunction,
) => {
  try {
    req.user = (await getBearerUser(req)) ?? undefined;
  } catch {
    // Invalid/expired optional credentials do not prevent public access.
  }
  return next();
};
