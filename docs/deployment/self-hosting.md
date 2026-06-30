---
title: Self-Hosting
description: How to deploy the CDT platform on your own infrastructure using Docker or Podman.
sidebar_position: 2
---

# Self-Hosting

CDT is distributed as a containerized stack. All services start in the correct order via a single `docker-compose.yml` file — no manual orchestration required.

## Deployment Scenarios

Before you begin, decide how CDT will be accessed. The setup steps are the same in both cases, but the environment configuration differs.

### Local / Single-User (localhost)

Run CDT on your own machine for personal evaluation or development. All services are only reachable from that machine — no network exposure, no DNS work required. Use `http://localhost` URLs throughout your `.env`.

### Organization / Multi-User

Deploy CDT on a server so that multiple people can access it through a browser. This requires:

1. **A host machine with a stable IP address** — a server on your internal network, or a cloud VM (Azure, AWS, GCP, DigitalOcean, etc.)
2. **Network-reachable URLs for two services** — CDT has two browser-accessible services: the app (port 6012) and file storage (port 9000). Browsers must be able to reach both. There are two common approaches:
   - **Single hostname, multiple ports** — expose the host's ports directly. No reverse proxy needed. URLs look like `http://cdt.yourorg.com:9000`. Simpler to set up; TLS is harder to add later.
   - **Subdomains + reverse proxy** — assign a subdomain to each service (`cdt.yourorg.com`, `files.yourorg.com`), point both at the same server IP, and use a reverse proxy to route traffic to the right container. Clean URLs, TLS handled automatically. See [DNS Configuration](#dns-configuration) and [Reverse Proxy](#reverse-proxy) below.
3. **Updated environment variables** — replace all `localhost` URLs in your `.env` with the real hostnames and ports for your chosen approach. See the notes in [Environment Configuration](#environment-configuration) below.

---

## Prerequisites

These instructions assume you already have a host environment ready to run containers — either a Linux/Windows server you control, or a cloud platform such as Azure, AWS, GCP, or DigitalOcean with a virtual machine provisioned and accessible over SSH. CDT does not prescribe a specific cloud provider; any host that can run a recent version of Docker Engine and Docker Compose (or Podman with Podman Compose) will work.

If you are evaluating providers or sizing a VM, the stack has been tested on a 4 vCPU / 8 GB RAM instance with at least 50 GB of persistent disk for typical pilot deployments. Production workloads with large point cloud or BIM datasets require additional storage proportional to your asset volume.

---

## Stack Components

| Service | Purpose |
|---------|---------|
| `postgres` | PostgreSQL 15 with PostGIS 3.4 — relational and geospatial data |
| `minio` | Object storage for BIM, point clouds, and GIS files |
| `cdt` | Core application — API, business logic, and web UI |
| `minio-init` | One-time init job: creates the public buckets required for the app to function |
| `migrate` | One-time init job: applies pending database migrations on startup |

### Init Services

Two short-lived services run automatically on every `docker compose up` and exit when their work is done:

- **minio-init** — waits for MinIO to be healthy, then creates the public buckets required for the app to function. Safe to re-run; it skips creation for any bucket that already exists.
- **migrate** — waits for PostgreSQL to be ready, then runs `prisma migrate deploy` to apply any pending schema migrations. This is idempotent and safe across upgrades.

---

## Container Engine Options

### Option 1 — Docker (recommended)

**Linux headless / server:**
Install Docker Engine and Compose CLI: [docs.docker.com/engine/install](https://docs.docker.com/engine/install)

**Linux GUI or cross-platform:**
Install Docker Desktop (includes Engine + Compose): [docs.docker.com/desktop](https://docs.docker.com/desktop/)

### Option 2 — Podman

If Docker is not permitted on your infrastructure, Podman is a compatible alternative.

- Install Podman: [podman.io/getting-started/installation](https://podman.io/getting-started/installation)
- Install Podman Compose: [github.com/containers/podman-compose](https://github.com/containers/podman-compose)

The `docker-compose.yml` included with CDT has already been adapted for Podman: volume mounts use the `:Z` SELinux relabeling flag required on Fedora/RHEL systems. You should be able to run `podman-compose up -d` with the same `.env` setup described below.

That said, Podman compatibility is best-effort. Networking behavior, `depends_on` condition handling, and rootless container permissions can differ between Podman versions and Linux distributions. If you encounter issues, consult the [Podman Compose documentation](https://github.com/containers/podman-compose) for your specific environment.

---

## Environment Configuration

Before starting the stack, create a `.env` file in the project root. You can use `.env.example` as a starting point:

```bash
cp .env.example .env
```

Then fill in the values described in the sections below.

> **Organization deployments:** anywhere a variable takes a `localhost` URL in the examples below, replace it with the corresponding subdomain you configured in [DNS Configuration](#dns-configuration).

### Required Variables

These must be set before the stack will start correctly.

#### Authentication

| Variable | Description |
|----------|-------------|
| `AUTH_SECRET` | Random secret used to sign session tokens. Generate with: `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | Set to `true` when running behind a reverse proxy or on a non-localhost domain |
| `AUTH_URL` | The public URL of your CDT deployment — `http://localhost:6012` for local use, or `https://cdt.yourorg.com` for org deployments |

#### Database

| Variable | Description |
|----------|-------------|
| `POSTGRES_USER` | PostgreSQL superuser username |
| `POSTGRES_PASSWORD` | PostgreSQL superuser password |
| `POSTGRES_DB` | Database name |
| `DATABASE_URL` | Full Prisma connection string, e.g. `postgresql://user:pass@postgres:5432/db` |

#### Object Storage (MinIO)

| Variable | Description |
|----------|-------------|
| `MINIO_ROOT_USER` | MinIO admin username |
| `MINIO_ROOT_PASSWORD` | MinIO admin password |
| `S3_ACCESS_KEY` | Access key for the app to authenticate with MinIO (set equal to `MINIO_ROOT_USER` for self-hosted) |
| `S3_ACCESS_SECRET` | Secret key for the app to authenticate with MinIO (set equal to `MINIO_ROOT_PASSWORD` for self-hosted) |
| `MINIO_ENDPOINT` | MinIO host:port without protocol — set to match `MINIO_URL` (e.g. `host.docker.internal:9000`) |
| `MINIO_USE_SSL` | `true` if MinIO is behind TLS, `false` for local/internal setups |
| `MINIO_REGION` | Region string, e.g. `us-east-1` (arbitrary for self-hosted MinIO) |
| `MINIO_URL` | The URL the app uses to connect to MinIO and generate presigned URLs. **This hostname must be reachable by browsers** — presigned upload and download URLs embed it directly. Do not use `http://minio:9000` — that is the internal Docker network name and browsers cannot resolve it. Choose based on your environment: **Mac/Windows (Docker Desktop):** `http://host.docker.internal:9000` — Docker Desktop automatically resolves this to your host machine. **Linux (local):** `host.docker.internal` is not available by default; use your machine's LAN IP instead (e.g. `http://192.168.1.100:9000`), or add `extra_hosts: ["host.docker.internal:host-gateway"]` under the `cdt` service in `docker-compose.public.yml` and then use `http://host.docker.internal:9000`. **Server deployment:** use the public hostname and port (e.g. `http://cdt.yourorg.com:9000` or `https://files.yourorg.com`). |
| `MINIO_BUCKET_URL` | Public base URL browsers use to load stored assets (e.g. org logos). For local use: `http://localhost:9000`. For org deployments: the public MinIO URL (same value as `MINIO_URL` in most setups). |
| `ALLOWED_ORIGIN` | The CDT app URL, used to configure MinIO's CORS policy so the browser can upload and download files. Set to your `AUTH_URL` value (e.g. `http://localhost:6012` or `https://cdt.yourorg.com`). Defaults to `*` if unset, which is fine for local testing but should be locked down for org deployments. |

> **Presigned URLs and browser reachability:** CDT generates presigned MinIO URLs server-side for file uploads and downloads. These URLs are sent to the browser, which then contacts MinIO directly. If `MINIO_URL` is set to an internal Docker hostname like `minio:9000`, presigned URLs will contain that hostname and fail in the browser. Always set `MINIO_URL` to a hostname your users' browsers can reach.

#### reCAPTCHA

CDT uses Google reCAPTCHA v2 on login and registration forms. Register your domain at [google.com/recaptcha/admin](https://www.google.com/recaptcha/admin) to obtain keys.

> **Note for local deployments:** reCAPTCHA only validates requests from registered domains. For `localhost` testing, add `localhost` as an allowed domain in your reCAPTCHA console settings.

| Variable | Description |
|----------|-------------|
| `RECAPTCHA_SITE_KEY` | Public site key (sent to the browser) |
| `RECAPTCHA_SECRET_KEY` | Private secret key (server-side verification only — never expose this) |

#### Email / SMTP

CDT sends one-time passcodes for multi-factor authentication via email. You must configure an SMTP relay for logins to work.

| Variable | Description |
|----------|-------------|
| `EMAIL_HOST` | SMTP server hostname, e.g. `smtp.example.com` |
| `EMAIL_PORT` | SMTP port, typically `465` (SSL) or `587` (STARTTLS) |
| `EMAIL_FROM` | The sender address that appears on outgoing emails |
| `EMAIL_USER` | SMTP authentication username |
| `EMAIL_PASS` | SMTP authentication password |

### Optional Variables

#### Google OAuth (account linking and social login)

If you want users to sign in with a Google account, create an OAuth 2.0 client in the [Google Cloud Console](https://console.cloud.google.com/) and add your deployment's callback URL (`<AUTH_URL>/api/auth/callback/google`) as an authorized redirect URI.

> **Note for org deployments:** Google OAuth does not accept `localhost` as a redirect URI. You must register your real domain (e.g. `https://cdt.yourorg.com/api/auth/callback/google`) in the Google Cloud Console.

Leave these unset to disable Google login entirely.

| Variable | Description |
|----------|-------------|
| `AUTH_GOOGLE_ID` | Google OAuth client ID |
| `AUTH_GOOGLE_SECRET` | Google OAuth client secret |

#### Geocoding (address search)

The map's search bar resolves addresses and place names through a geocoding provider. CDT selects one from the environment, so a self-hosted deployment can run entirely key-free if preferred. Providers are tried in priority order:

| Priority | When | Provider |
|----------|------|----------|
| 1 | `GEOCODE_EARTH_API_KEY` is set | [Geocode Earth](https://geocode.earth) — hosted Pelias, highest-quality results |
| 2 | `GEOCODER_URL` is set | Your own [Pelias](https://pelias.io) instance — no key, identical response format |
| 3 | neither is set | Free public OpenStreetMap services — [Photon](https://photon.komoot.io) for autocomplete, [Nominatim](https://nominatim.openstreetmap.org) for reverse geocoding |

| Variable | Description |
|----------|-------------|
| `GEOCODE_EARTH_API_KEY` | Geocode Earth API key. Takes priority when set. |
| `GEOCODER_URL` | Base URL of a self-hosted Pelias-compatible endpoint, e.g. `https://pelias.example.com`. No key required. |
| `PHOTON_URL` | Overrides the Photon autocomplete endpoint. Defaults to the public `https://photon.komoot.io`. |
| `NOMINATIM_URL` | Overrides the Nominatim reverse-geocoding endpoint. Defaults to the public `https://nominatim.openstreetmap.org`. |

**Production note:** the public Photon and Nominatim instances are community-run and rate-limited — fine for evaluation and small pilots, but heavier deployments should run their own Pelias (single provider, best quality) or self-host Photon/Nominatim and point `PHOTON_URL` / `NOMINATIM_URL` at them.

---

## Starting the Full Stack

From the directory containing `docker-compose.public.yml` and your `.env` file:

```bash
docker compose -f docker-compose.public.yml up -d
```

This pulls the pre-built CDT images from the GitHub Container Registry and starts all services. No source code or build tooling is required.

---

## Instance Initialization

Once the stack is running, open your CDT URL in a browser (`http://localhost:6012` for local deployments, or your configured domain for org deployments). If no organization has been set up yet, you will be redirected to the setup page at `/organization-config`.

Fill in the initialization form:

| Field | Description |
|-------|-------------|
| Organization name | 3–63 characters, lowercase letters, numbers, dots, and hyphens only, e.g. `my-org` |
| Organization title | The display name for your organization |
| Organization description | A short description shown in the UI |
| Languages | Checkboxes: English (default), French, Spanish |
| 3D Viewers | Checkboxes for which viewer types to enable: Map (always on), BIM (default on) |
| Data | Checkboxes for which data types to enable: Sites, Buildings, Files (all default on) |
| Admin name | Full name for the initial admin account |
| Admin email | Email address for the initial admin account |
| Password | Password for the initial admin account (minimum 8 characters) |

After submitting, you will be redirected to the sign-in page for your organization. The setup page is only accessible when no organization exists — once initialized, it redirects to sign-in automatically.

Change the admin password immediately after your first login if you shared the credentials with anyone else during setup.

---

## Port Map

| Service | Host Port | Container Port |
|---------|-----------|----------------|
| PostgreSQL | 5433 | 5432 |
| MinIO API | 9000 | 9000 |
| MinIO Console | 9001 | 9001 |
| CDT Application | 6012 | 3000 |

For local deployments, these ports are accessed directly (e.g. `http://localhost:6012`). For org deployments behind a reverse proxy, these ports stay internal to the host — only ports 80 and 443 are exposed to the network, and the proxy routes traffic to the right container.

---

## DNS Configuration

*This section applies to organization deployments using the subdomain approach. If you are using single-hostname + port URLs, skip to [Starting the Full Stack](#starting-the-full-stack).*

With the subdomain approach, all three subdomains point to the **same server IP** — one machine running all three containers. The reverse proxy reads the hostname on each incoming request and routes it to the correct container.

Create three DNS **A records** at your registrar or DNS provider (Cloudflare, Route 53, etc.):

| Record | Type | Value |
|--------|------|-------|
| `cdt.yourorg.com` | A | `<your server's public IP>` |
| `files.yourorg.com` | A | `<your server's public IP>` |

Replace `yourorg.com` with your actual domain. The subdomain names (`cdt`, `tiles`, `files`) are conventions — use whatever names make sense to you, as long as they match the URLs you set in your `.env`.

**Internal/VPN-only deployments:** use your internal DNS server to create the same records pointing to the server's **private IP** instead. Users on the LAN or VPN will resolve the names without any public DNS entry.

---

## Reverse Proxy

*This section applies to the subdomain approach only. If you are exposing services directly on their ports (6012, 9000), skip to [Starting the Full Stack](#starting-the-full-stack).*

A reverse proxy sits in front of the Docker stack and handles two things: routing incoming requests to the right container based on the hostname, and terminating HTTPS/TLS so that all traffic is encrypted in transit.

[Caddy](https://caddyserver.com) is the recommended option — it obtains and renews TLS certificates from Let's Encrypt automatically with no extra configuration. Install Caddy on the host machine, then create a `Caddyfile` in any convenient location:

```
cdt.yourorg.com {
    reverse_proxy localhost:6012
}

files.yourorg.com {
    reverse_proxy localhost:9000
}
```

Start Caddy (or configure it as a systemd service so it starts on boot):

```bash
caddy start --config /path/to/Caddyfile
```

Caddy will automatically issue TLS certificates for all three domains on first request. No additional TLS configuration is needed.

### Firewall

On the host machine, ports **80** (HTTP, used by Caddy for certificate issuance and redirect) and **443** (HTTPS) should be open to the network. The application ports (6012, 9000, 9001, 5433) should be firewalled from external access — all traffic reaches them through Caddy on the same machine.

---

## Single-Hostname Setup (Port-Based)

*This section applies to the single-hostname + port approach.*

If you are not using a reverse proxy, expose the three service ports directly on your host and set your `.env` URLs accordingly:

| Service | Port | Example URL |
|---------|------|-------------|
| CDT app | 6012 | `http://cdt.yourorg.com:6012` |
| MinIO (files) | 9000 | `http://cdt.yourorg.com:9000` |

Set `AUTH_URL` and `MINIO_URL` / `MINIO_BUCKET_URL` to these URLs in your `.env`. Ensure your firewall allows inbound traffic on all three ports.

Note that this approach uses plain HTTP unless you separately configure TLS on each port. For internal/VPN-only networks where traffic does not leave a trusted network, this is often acceptable.

---

## Stopping the Stack

To stop all running containers without losing any data:

```bash
docker compose -f docker-compose.public.yml down
```

This removes the containers but preserves the named volumes (`postgres_data`, `minio_data`), so your database and uploaded files survive the restart.

### Removing All Data

> **Warning:** This is irreversible. All database records, uploaded files, and MinIO objects will be permanently deleted.

To stop the stack **and delete all volumes**:

```bash
docker compose -f docker-compose.public.yml down -v
```

Use this only when you want a completely clean slate — for example, resetting a test environment or decommissioning the deployment entirely.

---

## Upgrading

To update CDT to a newer version, pull the latest images and restart the stack:

```bash
docker compose -f docker-compose.public.yml pull
docker compose -f docker-compose.public.yml up -d
```

The `migrate` service runs automatically on startup and applies any new database migrations before the application comes back up. No manual migration step is needed.

---

## Service List

All services are documented on a single [Services](./services.md) page. Jump directly to a section:

- [PostgreSQL](./services.md#postgresql)
- [MinIO](./services.md#minio)
- [Node / Next.js Application](./services.md#node--nextjs-application)
- [Open Data Service](./services.md#open-data-service)
