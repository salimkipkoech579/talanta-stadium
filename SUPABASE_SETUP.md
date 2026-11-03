# Supabase setup

1. Copy `.env.example` to `.env` for local work and use your Supabase project's actual URL, publishable key, and database connection string. Never commit `.env` or paste secret keys into chat.
2. A service-role key is privileged. Store it only in the deployment secret manager; never expose it as a `VITE_` variable. The current auth middleware validates user access tokens using the publishable key and Supabase Auth's `/auth/v1/user` endpoint.
3. The current Drizzle models use a schema that does not match `supabase/schema.sql`. Do not run that SQL in a production project: it begins by dropping tables and includes example seed data. Reconcile schema/migrations in a fresh staging project, back up before any production migration, and use reviewed, non-destructive migrations.
4. Booking, ticketing, accommodation and payment endpoints remain disabled or incomplete until the Supabase schema, RLS policies and transactional server operations are implemented and tested. Keep payment disabled; its implementation is intentionally deferred.
5. Do not rely on user-supplied identity headers. Protected Express routes should use the Supabase `requireAuth` middleware and obtain the user ID from the verified token.
