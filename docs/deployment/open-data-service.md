---
title: Open Data Service
description: Installing and configuring the CDT open data portal registry service.
sidebar_position: 6
---

# Open Data Service

**Purpose:** Registry of open data portals — municipal, provincial, organizational, and federal. Enables dataset discovery and integration via geographic and categorical filtering.

## Prerequisites

- PostgreSQL 15+ running
- Docker and Docker Compose
- CDT Node application deployed (the service is exposed through the Node REST API)

## Installation

No separate installation required. The service is provisioned via Prisma migrations and exposed through the existing Node API.

```bash
# 1. Start PostgreSQL
docker compose up -d postgres

# 2. Run migrations (creates the OpenDataPortal table)
docker compose run --rm migrate

# 3. Start the CDT application
docker compose up -d cdt
```

## Configuration

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

## Integration

**Port 6012 (Node Application):** REST API endpoint for portal metadata.

| Operation | Access |
|-----------|--------|
| `GET` (retrieve portals by province, municipality, group, or ID) | Public |
| `POST` / `PATCH` / `DELETE` | Authenticated users only |

## Related

- [Self-Hosting Overview](./overview.md)
- [Node / Next.js Application](./node-application.md) — hosts the REST API
- [PostgreSQL](./postgresql.md) — data store
