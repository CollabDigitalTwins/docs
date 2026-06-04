---
title: Services
description: Configuration reference for every service in the CDT stack — PostgreSQL, MinIO, Martin/PostGIS, the Node application, and the Open Data Service.
sidebar_position: 2
---

# Services

This page is the configuration reference for every container in the CDT stack. Each service has its own section with prerequisites, installation notes, configuration, and integration details. For an overview of how the services fit together and how to start the stack, see [Self-Hosting Overview](./overview.md).

All services start together via the project's `docker-compose.yml`:

```bash
docker compose up -d --build
```

On first run, apply database migrations once PostgreSQL is healthy:

```bash
docker compose run --rm migrate
```

## PostgreSQL

**Image:** `postgres:15`
**Purpose:** Relational database storing application data — building records, object metadata, users, and other structured entities.

### Installation

The image is pulled automatically when the Compose stack starts. On a fresh database, run Prisma migrations once after PostgreSQL is healthy:

```bash
docker compose run --rm migrate
```

This creates all required application tables. If the `postgres_data` volume already exists from a previous deployment, skip this step.

After migrations, the database contains schema only. Seed initial data as needed by restoring a database dump, executing SQL `INSERT` statements from CSV/JSON datasets, or running dedicated seeding scripts.

### Configuration

All credentials are supplied via environment variables (`.env` file in the project root). They are only used during initial database creation when the data volume is empty — changing them after initialization does not modify an existing database.

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER` | Database user created on init |
| `POSTGRES_PASSWORD` | Password for the database user |
| `POSTGRES_DB` | Name of the application database |

**Persistent storage:** Volume `postgres_data` mounted at `/var/lib/postgresql/data`, managed by Docker. Data persists across container restarts, updates, and redeployments.

**Network and port:** PostgreSQL listens on port `5432`, exposed to the host via Docker port mapping. Within the Compose stack, other services reach it at hostname `postgres` on port `5432`.

**Production note:** If PostgreSQL is only accessed by services inside the same Compose stack, remove the host port mapping for improved security. If external access is required, restrict it to trusted internal IPs:

```yaml
services:
  postgres:
    ports:
      - "192.XXX.X.X:5432:5432"
```

**Health check:** The Compose file defines a health check (`pg_isready -U <POSTGRES_USER> -d <POSTGRES_DB>`, 10s interval, 5s timeout, 5 retries) so dependent services wait until PostgreSQL is ready.

### Integration

`DATABASE_URL` is used by the CDT backend to connect:

```
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>
```

The hostname `postgres` resolves through Docker Compose internal networking. Port 5432 must not be publicly accessible in production — restrict inbound access to trusted internal networks only.

## MinIO

**Image:** `minio/minio:latest`
**Purpose:** S3-compatible object storage for unstructured digital twin assets — BIM models, point clouds, GIS data, images, and videos.

### Installation

MinIO starts as part of the CDT Compose stack. A one-time `minio-init` service runs on first startup to:

1. Wait for MinIO to become available
2. Create the platform's storage buckets (for example, `users` and `building-footprints`) if they do not exist
3. Exit automatically after initialization

No manual bucket creation is needed.

### Configuration

| Variable | Purpose |
|----------|---------|
| `MINIO_ROOT_USER` | Administrator username |
| `MINIO_ROOT_PASSWORD` | Administrator password |

**Ports:**

| Port | Purpose |
|------|---------|
| `9000` | S3-compatible API endpoint |
| `9001` | Web-based management console |

**Persistent storage:** Volume `minio_data` mounted at `/data`. Data persists across restarts and redeployments.

**Health check:** MinIO's built-in health endpoint is used to verify service readiness before dependent services start.

### Integration

- **Port 9000 (API):** Used by the CDT backend and frontend viewers to upload, retrieve, and stream digital twin assets. Must be protected by TLS (HTTPS) in production.
- **Port 9001 (Console):** Browser-based management UI. Restrict access to trusted administrator networks or IP addresses only.

**Production deployment:** Place MinIO behind a reverse proxy (e.g. Nginx or Traefik) with valid TLS certificates. Without TLS, mixed-content warnings may occur when MinIO is accessed from secure frontend applications.

The Node application connects to MinIO using these environment variables:

| Variable | Purpose |
|----------|---------|
| `MINIO_ENDPOINT` | MinIO hostname or IP |
| `MINIO_USE_SSL` | `true` in production |
| `S3_ACCESS_KEY` | Access key |
| `S3_ACCESS_SECRET` | Secret key |
| `NEXT_PUBLIC_MINIO_BUCKET_URL` | Public bucket base URL |

## Martin / PostGIS

**Images:** `postgis/postgis:15-3.4` · `maplibre/martin:main`
**Purpose:** PostGIS extends PostgreSQL with geospatial capabilities. Martin reads PostGIS spatial tables and exposes them as Mapbox Vector Tiles (MVT) consumed by the CDT map frontend.

### Installation

Both images are pulled automatically when the Compose stack starts. On first startup:

- PostgreSQL initializes the database using `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`
- The `postgis/postgis` image enables PostGIS extensions automatically
- Any SQL scripts placed in `/docker-entrypoint-initdb.d` are executed during initialization
- Martin waits until PostgreSQL reports healthy, then connects and auto-discovers all spatial tables and views containing geometry columns
- Each discovered dataset is immediately exposed as a vector tile endpoint — no manual registration needed

### Configuration

PostGIS shares the PostgreSQL configuration described in the [PostgreSQL section](#postgresql) — credentials and storage are the same.

Martin is configured via a PostgreSQL connection string passed as a command argument:

```
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>
```

| Setting | Value |
|---------|-------|
| Internal port | `3000` |
| Host port | `6080` |
| Log level env var | `RUST_LOG=info` |
| Startup dependency | Waits for PostgreSQL health check |

Martin endpoint once running:

```
http://localhost:6080
```

### Integration

- **Port 5432 (PostgreSQL/PostGIS):** Stores spatial and non-spatial application data. Accessed by both the Node backend and Martin.
- **Port 6080 (Martin):** Serves Mapbox Vector Tiles consumed by MapLibre in the CDT frontend. Used for spatial visualization of organizational datasets.

**Security:**

- PostgreSQL must not be publicly accessible in production
- Martin should be deployed behind a reverse proxy with TLS enabled
- Database credentials are supplied via environment variables only
- Martin operates with **read-only** access to spatial datasets

## Node / Next.js Application

**Image:** Built from the project `Dockerfile`
**Purpose:** Core backend and web application. Provides business logic, CRUD operations for all entities, authentication via NextAuth.js, and serves the Next.js frontend.

### Installation

Build and start the application container:

```bash
docker compose up -d --build
```

Verify the application is running:

```
http://localhost:6012
```

A container health check validates that the application responds on its internal HTTP endpoint.

The Node service depends on PostgreSQL being healthy. On first deployment, run migrations before the application starts serving traffic:

```bash
docker compose run --rm migrate
```

### Configuration

The application is configured entirely through environment variables in the `.env` file at the project root. The table below mirrors the keys present in the current `.env` template — values marked sensitive must be set to secure values for your environment. **Do not commit real secrets to source control.**

| Key | Purpose |
|-----|---------|
| `DATABASE_URL` | PostgreSQL connection string |
| `MINIO_ENDPOINT` | MinIO hostname |
| `MINIO_USE_SSL` | `true` in production |
| `MINIO_REGION` | S3 region (typically `us-east-1`) |
| `MINIO_URL` | Full MinIO base URL |
| `S3_ACCESS_KEY` | MinIO access key |
| `S3_ACCESS_SECRET` | MinIO secret key |
| `AUTH_SECRET` | NextAuth.js signing secret |
| `AUTH_TRUST_HOST` | `true` when behind a reverse proxy |
| `AUTH_URL` | Public domain name of the application |
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | Google reCAPTCHA site key (public) |
| `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` | Google reCAPTCHA secret key |
| `EMAIL_HOST` | SMTP hostname (e.g. `smtp.resend.com`) |
| `EMAIL_PORT` | SMTP port (e.g. `465`) |
| `EMAIL_FROM` | Sender address |
| `EMAIL_USER` | SMTP username |
| `EMAIL_PASS` | SMTP password |
| `MEMCACHE_SERVER` | Memcache server address |
| `MEMCACHE_USERNAME` | Memcache username |
| `MEMCACHE_PASSWORD` | Memcache password |
| `NEXT_PUBLIC_GEOCODE_EARTH_API_KEY` | Geocode Earth API key for address search |
| `NEXT_PUBLIC_MARTIN_SERVER_URL` | Martin tile server base URL |
| `NEXT_PUBLIC_MINIO_BUCKET_URL` | MinIO bucket public base URL |
| `NEXT_PUBLIC_ORGANIZATIONAL_DATASETS_URL` | Open datasets base URL |
| `NEXT_PUBLIC_POINTCLOUD_API_URL` | Point cloud API base URL |

### Integration

**Port 6012 → 3000:** Primary HTTP endpoint. Host port `6012` maps to container port `3000`.

In production, place the application behind a reverse proxy with TLS and restrict direct access to port `6012` according to your organization's security policies.

External service dependencies:

| Service | Connection | Used for |
|---------|-----------|---------|
| PostgreSQL | `DATABASE_URL` | All application data |
| MinIO | `S3_ACCESS_KEY` / `S3_ACCESS_SECRET` | Asset storage |
| Martin | `NEXT_PUBLIC_MARTIN_SERVER_URL` | Map tile consumption |

Notable libraries:

- **NextAuth.js** — authentication and session management
- **MapLibre** — interactive vector map rendering
- **Prisma** — database schema management and query layer

For a full dependency list see `package.json` in the application source.

## Open Data Service

**Purpose:** Registry of open data portals — municipal, provincial, organizational, and federal. Enables dataset discovery and integration via geographic and categorical filtering.

### Installation

No separate installation required. The service is provisioned via Prisma migrations and exposed through the existing Node API.

```bash
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Run migrations (creates the OpenDataPortal table)
docker compose run --rm migrate

# 3. Start the CDT application
docker compose up -d cdt
```

### Configuration

The `OpenDataPortal` table is created by Prisma migrations. Its schema:

| Column | Type | Purpose |
|--------|------|---------|
| `id` | Integer (auto-increment) | Unique identifier |
| `name` | String | Portal name |
| `group` | Enum | `MUNICIPALITY` · `PROVINCAL` · `FEDERAL` · `ORGANIZATIONAL` |
| `province` | Enum | Two-letter province/territory code (e.g. `ON`, `QC`) |
| `municipality` | String | Municipality name (optional) |
| `portalUrl` | String (URL) | Portal web link (optional) |
| `apiUrl` | String (URL) | API endpoint (optional) |
| `dataManagementSystem` | Enum | `CKAN` · `SOCRATA` · `OPENGOV` · `CUSTOM` · `OTHER` |

To inspect or seed portal records using Prisma Studio:

```bash
npx prisma studio
```

### Integration

**Port 6012 (Node Application):** REST API endpoint for portal metadata.

| Operation | Access |
|-----------|--------|
| `GET` (retrieve portals by province, municipality, group, or ID) | Public |
| `POST` / `PATCH` / `DELETE` | Authenticated users only |

## Related

- [Self-Hosting Overview](./overview.md)
- [CDT Hosted (SaaS)](./cdt-hosted.md)
- [Architecture Overview](../architecture/overview.mdx)
