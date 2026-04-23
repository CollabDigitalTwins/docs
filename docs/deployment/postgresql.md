---
title: PostgreSQL
description: Installing and configuring the PostgreSQL 15 database container for CDT.
sidebar_position: 2
---

# PostgreSQL

**Image:** `postgres:15`  
**Purpose:** Relational database storing application data — building records, object metadata, users, and other structured entities.

## Prerequisites

- Linux or Windows Server with Docker Engine 24.0+ or Podman v5.7.1 (rootless mode)
- Docker Compose
- Internet access to pull the container image on first startup

## Installation

No manual download required. The image is pulled automatically when the Compose stack starts.

```bash
docker compose up -d
```

### First-run: apply migrations

On a fresh database, run Prisma migrations once after PostgreSQL is healthy:

```bash
docker compose run --rm migrate
```

This creates all required application tables. If the `postgres_data` volume already exists from a previous deployment, skip this step.

### Data seeding

After migrations, the database contains schema only. Seed initial data as needed:

- Restore a database dump
- Execute SQL `INSERT` statements from CSV/JSON datasets
- Run dedicated seeding scripts

## Configuration

All credentials are supplied via environment variables (`.env` file in the project root). They are only used during initial database creation when the data volume is empty — changing them after initialization does not modify an existing database.

| Variable | Purpose |
|----------|---------|
| `POSTGRES_USER` | Database user created on init |
| `POSTGRES_PASSWORD` | Password for the database user |
| `POSTGRES_DB` | Name of the application database |

### Persistent storage

| Setting | Value |
|---------|-------|
| Volume name | `postgres_data` |
| Container path | `/var/lib/postgresql/data` |
| Managed by | Docker (no manual host directory needed) |

Data persists across container restarts, updates, and redeployments.

### Network and port

PostgreSQL listens on port `5432`, exposed to the host via Docker port mapping. Within the Compose stack, other services reach it at hostname `postgres` on port `5432`.

**Production note:** If PostgreSQL is only accessed by services inside the same Compose stack, remove the host port mapping for improved security. If external access is required, restrict it to trusted internal IPs:

```yaml
services:
  postgres:
    ports:
      - "192.XXX.X.X:5432:5432"
```

### Health check

The Compose file defines a health check so dependent services wait until PostgreSQL is ready:

| Setting | Value |
|---------|-------|
| Command | `pg_isready -U <POSTGRES_USER> -d <POSTGRES_DB>` |
| Interval | 10 seconds |
| Timeout | 5 seconds |
| Retries | 5 |

## Integration

**`DATABASE_URL`** — used by the CDT backend to connect:

```
postgresql://<POSTGRES_USER>:<POSTGRES_PASSWORD>@postgres:5432/<POSTGRES_DB>
```

The hostname `postgres` resolves through Docker Compose internal networking.

**Port 5432** must not be publicly accessible in production. Restrict inbound access to trusted internal networks only.

## Related

- [Self-Hosting Overview](./overview.md)
- [Node / Next.js Application](./node-application.md) — connects via `DATABASE_URL`
- [Martin / PostGIS](./martin-postgis.md) — shares the same Postgres instance
