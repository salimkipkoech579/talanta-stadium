const supabaseUrl = process.env.SUPABASE_URL;
const publishableKey = process.env.SUPABASE_PUBLISHABLE_KEY;

export interface SupabaseVerifiedUser {
  id: string;
  email?: string;
  user_metadata?: Record<string, unknown>;
  phone?: string;
}

/** Validate a Supabase access token against Auth; never trust a client-supplied user id or role. */
export async function verifySupabaseAccessToken(token: string): Promise<SupabaseVerifiedUser> {
  if (!supabaseUrl || !publishableKey) {
    throw new Error('Supabase authentication is not configured.');
  }

  const response = await fetch(`${supabaseUrl.replace(/\/$/, '')}/auth/v1/user`, {
    headers: {
      apikey: publishableKey,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error('Invalid Supabase access token.');
  }

  return await response.json() as SupabaseVerifiedUser;
}
