---
title: Self-Hosting
description: How to deploy the CDT platform on your own infrastructure using Docker or Podman.
sidebar_position: 2
---

# Self-Hosting

CDT is distributed as a containerized stack. All services start in the correct order via a single `docker-compose.yml` file — no manual orchestration required.

## Prerequisites

These instructions assume you already have a host environment ready to run containers — either a Linux/Windows server you control, or a cloud platform such as Azure, AWS, GCP, or DigitalOcean with a virtual machine provisioned and accessible over SSH. CDT does not prescribe a specific cloud provider; any host that can run Docker Engine 24.0+ (or Podman v5.7.1) and Docker Compose will work.

If you are evaluating providers or sizing a VM, the stack runs comfortably on a 4 vCPU / 8 GB RAM instance with at least 50 GB of persistent disk for typical pilot deployments. Production workloads with large point cloud or BIM datasets require additional storage proportional to your asset volume.

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

## Port Map

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| PostgreSQL | 5433 | 5432 |
| MinIO API | 9000 | 9000 |
| MinIO Console | 9001 | 9001 |
| Martin (tiles) | 6080 | 3000 |
| CDT Application | 6012 | 3000 |

## Geocoding (address search)

The map's search bar resolves addresses and place names through a geocoding provider. CDT selects one from the environment, so a self-hosted deployment can run entirely key-free if you want. Providers are tried in priority order:

| Priority | When | Provider |
|----------|------|----------|
| 1 | `NEXT_PUBLIC_GEOCODE_EARTH_API_KEY` is set | [Geocode Earth](https://geocode.earth) — hosted Pelias, highest-quality results |
| 2 | `NEXT_PUBLIC_GEOCODER_URL` is set | Your own [Pelias](https://pelias.io) instance — no key, identical response format |
| 3 | neither is set | Free public OpenStreetMap services — [Photon](https://photon.komoot.io) for autocomplete, [Nominatim](https://nominatim.openstreetmap.org) for reverse geocoding |

| Variable | Description |
|----------|-------------|
| `NEXT_PUBLIC_GEOCODE_EARTH_API_KEY` | Geocode Earth API key. Takes priority when set. |
| `NEXT_PUBLIC_GEOCODER_URL` | Base URL of a self-hosted Pelias-compatible endpoint, e.g. `https://pelias.example.com`. No key required. |
| `NEXT_PUBLIC_PHOTON_URL` | Overrides the Photon autocomplete endpoint. Defaults to the public `https://photon.komoot.io`. |
| `NEXT_PUBLIC_NOMINATIM_URL` | Overrides the Nominatim reverse-geocoding endpoint. Defaults to the public `https://nominatim.openstreetmap.org`. |

**Production note:** the public Photon and Nominatim instances are community-run and rate-limited — fine for evaluation and small pilots, but heavier deployments should run their own Pelias (single provider, best quality) or self-host Photon/Nominatim and point the URLs above at them.

## Service List

All services are documented on a single [Services](./services.md) page. Jump directly to a section:

- [PostgreSQL](./services.md#postgresql)
- [MinIO](./services.md#minio)
- [Martin / PostGIS](./services.md#martin--postgis)
- [Node / Next.js Application](./services.md#node--nextjs-application)
- [Open Data Service](./services.md#open-data-service)
