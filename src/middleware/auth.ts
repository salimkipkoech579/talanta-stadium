import type { Request, Response, NextFunction } from 'express';
import { supabaseAuth, type SupabaseVerifiedUser } from '../lib/firebase-admin.ts';

export interface AuthRequest extends Request {
  user?: SupabaseVerifiedUser;
}

async function getBearerUser(req: Request): Promise<SupabaseVerifiedUser | null> {
  const authorization = req.headers.authorization;
  if (!authorization?.startsWith('Bearer ')) return null;

  const token = authorization.slice('Bearer '.length).trim();
  if (!token) return null;
  return supabaseAuth.verifyAccessToken(token);
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
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

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  try {
    req.user = (await getBearerUser(req)) ?? undefined;
  } catch {
    // Continue as a guest if an optional token is missing, invalid, or expired.
  }
  return next();
};
