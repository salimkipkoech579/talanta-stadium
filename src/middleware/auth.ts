import type { Request, Response, NextFunction } from 'express';
import type { SupabaseVerifiedUser } from '../lib/supabase-auth.ts';
import { verifySupabaseAccessToken } from '../lib/supabase-auth.ts';

export interface AuthRequest extends Request {
  user?: SupabaseVerifiedUser;
}

function getBearerToken(req: Request): string | null {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return null;
  const token = header.slice('Bearer '.length).trim();
  return token || null;
}

export const requireAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  const token = getBearerToken(req);
  if (!token) return res.status(401).json({ error: 'Authentication required.' });

  try {
    req.user = await verifySupabaseAccessToken(token);
    return next();
  } catch (error) {
    if (error instanceof Error && error.message.includes('not configured')) {
      return res.status(503).json({ error: 'Authentication is not configured.' });
    }
    return res.status(401).json({ error: 'Invalid or expired access token.' });
  }
};

export const optionalAuth = async (req: AuthRequest, _res: Response, next: NextFunction) => {
  const token = getBearerToken(req);
  if (!token) return next();

  try {
    req.user = await verifySupabaseAccessToken(token);
  } catch {
    // Public endpoints may proceed without a valid optional token.
  }
  return next();
};
