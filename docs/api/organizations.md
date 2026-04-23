---
title: /api/organizations
description: Read and update organization records, including roles.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/organizations

Manages `Organization` records. Each organization is a tenant — it controls branding, map defaults, enabled viewers, and user roles.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/organizations/[id]` | Get an organization by ID |
| `GET` | `/api/organizations/name/[name]` | Get an organization by slug name |
| `GET` | `/api/organizations/[id]/roles` | List roles for an organization |
| `PUT` | `/api/organizations/[id]` | Update an organization |

---

## GET `/api/organizations/[id]`

Returns a single organization record.

### Authentication

Requires permission: `{ action: "read", subject: "Organization" }`

### Response

```json
{
  "id": 1,
  "name": "my-org",
  "title": "My Organization",
  "appContent": ["map", "bim", "buildings", "settings"],
  "languages": ["En", "Fr"],
  "bbox": [-76.0, 45.0, -75.0, 46.0],
  "geocoder": true
}
```

---

## GET `/api/organizations/name/[name]`

Looks up an organization by its URL slug. Used during initial app load when the org name is read from the URL path parameter `[instance]`.

---

## GET `/api/organizations/[id]/roles`

Returns all `Role` records for the organization. Roles define the permission sets available to assign to users.

### Response

```json
[
  {
    "id": 1,
    "name": "Admin",
    "permissions": [{ "action": "manage", "subject": "all" }],
    "orgId": 1
  }
]
```

---

## PUT `/api/organizations/[id]`

Partial update. Supports updating branding fields, map defaults, enabled viewers (`appContent`), and language support.

### Request body

```json
{
  "title": "Updated Title",
  "appContent": ["map", "bim", "buildings", "sites", "settings"],
  "mainColor": "#FF6B00"
}
```

### Notes

<!-- TODO: Confirm whether `logoKey` and `faviconKey` are updated via this route or via a separate upload endpoint. -->

---

## Related

- [Hooks — Organizations](../hooks/organizations.md)
- [Data Model — Organization](../architecture/data-model.md#organization)
- [Authorization](../authorization/authorization_roles_permissions.md)
- [Components — Settings](../components/settings.md)
