---
title: MinIO
description: Installing and configuring MinIO object storage for CDT.
sidebar_position: 3
---

# MinIO

**Image:** `minio/minio:latest`  
**Purpose:** S3-compatible object storage for unstructured digital twin assets — BIM models, point clouds, GIS data, images, and videos.

## Prerequisites

- Linux or Windows Server with Docker Engine 24.0+ or Podman v5.7.1 (rootless mode)
- Docker Compose
- Internet access to pull the container image on first startup

## Installation

No standalone MinIO installation required. MinIO starts as part of the CDT Compose stack:

```bash
docker compose up -d
```

### Bucket initialization

A one-time `minio-init` service runs on first startup to create required buckets. It:

1. Waits for MinIO to become available
2. Creates the following buckets if they do not exist: `dnd`, `users`, `building-footprints`, `org-logos`
3. Exits automatically after initialization

No manual bucket creation is needed.

## Configuration

Credentials are supplied via environment variables in the `.env` file:

| Variable | Purpose |
|----------|---------|
| `MINIO_ROOT_USER` | Administrator username |
| `MINIO_ROOT_PASSWORD` | Administrator password |

### Ports

| Port | Purpose |
|------|---------|
| `9000` | S3-compatible API endpoint |
| `9001` | Web-based management console |

### Persistent storage

| Setting | Value |
|---------|-------|
| Volume name | `minio_data` |
| Container path | `/data` |

Data persists across restarts and redeployments.

### Health check

MinIO's built-in health endpoint is used to verify service readiness before dependent services start.

## Integration

**Port 9000 (API):** Used by the CDT backend and frontend viewers to upload, retrieve, and stream digital twin assets. Must be protected by TLS (HTTPS) in production.

**Port 9001 (Console):** Browser-based management UI. Restrict access to trusted administrator networks or IP addresses only.

**Production deployment:** Place MinIO behind a reverse proxy (e.g. Nginx or Traefik) with valid TLS certificates. Without TLS, mixed-content warnings may occur when MinIO is accessed from secure frontend applications.

The Node application connects to MinIO using these environment variables:

| Variable | Purpose |
|----------|---------|
| `MINIO_ENDPOINT` | MinIO hostname or IP |
| `MINIO_USE_SSL` | `true` in production |
| `S3_ACCESS_KEY` | Access key |
| `S3_ACCESS_SECRET` | Secret key |
| `NEXT_PUBLIC_MINIO_BUCKET_URL` | Public bucket base URL |

## Related

- [Self-Hosting Overview](./overview.md)
- [Node / Next.js Application](./node-application.md) — primary consumer
