---
sidebar_position: 1
title: API Overview
description: How CDT's API layer is structured — adapter pattern, authentication, conventions, and worked request/response examples.
---

# API Overview

CDT's backend exposes a REST-style API consumed primarily by the platform's own frontend. All routes require an authenticated session via NextAuth.js, and access is gated by CASL permissions checked server-side against the user's role.

## Internal vs external use

The API is **session-authenticated** and designed for first-party consumers — the CDT frontend, plugins, and trusted internal automations. There is no API-key or token-based public auth surface today, so direct programmatic use from third-party services requires a workaround (sign in headlessly, then reuse the session cookie).

Two integration patterns are supported in practice:

- **First-party plugins** — extend the platform inside the same browser session, using hooks and `PluginContext`. See [Plugins](../plugins/overview.md).
- **Trusted scripts** — server-side scripts that authenticate once and re-use the session for batch import/export.

A first-class external API surface (API keys, OAuth client credentials) is on the roadmap; track it in the [Changelog](../changelog.md).

## Adapter pattern

CDT does not call API routes directly from components. Instead, components use hooks (`useBuildings`, `useSensor`, etc.) backed by SWR. The hooks call an `ApiAdapter` instance injected via `CoreHooksProvider`.

```
Component
  → useBuildings()              ← hook from src/core/hooks/
    → adapter.getBuildings()    ← ApiAdapter interface
      → fetch('/api/buildings') ← actual HTTP request
```

This means swapping the backend (for testing or a different deployment) only requires a new `ApiAdapter` implementation — components and hooks are unchanged. The interface is defined in `src/core/hooks/ports/apiAdapter.ts`.

## Authentication

All API routes require a valid NextAuth session. Unauthenticated requests return `401`.

The session is carried in a `next-auth.session-token` cookie issued at sign-in. For programmatic use, sign in via `/api/auth/signin/credentials` and reuse the returned cookie.

## Permissions

Routes check CASL permissions server-side. The user's `Role.permissions` array is loaded from the database and an `Ability` instance is built per request. Requests that fail the permission check return `403`.

See [Authorization Overview](../authorization/overview.md) for the model and [Permission reference](../authorization/permission-reference.md) for the full matrix.

## Conventions

- All mutation routes (`POST`, `PUT`, `DELETE`) expect JSON bodies.
- List routes return arrays directly (not wrapped in a `data` envelope).
- IDs in URL segments are strings; route handlers parse them to the appropriate type.
- SWR keys use arrays — for example, `["buildings"]`, `["building", id]` — never URL strings.
- All routes are scoped to the user's active organization. Cross-organization queries return `403`.

## Status codes

| Status | Meaning |
|--------|---------|
| `200` | Success (GET, PUT). |
| `201` | Created (POST). |
| `204` | No content (DELETE). |
| `400` | Malformed request body or missing required fields. |
| `401` | Unauthenticated — sign in first. |
| `403` | Authenticated but the user's role lacks the required permission. |
| `404` | The resource does not exist or is in a different organization. |
| `409` | Conflict — typically a unique constraint violation. |
| `500` | Server error. The response body contains a request ID for support. |

## Worked example: list buildings

```bash
curl -X GET https://app.example.com/api/buildings \
  -H "Cookie: next-auth.session-token=<your-session-token>"
```

**Response (200):**

```json
[
  {
    "id": 1,
    "buildingName": "Main Building",
    "buildingLatitude": 45.421,
    "buildingLongitude": -75.690,
    "buildingType": ["Residential"],
    "buildingProjectPhase": "Operations_Phase"
  },
  {
    "id": 2,
    "buildingName": "Annex",
    "buildingLatitude": 45.423,
    "buildingLongitude": -75.692,
    "buildingType": ["Office"],
    "buildingProjectPhase": "Construction_Phase"
  }
]
```

## Worked example: create a building

```bash
curl -X POST https://app.example.com/api/buildings/create \
  -H "Cookie: next-auth.session-token=<your-session-token>" \
  -H "Content-Type: application/json" \
  -d '{
    "buildingData": {
      "buildingName": "New Building",
      "buildingLatitude": 45.421,
      "buildingLongitude": -75.690,
      "buildingType": ["Residential"]
    },
    "organizationId": "1"
  }'
```

**Response (200):**

```json
{
  "id": 3,
  "buildingName": "New Building",
  "buildingLatitude": 45.421,
  "buildingLongitude": -75.690,
  "buildingType": ["Residential"],
  "buildingProjectPhase": "Concept_Phase"
}
```

## Worked example: handling errors

```bash
curl -X POST https://app.example.com/api/buildings/create \
  -H "Content-Type: application/json" \
  -d '{}'
# 401 Unauthorized
{ "error": "Unauthenticated" }
```

```bash
# As a Viewer (no create permission)
curl -X POST .../api/buildings/create ...
# 403 Forbidden
{ "error": "Forbidden" }
```

## In this section

- [/api/buildings](./buildings.md)
- [/api/comments](./comments.md)
- [/api/data-analysis](./data-analysis.md)
- [/api/files](./files.md)
- [/api/infrastructure](./infrastructure.md)
- [/api/open-data-portals](./open-data-portals.md)
- [/api/organizations](./organizations.md)
- [/api/proxies](./proxies.md)
- [/api/sensors](./sensors.md)
- [/api/sites](./sites.md)
- [/api/users](./users.md)

## Related

- [Hooks — Overview](../hooks/overview.md)
- [Authorization Overview](../authorization/overview.md)
- [State Management](../architecture/state-management.md)
