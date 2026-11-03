# Production deployment

This repository includes a Dockerfile for a container-based deployment, including Google Cloud Run. Payment configuration and payment behavior are intentionally not changed in this deployment pass.

## Required runtime configuration

Configure these values through your hosting provider's environment/secrets interface. Never commit production credentials:

- `NODE_ENV=production`
- `PORT` (Cloud Run supplies this; the server listens on it)
- `DATABASE_URL` (managed PostgreSQL connection string)
- `DATABASE_SSL=true` when the database endpoint requires TLS
- `GOOGLE_CLOUD_PROJECT` (Firebase project ID)

On Google Cloud Run, assign the service account the least-privilege permissions it needs and enable Application Default Credentials for Firebase Admin. Store database credentials in Secret Manager and expose them to the service as secrets.

Optional browser configuration can be supplied as `VITE_FIREBASE_*` and `VITE_GOOGLE_MAPS_API_KEY` build arguments/environment values. Browser keys are public identifiers, not server secrets; apply domain/API restrictions. Firebase Admin credentials must never use a browser key or be bundled into the frontend.

## Build and run locally

```sh
docker build -t talanta-stadium .
docker run --rm -p 8080:8080 \
  -e NODE_ENV=production \
  -e PORT=8080 \
  -e DATABASE_URL="$DATABASE_URL" \
  -e GOOGLE_CLOUD_PROJECT="$GOOGLE_CLOUD_PROJECT" \
  talanta-stadium
```

Run `bun run lint` and `bun run build` before deployment. Apply database schema migrations through a controlled release process before directing production traffic.

## Cloud Run outline

1. Create a production PostgreSQL database and configure network access from Cloud Run.
2. Create a Cloud Run service account and grant only required Firebase/database permissions.
3. Store the database URL in Secret Manager.
4. Build and deploy this directory as a container image; configure the environment variables above.
5. Configure a custom domain and HTTPS, then verify the service, database, authentication and event data before launch.

## Important readiness limitation

The current Express server still contains demo/in-memory users, events, bookings, news, announcements, and simulated payment behavior. This Docker setup does not make those flows production-safe. Do not enable real bookings or advertise live inventory until the backend data paths, authentication/authorization, and payment integration have been separately reviewed and replaced with verified production services. Payment changes are intentionally deferred as requested.
