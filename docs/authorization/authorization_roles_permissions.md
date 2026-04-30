---
title: Roles, Permissions & CASL
description: How the CDT authorization engine works internally — Prisma storage, CASL ability construction, and server- and client-side enforcement.
sidebar_position: 4
displayed_sidebar: developerSidebar
---

# Roles, Permissions & CASL

This page is for **developers** working on the CDT authorization engine itself. It explains how roles and permissions are stored, how [CASL](https://casl.js.org) builds an `Ability` instance from them, and how that ability is enforced on the API and UI layers.

For the conceptual model, see [Authorization Overview](./overview.mdx). For UI tasks, see [Managing roles and permissions](./managing-roles.mdx).

## Architecture summary

CDT uses **role-based access control (RBAC)** scoped to organizations:

- **Prisma** stores roles and permissions in PostgreSQL.
- **CASL** is the authorization engine — it converts stored permissions into a queryable `Ability` instance.
- **Server-side checks** in API routes are the authoritative gate.
- **Client-side checks** in components hide and disable controls for the current user.

## Storage (Prisma)

Roles are represented by the `Role` entity. Each `User` has a foreign key to a `Role` scoped to an `Organization`. Permissions are stored as a JSON array on each role:

```json
[
  { "action": "read", "subject": "Building" },
  { "action": "update", "subject": "Building" }
]
```

| Field | Description |
|-------|-------------|
| `action` | The verb the user can perform — `read`, `create`, `update`, `delete`, or `manage`. |
| `subject` | The resource the action applies to — `Building`, `Site`, `User`, etc. |

CASL rules are derived from this data at request time.

## CASL: building an Ability

CDT chose CASL because it offers:

- A simple API for defining and checking rules — `ability.can(action, subject)`.
- A shared authorization model usable on both server and client.
- A path from simple RBAC today to attribute- and condition-based rules later, without changing call sites.

The construction flow:

1. **Fetch permissions** for the current user and organization — `getUserPermissions(userId, orgId)`.
2. **Build the rule set** with CASL's `AbilityBuilder` — `buildAbilityFromPermissions(perms)`.
3. **Return the ability** — server code uses it directly; client code receives it via `PermissionsProvider`.

## Enforcing permissions server-side

Sensitive operations gate on `ability.can(...)` before any mutation:

```ts
if (!ability.can("read", "Building")) {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}
```

This is the authoritative check. Bypassing the UI does not bypass it — direct API calls hit the same gate.

## Enforcing permissions client-side

The same ability instance, exposed via the `PermissionsProvider` context, drives UI affordances:

```tsx
{ability.can("create", "Organization") && (
  <Button>Create Organization</Button>
)}
```

Client-side checks improve UX (no users see buttons that would 403) but cannot replace API enforcement, because client code can be modified or bypassed.

## Internal types

| Type | Source | Purpose |
|------|--------|---------|
| `MongoAbility` | `@casl/ability` | The `Ability` instance type. CDT uses the Mongo-style query syntax for forward compatibility with conditional rules. |
| `BuildingOnOrganizations` | `prisma/schema.prisma` | Many-to-many bridge between `Building` and `Organization`. Used when scoping building queries to a user's organization. |
| `Role.permissions` | `prisma/schema.prisma` | The `Json` column where the `(action, subject)` array lives. |

## Adding a new subject

When a new entity is added to the data model, integrate it with the authorization system:

1. Add the entity name to the `subject` enum used by `buildAbilityFromPermissions`.
2. Add server-side `ability.can(...)` checks in every mutation route for the entity.
3. Update the [Permission reference](./permission-reference.mdx) to document default permissions for the built-in roles.
4. Wire up any client-side gating in the relevant components.

## Related

- [Authorization Overview](./overview.mdx)
- [Managing roles and permissions](./managing-roles.mdx)
- [Permission reference](./permission-reference.mdx)
- [Concepts → Organizations and multi-tenancy](../concepts/organizations.mdx)
- [Architecture → Backend & API](../architecture/backend-and-api.mdx)
