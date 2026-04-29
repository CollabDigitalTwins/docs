---
sidebar_position: 3
title: Environment Variables
description: Complete reference for every variable in .env.example, with required/optional status, defaults, and production guidance.
---

# Environment Variables

CDT is configured entirely through environment variables. This page documents every key in `.env.example`: what it does, whether it is required, what a safe default looks like, and how it differs between development and production.

Variables are grouped by subsystem. The **Required** column uses these conventions:

- ✅ — required for any deployment
- 🟡 — required only if the related feature is enabled
- ➖ — optional

## Database

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `DATABASE_URL` | ✅ | PostgreSQL connection string. Use the `postgres` hostname when running inside Docker Compose. | `postgresql://cdt:secret@postgres:5432/cdt` |
| `POSTGRES_USER` | ✅ | Database user, used during initial container creation. | `cdt` |
| `POSTGRES_PASSWORD` | ✅ | Password for the user above. Use a long random value in production. | `change-me-in-production` |
| `POSTGRES_DB` | ✅ | Application database name. | `cdt` |

## Object storage (MinIO / S3)

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `MINIO_ROOT_USER` | ✅ | MinIO admin username (used when initializing the container). | `minioadmin` |
| `MINIO_ROOT_PASSWORD` | ✅ | MinIO admin password. Use a long random value in production. | `change-me-in-production` |
| `MINIO_ENDPOINT` | ✅ | Hostname of the MinIO server. `localhost` for local dev, `minio` inside Compose, public hostname in production. | `minio.example.com` |
| `MINIO_USE_SSL` | ✅ | `true` in production behind TLS, `false` for local dev. | `true` |
| `MINIO_REGION` | ➖ | S3 region label. Most deployments use the default. | `us-east-1` |
| `MINIO_URL` | ✅ | Full base URL the backend uses to reach MinIO. | `https://minio.example.com` |
| `S3_ACCESS_KEY` | ✅ | Access key for the application service account. | `cdt-app` |
| `S3_ACCESS_SECRET` | ✅ | Secret for the access key. | `…` |
| `NEXT_PUBLIC_MINIO_BUCKET_URL` | ✅ | Public base URL the browser uses to download assets. | `https://cdn.example.com` |

## Authentication (NextAuth)

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `AUTH_SECRET` | ✅ | NextAuth signing secret. Must be at least 32 random characters. Generate with `openssl rand -base64 32`. | `…` |
| `AUTH_URL` | ✅ | Public URL of the application — used for callback URLs. | `https://app.example.com` |
| `AUTH_TRUST_HOST` | 🟡 | Set `true` when running behind a reverse proxy. | `true` |
| `AUTH_GOOGLE_ID` | 🟡 | Google OAuth client ID (only if Google sign-in is enabled). | `…apps.googleusercontent.com` |
| `AUTH_GOOGLE_SECRET` | 🟡 | Google OAuth client secret. | `…` |

## Email (SMTP)

Required for verification emails, password reset, and member invitations.

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `EMAIL_HOST` | 🟡 | SMTP server hostname. | `smtp.resend.com` |
| `EMAIL_PORT` | 🟡 | SMTP port. `465` for SMTPS, `587` for STARTTLS. | `465` |
| `EMAIL_FROM` | 🟡 | Sender address shown in email headers. | `noreply@example.com` |
| `EMAIL_USER` | 🟡 | SMTP username. | `…` |
| `EMAIL_PASS` | 🟡 | SMTP password or API key. | `…` |

## External services

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `NEXT_PUBLIC_GEOCODE_EARTH_API_KEY` | 🟡 | Geocode Earth API key for address search. Without it, the geocoder is disabled. | `ge-…` |
| `NEXT_PUBLIC_RECAPTCHA_SITE_KEY` | 🟡 | Google reCAPTCHA v3 public site key for sign-up forms. | `…` |
| `NEXT_PUBLIC_RECAPTCHA_SECRET_KEY` | 🟡 | reCAPTCHA secret key. | `…` |

## Tile and asset URLs

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `NEXT_PUBLIC_MARTIN_SERVER_URL` | ✅ | Public base URL of the Martin tile server. | `https://tiles.example.com` |
| `NEXT_PUBLIC_ORGANIZATIONAL_DATASETS_URL` | ➖ | Base URL for organization-published GeoJSON datasets. | `https://data.example.com/datasets` |
| `NEXT_PUBLIC_POINTCLOUD_API_URL` | 🟡 | Base URL of the Potree-compatible point cloud server. Required if point clouds are enabled. | `https://potree.example.com` |

## Caching

| Variable | Required | Description | Example |
|----------|---------|-------------|---------|
| `MEMCACHE_SERVER` | ➖ | Memcache server address. Optional — used for cross-process caching when multiple Next.js workers run. | `memcache.example.com:11211` |
| `MEMCACHE_USERNAME` | ➖ | Memcache username. | `cdt` |
| `MEMCACHE_PASSWORD` | ➖ | Memcache password. | `…` |

## Development versus production

A handful of variables behave differently between local development and production:

| Variable | Development | Production |
|----------|-------------|------------|
| `MINIO_USE_SSL` | `false` | `true` |
| `AUTH_TRUST_HOST` | unset or `false` | `true` (when behind a proxy) |
| `AUTH_URL` | `http://localhost:3000` | `https://your-domain` |
| `MINIO_ENDPOINT` | `localhost` | public hostname |
| `NEXT_PUBLIC_MINIO_BUCKET_URL` | `http://localhost:9000` | public CDN URL |

## Security notes

- **Never commit `.env`** — it is listed in `.gitignore` for a reason.
- **Rotate `AUTH_SECRET`** if it is ever logged or shared — invalidates all existing sessions.
- **Use different credentials in production** than the defaults from `.env.example`.
- **Restrict MinIO and PostgreSQL ports** in production — only the application server needs to reach them.

## Related

- [Installation](./installation.md)
- [Self-Hosting](../deployment/self-hosting.md)
- [Services reference](../deployment/services.md)
