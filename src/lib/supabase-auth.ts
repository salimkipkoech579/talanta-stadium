import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_PUBLISHABLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  throw new Error('Supabase auth is not configured. Set SUPABASE_URL and SUPABASE_PUBLISHABLE_KEY.');
}

// Validate user access tokens through Supabase Auth. Never use a secret/service-role
// key for request authentication; the caller's token is passed to getUser().
const authClient = createClient(supabaseUrl, supabaseKey, {
  auth: {
    persistSession: false,
    autoRefreshToken: false,
    detectSessionInUrl: false,
  },
});

export interface SupabaseVerifiedUser {
  uid: string;
  email?: string;
  name?: string;
  picture?: string;
  phone_number?: string;
}

export const supabaseAuth = {
  async verifyAccessToken(token: string): Promise<SupabaseVerifiedUser> {
    const { data, error } = await authClient.auth.getUser(token);
    if (error || !data.user) throw error ?? new Error('Invalid Supabase access token');

    const user = data.user;
    return {
      uid: user.id,
      email: user.email ?? undefined,
      name: user.user_metadata.full_name ?? user.user_metadata.name ?? undefined,
      picture: user.user_metadata.avatar_url ?? user.user_metadata.picture ?? undefined,
      phone_number: user.phone ?? undefined,
    };
  },
};
