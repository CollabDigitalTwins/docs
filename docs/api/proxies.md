---
title: /api/ckanProxy and /api/opendatasoftProxy
description: Server-side proxies that fetch data from external open data portals on the client's behalf.
category: api
status: draft
last_updated: 2026-04-29
---

# Proxy Routes

CDT proxies its calls to external open data portals through server-side routes. This solves three problems at once:

- **CORS** — many portals do not return permissive CORS headers, so browsers block direct calls. The proxy makes the request server-to-server.
- **Credential hiding** — when a portal requires an API key, the key lives in server env vars and never reaches the browser.
- **Rate limiting** — a single backend can throttle and cache external requests cleanly.

Two proxy routes exist: one for [CKAN](https://ckan.org/) portals and one for [Opendatasoft](https://www.opendatasoft.com/).

All routes require an authenticated CDT session.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/ckanProxy` | Proxies a request to a CKAN portal. |
| `GET` | `/api/opendatasoftProxy` | Proxies a request to an Opendatasoft portal. |

---

## GET `/api/ckanProxy`

Forwards a request to a CKAN portal and returns the raw response body. The platform consults the `OpenDataPortal` table to validate that the target portal is registered.

### Query parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `portalId` | integer | yes | ID of a registered `OpenDataPortal` record. |
| `endpoint` | string | yes | The CKAN action endpoint (for example, `package_search`). |
| `query` | string | no | Query string passed through to CKAN's `q` parameter. |
| `rows` | integer | no | Maximum results to return. Defaults to 100. |

### Authentication

Requires permission: `{ action: "read", subject: "OpenDataPortal" }`.

### Example

```bash
curl "https://app.example.com/api/ckanProxy?portalId=1&endpoint=package_search&query=building" \
  -H "Cookie: next-auth.session-token=<token>"
```

**Response (200):** the raw CKAN response.

```json
{
  "success": true,
  "result": {
    "count": 42,
    "results": [
      {
        "id": "abc-123",
        "title": "Building footprints",
        "resources": [
          { "url": "https://...geojson", "format": "GeoJSON" }
        ]
      }
    ]
  }
}
```

### Error responses

| Status | Meaning |
|--------|---------|
| `400` | Missing or invalid `portalId` / `endpoint`. |
| `401` | Unauthenticated. |
| `403` | The user lacks `read: OpenDataPortal`. |
| `404` | The portal ID does not exist. |
| `502` | The upstream portal returned an error or was unreachable. |

---

## GET `/api/opendatasoftProxy`

Same shape as the CKAN proxy, but targets Opendatasoft's record-search API.

### Query parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `portalId` | integer | yes | ID of a registered `OpenDataPortal` record. |
| `dataset` | string | yes | Opendatasoft dataset slug. |
| `query` | string | no | Free-text query. |
| `rows` | integer | no | Max results. Defaults to 100. |

### Example

```bash
curl "https://app.example.com/api/opendatasoftProxy?portalId=2&dataset=parcs&query=parc" \
  -H "Cookie: next-auth.session-token=<token>"
```

**Response (200):**

```json
{
  "total_count": 18,
  "records": [
    {
      "recordid": "…",
      "fields": {
        "name": "Parc Lafontaine",
        "geom": { "type": "Point", "coordinates": [-73.57, 45.52] }
      }
    }
  ]
}
```

---

## Caching

Both proxy routes apply a short server-side cache (default 5 minutes per `(portalId, endpoint, query)` tuple) to avoid hammering upstream portals during heavy map interaction. Cache-control headers reflect this — the browser also caches per its standard rules.

## Adding a new portal

Use [`/api/open-data-portals`](./open-data-portals.md) to register a new portal record. Once registered, the same proxy routes will accept its `portalId`. No code changes are needed for a new CKAN- or Opendatasoft-compliant portal.

## Related

- [/api/open-data-portals](./open-data-portals.md)
- [Concepts → Open Data Portals](../concepts/open-data-portals.md)
- [Datasets & Open Data guide](../guides/datasets-and-open-data.md)
