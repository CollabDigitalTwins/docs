# =============================================================================
# CDT Self-Hosting — Example Environment Variables
# Copy this file to .env and fill in the values below.
# =============================================================================

# =============================================================================
# [REQUIRED] Postgres Container
# =============================================================================
POSTGRES_USER=cdt_user
POSTGRES_PASSWORD=change_me_postgres_password
POSTGRES_DB=cdt_db

# Must use the Docker service name "postgres" (not localhost) so the app
# container can reach the database over Docker's internal network.
DATABASE_URL="postgresql://cdt_user:change_me_postgres_password@postgres:5432/cdt_db"

# =============================================================================
# [REQUIRED] MinIO Container
# =============================================================================
MINIO_ROOT_USER=minio_admin
MINIO_ROOT_PASSWORD=change_me_minio_password

# Must match MINIO_ROOT_USER / MINIO_ROOT_PASSWORD exactly.
S3_ACCESS_KEY=minio_admin
S3_ACCESS_SECRET=change_me_minio_password

# IMPORTANT: Use "host.docker.internal" (not "localhost") for MINIO_ENDPOINT
# and MINIO_URL. Docker Desktop on Windows/Mac adds host.docker.internal to the
# system hosts file, so this hostname resolves correctly both from inside
# containers (server-side S3 requests) and from the browser (presigned URLs).
# Using "localhost" here would cause presigned URLs to break in the browser.
#
# On Linux, host.docker.internal is not available by default. Use your
# machine's LAN IP instead (e.g. http://192.168.1.100:9000), or add
# extra_hosts: ["host.docker.internal:host-gateway"] under the cdt service
# in docker-compose.public.yml and then use http://host.docker.internal:9000.
#
# For server/org deployments, use the public hostname (e.g. http://cdt.yourorg.com:9000
# or https://files.yourorg.com).
MINIO_ENDPOINT=host.docker.internal:9000
MINIO_USE_SSL=false
MINIO_REGION=us-east-1
MINIO_URL=http://host.docker.internal:9000

# Client-side (browser) MinIO URL — must use localhost + the exposed port.
# Do NOT use host.docker.internal here; browsers resolve it inconsistently.
# For org deployments, set this to the same value as MINIO_URL.
MINIO_BUCKET_URL=http://localhost:9000

# =============================================================================
# [REQUIRED] Authentication (NextAuth.js)
# =============================================================================
# Generate a secure secret with: openssl rand -base64 32
AUTH_SECRET=replace_with_a_random_string_at_least_32_chars
AUTH_TRUST_HOST=true

# The public URL of the app as exposed by Docker (port 6012 maps to container 3000).
# For org deployments, set this to your real domain (e.g. https://cdt.yourorg.com).
AUTH_URL=http://localhost:6012

# =============================================================================
# [REQUIRED] reCAPTCHA
# Register your domain at https://www.google.com/recaptcha/admin
# For local testing, add "localhost" as an allowed domain in the reCAPTCHA console.
# =============================================================================
RECAPTCHA_SITE_KEY=your_recaptcha_site_key
RECAPTCHA_SECRET_KEY=your_recaptcha_secret_key

# =============================================================================
# [REQUIRED] Email / SMTP
# Required for MFA one-time passcodes at login.
# =============================================================================
EMAIL_HOST=smtp.resend.com
EMAIL_PORT=465
EMAIL_FROM=noreply@yourdomain.com
EMAIL_USER=resend
EMAIL_PASS=your_smtp_password_or_api_key

# =============================================================================
# [REQUIRED] App
# =============================================================================
PORT=3000

# =============================================================================
# [OPTIONAL] Google OAuth
# Enables "Sign in with Google". Leave unset to disable Google login entirely.
# Create credentials at https://console.cloud.google.com/apis/credentials
# Authorized redirect URI: <AUTH_URL>/api/auth/callback/google
# Note: Google OAuth does not accept localhost as a redirect URI — you must
# register your real domain for org deployments.
# =============================================================================
AUTH_GOOGLE_ID=your_google_oauth_client_id.apps.googleusercontent.com
AUTH_GOOGLE_SECRET=your_google_oauth_client_secret

# =============================================================================
# [OPTIONAL] Geocoding (address search)
# CDT cascades through providers in priority order:
#   1. GEOCODE_EARTH_API_KEY — hosted Pelias, highest quality
#   2. GEOCODER_URL          — your own self-hosted Pelias instance, no key needed
#   3. (fallback)            — public Photon + Nominatim community instances
# All three variables below are optional; unset any you don't use.
# For production deployments, set at least one of the first two to avoid
# rate limits on the public community instances.
# =============================================================================
GEOCODE_EARTH_API_KEY=your_geocode_earth_api_key
GEOCODER_URL=https://pelias.example.com

# Override the public OSM fallback endpoints with your own self-hosted instances.
PHOTON_URL=https://photon.komoot.io
NOMINATIM_URL=https://nominatim.openstreetmap.org
