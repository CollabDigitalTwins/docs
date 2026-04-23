---
sidebar_position: 1
title: API Overview
description: How CDT's API layer is structured — the adapter pattern, authentication, and conventions shared across all routes.
---

# API Overview

CDT's backend exposes a REST-style API consumed exclusively by the frontend. All routes require an authenticated session via NextAuth.js. Access is gated by CASL permissions checked server-side against the user's role.

## Adapter pattern

CDT does not call API routes directly from components. Instead, components use hooks (`useBuildings`, `useSensor`, etc.) backed by SWR. The hooks call an `ApiAdapter` instance injected via `CoreHooksProvider`.

```
Component
  → useBuildings()              ← hook from src/core/hooks/
    → adapter.getBuildings()    ← ApiAdapter interface
      → fetch('/api/buildings') ← actual HTTP request
```

This means swapping the backend (e.g., for testing or a different deployment) only requires a new `ApiAdapter` implementation — components and hooks are unchanged.

The `ApiAdapter` interface is defined in `src/core/hooks/ports/apiAdapter.ts`.

## Authentication

All API routes require a valid NextAuth session. Unauthenticated requests return `401`.

## Permissions

Routes check CASL permissions server-side. The user's `Role.permissions` array is loaded from the database and a `MongoAbility` instance is built per request. Requests that fail the permission check return `403`.

See [Roles & Permissions](../authorization/authorization_roles_permissions.md) for the full permission model.

## Conventions

- All mutation routes (`POST`, `PUT`, `DELETE`) expect JSON bodies.
- List routes return arrays directly (not wrapped in a `data` envelope).
- IDs in URL segments are strings; the route handler parses them to the appropriate type.
- SWR keys use arrays (e.g., `["buildings"]`, `["building", id]`) — never URL strings.

## Routes

| Domain | Doc |
|--------|-----|
| Buildings | [buildings.md](./buildings.md) |
| Sites | [sites.md](./sites.md) |
| Files | [files.md](./files.md) |
| Sensors & Sensor Types | [sensors.md](./sensors.md) |
| Infrastructure | [infrastructure.md](./infrastructure.md) |
| Organizations | [organizations.md](./organizations.md) |
| Users | [users.md](./users.md) |
| Comments | [comments.md](./comments.md) |
| Open Data Portals | [open-data-portals.md](./open-data-portals.md) |

## Related

- [Hooks — Overview](../hooks/overview.md)
- [Authorization](../authorization/authorization_roles_permissions.md)
- [State Management](../architecture/state-management.md)
