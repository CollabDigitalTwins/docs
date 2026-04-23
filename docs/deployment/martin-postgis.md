---
title: Martin / PostGIS
description: Installing and configuring the PostGIS geospatial database extension and Martin vector tile server for CDT.
sidebar_position: 4
---

# Martin / PostGIS

**Images:** `postgis/postgis:15-3.4` · `maplibre/martin:main`  
**Purpose:** PostGIS extends PostgreSQL with geospatial capabilities. Martin reads PostGIS spatial tables and exposes them as Mapbox Vector Tiles (MVT) consumed by the CDT map frontend.

## Prerequisites

- Linux or Windows Server with Docker Engine 24.0+ or Podman v5.7.1 (rootless mode)
- Docker Compose
- PostgreSQL 15 running (PostGIS uses the same Compose service)
- Internet access to pull container images on first startup

## Installation

No manual download required. Both images are pulled automatically when the Compose stack starts:

```bash
docker compose up -d
```

### First-run behaviour

On first startup:

- PostgreSQL initializes the database using `POSTGRES_USER`, `POSTGRES_PASSWORD`, and `POSTGRES_DB`
- The `postgis/postgis` image enables PostGIS extensions automatically
- Any SQL scripts placed in `/docker-entrypoint-initdb.d` are executed during initialization
- Martin waits until PostgreSQL reports healthy, then connects and auto-discovers all spatial tables and views containing geometry columns
- Each discovered dataset is immediately exposed as a vector tile endpoint — no manual registration needed

## Configuration

### PostGIS

PostGIS shares the PostgreSQL configuration — credentials and storage are the same as the [PostgreSQL installation](./postgresql.md).

| Setting | Value |
|---------|-------|
| Volume name | `postgres_data` |
| Container path | `/var/lib/postgresql/data` |
| Internal hostname | `postgres` |
| Port | `5432` |

### Martin

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

## Integration

**Port 5432 (PostgreSQL/PostGIS):** Stores spatial and non-spatial application data. Accessed by both the Node backend and Martin.

**Port 6080 (Martin):** Serves Mapbox Vector Tiles consumed by MapLibre in the CDT frontend. Used for spatial visualization of organizational datasets.

### Security

- PostgreSQL must not be publicly accessible in production
- Martin should be deployed behind a reverse proxy with TLS enabled
- Database credentials are supplied via environment variables only
- Martin operates with **read-only** access to spatial datasets

## Related

- [Self-Hosting Overview](./overview.md)
- [PostgreSQL](./postgresql.md) — shared database instance
- [Node / Next.js Application](./node-application.md) — also reads from PostGIS
