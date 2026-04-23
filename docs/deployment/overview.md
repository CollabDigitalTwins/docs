---
title: Self-Hosting Overview
description: How to deploy the CDT platform on your own infrastructure using Docker or Podman.
sidebar_position: 1
---

# Self-Hosting Overview

CDT is distributed as a containerized stack. All services start in the correct order via a single `docker-compose.yml` file — no manual orchestration required.

## Stack Components

| Layer | Service | Purpose |
|-------|---------|---------|
| Data | PostgreSQL 15 | Relational application data |
| Data | PostGIS 3.4 | Geospatial database extension |
| Data | MinIO | Object storage (BIM, point clouds, GIS files) |
| Tile Server | Martin | Vector tile server consuming PostGIS spatial tables |
| Backend | Node / Next.js | Core API, business logic, web application |
| Auth | NextAuth.js | Authentication and session management |
| Mapping | MapLibre | Frontend vector map rendering |
| Data Integration | Open Data Service | Open data portal registry and dataset discovery |

## Container Engine Options

### Option 1 — Docker (recommended)

**Linux headless / server:**
Install Docker Engine and Compose CLI: [docs.docker.com/engine/install](https://docs.docker.com/engine/install)

**Linux GUI or cross-platform:**
Install Docker Desktop (includes Engine + Compose): [docs.docker.com/desktop/setup/install/linux](https://docs.docker.com/desktop/setup/install/linux/)

### Option 2 — Podman

If Docker is not permitted on your infrastructure, Podman is a compatible alternative.

- Install Podman: [podman.io/getting-started/installation](https://podman.io/getting-started/installation)
- Install Podman Compose: [github.com/containers/podman-compose](https://github.com/containers/podman-compose)

Most Docker Compose files work with `podman-compose` without changes. Some networking or volume features may behave slightly differently.

## Starting the Full Stack

From the root directory of the project (where `docker-compose.yml` lives):

```bash
docker compose up -d --build
```

On first run, apply database migrations once PostgreSQL is healthy:

```bash
docker compose run --rm migrate
```

## Port Map

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| PostgreSQL | 5432 | 5432 |
| MinIO API | 9000 | 9000 |
| MinIO Console | 9001 | 9001 |
| Martin (tiles) | 6080 | 3000 |
| CDT Application | 6012 | 3000 |

## Start Here

- [PostgreSQL](./postgresql.md)
- [MinIO](./minio.md)
- [Martin / PostGIS](./martin-postgis.md)
- [Node / Next.js Application](./node-application.md)
- [Open Data Service](./open-data-service.md)

## Related

- [CDT Hosted (SaaS)](./cdt-hosted.md) — prefer not to manage infrastructure yourself?
- [Architecture Overview](../architecture/overview.md)
