---
title: Production Deployment
description: TLS, reverse proxy, environment variables, health checks, and monitoring guidance for running CDT in production.
sidebar_position: 3
---

# Production Deployment

This page covers what is different about a production CDT deployment compared with the development setup in [Self-Hosting](./self-hosting.md). It assumes you have already brought the stack up locally and want to expose it to the public internet safely.

## Sizing

| Workload | vCPU | RAM | Disk | Notes |
|----------|------|-----|------|-------|
| Pilot / single team | 4 | 8 GB | 100 GB | Adequate for evaluation and small datasets. |
| Production / mid-size | 8 | 16 GB | 500 GB | Handles federated BIM models and growing point cloud archives. |
| Production / large | 16 | 32 GB+ | 2 TB+ | Multiple concurrent users with frequent IFC ingest. |

Storage scales with the size of your IFC, point cloud, and document corpus. Plan for 2× the raw asset size to leave room for the converted Fragments and Potree formats.

## Reverse proxy and TLS

CDT must run behind a reverse proxy with TLS in production. Direct exposure of the application or MinIO is not safe. The most common choices are **Caddy** (simplest), **nginx** (most familiar), and **Traefik** (best Docker integration).

### Caddy example

`Caddyfile`:

```caddy
app.example.com {
    reverse_proxy cdt:3000
    encode gzip zstd
}

minio.example.com {
    reverse_proxy minio:9000
    encode gzip zstd
}

tiles.example.com {
    reverse_proxy martin:3000
    encode gzip zstd
}
```

Caddy obtains and renews Let's Encrypt certificates automatically.

### nginx example (sketch)

```nginx
server {
    listen 443 ssl http2;
    server_name app.example.com;

    ssl_certificate     /etc/letsencrypt/live/app.example.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/app.example.com/privkey.pem;

    client_max_body_size 2g;   # IFC and point cloud uploads can be large

    location / {
        proxy_pass         http://cdt:3000;
        proxy_set_header   Host              $host;
        proxy_set_header   X-Real-IP         $remote_addr;
        proxy_set_header   X-Forwarded-For   $proxy_add_x_forwarded_for;
        proxy_set_header   X-Forwarded-Proto $scheme;
    }
}
```

Use `certbot` or another ACME client to mint certificates.

### Required env-var changes for the proxy

When CDT is behind any reverse proxy:

```env
AUTH_TRUST_HOST=true
AUTH_URL=https://app.example.com
NEXT_PUBLIC_MINIO_BUCKET_URL=https://minio.example.com
NEXT_PUBLIC_MARTIN_SERVER_URL=https://tiles.example.com
MINIO_USE_SSL=true
```

Without these, NextAuth refuses to issue cookies and the browser rejects MinIO assets as mixed-content.

## Production environment variables

The full list is in the [Environment variables reference](../getting-started/environment-variables.mdx). The keys most likely to differ from `.env.example`:

| Key | Production value |
|-----|------------------|
| `AUTH_SECRET` | 32+ random bytes — `openssl rand -base64 32` |
| `AUTH_TRUST_HOST` | `true` |
| `AUTH_URL` | public application URL |
| `MINIO_USE_SSL` | `true` |
| `POSTGRES_PASSWORD` | strong unique value |
| `MINIO_ROOT_PASSWORD` | strong unique value |
| `S3_ACCESS_SECRET` | strong unique value, ideally a service-account key rather than the root credentials |

Store secrets outside the repository. Docker Compose can pull them from a `.env` file with `chmod 600`; Kubernetes deployments should use `Secret` objects.

## Health checks

The Compose stack ships with health checks that gate dependent services. You can also expose them to your monitoring system:

| Service | Health endpoint or command |
|---------|----------------------------|
| PostgreSQL | `pg_isready -U $POSTGRES_USER -d $POSTGRES_DB` |
| MinIO | `GET /minio/health/live` |
| Martin | `GET /health` |
| CDT app | `GET /api/health` (returns `{"status":"ok"}`) |

Wire each into your uptime monitor. A failed CDT app health check should page the on-call; a failed MinIO health check is a data-availability issue and should also page.

## Logging

Each container writes to stdout. Aggregate with whatever you already use — Loki, ELK, CloudWatch, Datadog. The most useful labels are `service` (cdt, postgres, minio, martin), `level` (info, warn, error), and `request_id` (set by the application on every API request).

For a self-hosted, low-cost stack, **Promtail → Loki → Grafana** works well and ships as Docker images.

## Metrics and dashboards

CDT does not expose Prometheus metrics out of the box. The recommended approach:

- **Application metrics** — sidecar or scrape the Node process with [`prom-client`](https://github.com/siimon/prom-client) once added.
- **Database metrics** — use [`postgres_exporter`](https://github.com/prometheus-community/postgres_exporter).
- **Object storage metrics** — MinIO exposes Prometheus metrics natively at `/minio/v2/metrics/cluster`.
- **Tile server** — Martin exposes simple metrics at `/metrics`.

A starter Grafana dashboard for the stack lives at `https://github.com/collabdt/ops-dashboards`.

## Backups

The two stateful services need regular backups:

**PostgreSQL.** Use `pg_dump` on a cron schedule:

```bash
docker compose exec -T postgres pg_dump -U "$POSTGRES_USER" -Fc "$POSTGRES_DB" \
  > "/backups/cdt-$(date +%F).dump"
```

Test restore quarterly. Store off-host.

**MinIO.** Use [`mc mirror`](https://min.io/docs/minio/linux/reference/minio-mc/mc-mirror.html) to replicate buckets to a second MinIO instance or any S3-compatible service.

Buildings and sites are reproducible from the database; uploaded files are not. Treat MinIO data as authoritative.

## Updates and migrations

```bash
git pull
docker compose pull
docker compose build cdt
docker compose run --rm migrate     # apply schema changes
docker compose up -d
```

Always run migrations *before* starting the new application version. The migration container exits cleanly when complete.

For breaking changes, see the [Changelog](../changelog.md).

## Hardening checklist

- [ ] Reverse proxy with TLS for `app.*`, `minio.*`, and `tiles.*` hostnames
- [ ] PostgreSQL port not exposed to the public internet
- [ ] MinIO `9001` console restricted to administrator IPs
- [ ] All `.env` files have `chmod 600`
- [ ] `AUTH_SECRET` rotated from any value used during testing
- [ ] Strong unique passwords for PostgreSQL and MinIO root
- [ ] Database backups run on schedule and a restore has been tested
- [ ] Health checks wired into your uptime monitor
- [ ] Logs aggregated to a central system

## Related

- [Self-Hosting](./self-hosting.md)
- [Services reference](./services.md)
- [Environment variables reference](../getting-started/environment-variables.mdx)
- [CDT Hosted (managed deployment)](./cdt-hosted.md)
