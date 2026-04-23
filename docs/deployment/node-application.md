---
title: Node / Next.js Application
description: Installing and configuring the CDT core application container.
sidebar_position: 5
---

# Node / Next.js Application

**Image:** Built from the project `Dockerfile`  
**Purpose:** Core backend and web application. Provides business logic, CRUD operations for all entities, authentication via NextAuth.js, and serves the Next.js frontend.

## Prerequisites

- Linux or Windows Server with Docker Engine 24.0+ or Podman v5.7.1 (rootless mode)
- Docker Compose
- A populated `.env` file in the project root (see [Configuration](#configuration) below)
- PostgreSQL and MinIO running and healthy
- Internet access to pull the base image on first startup

## Installation

Build and start the application container:

```bash
docker compose up -d --build
```

Verify the application is running:

```
http://localhost:6012
```

A container health check validates that the application responds on its internal HTTP endpoint.

### Migration dependency

The Node service depends on PostgreSQL being healthy. On first deployment, run migrations before the application starts serving traffic:

```bash
docker compose run --rm migrate
```

## Configuration

The application is configured entirely through environment variables in the `.env` file at the project root. The table below lists all required keys. Values marked `<placeholder>` are sensitive and must be set to secure values for your environment — **do not commit real secrets to source control**.

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
| `EMAIL_HOST` | SMTP hostname |
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
| `NEXT_PUBLIC_MINIO_ASSETS_URL` | MinIO assets path |
| `NEXT_PUBLIC_MINIO_MEDIA_URL` | MinIO media path |
| `NEXT_PUBLIC_ORGANIZATIONAL_DATASETS_URL` | Open datasets base URL |

## Integration

**Port 6012 → 3000:** Primary HTTP endpoint. Host port `6012` maps to container port `3000`.

In production, place the application behind a reverse proxy with TLS and restrict direct access to port `6012` according to your organization's security policies.

### External service dependencies

| Service | Connection | Used for |
|---------|-----------|---------|
| PostgreSQL | `DATABASE_URL` | All application data |
| MinIO | `S3_ACCESS_KEY` / `S3_ACCESS_SECRET` | Asset storage |
| Martin | `NEXT_PUBLIC_MARTIN_SERVER_URL` | Map tile consumption |

### Notable libraries

- **NextAuth.js** — authentication and session management
- **MapLibre** — interactive vector map rendering
- **Prisma** — database schema management and query layer

For a full dependency list see `package.json` in the application source.

## Related

- [Self-Hosting Overview](./overview.md)
- [PostgreSQL](./postgresql.md)
- [MinIO](./minio.md)
- [Martin / PostGIS](./martin-postgis.md)
- [Open Data Service](./open-data-service.md)
