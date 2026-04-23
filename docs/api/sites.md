---
title: /api/sites
description: CRUD operations for site records, including building associations.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/sites

Manages `Site` records. A site is a geographic area that may contain multiple buildings. Sites appear in the map viewer and data tables.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/sites` | List all sites |
| `GET` | `/api/sites/[id]` | Get a single site |
| `POST` | `/api/sites/create` | Create a site |
| `PUT` | `/api/sites/[id]` | Update a site (including building associations) |
| `DELETE` | `/api/sites/[id]` | Delete a site |

---

## GET `/api/sites`

Returns all sites for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "Site" }`

### Response

```json
[
  {
    "id": 1,
    "siteName": "Downtown Campus",
    "siteLatitude": 45.421,
    "siteLongitude": -75.690,
    "siteLandUse": "Mixed_Use",
    "siteOrganizationId": 1
  }
]
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `401` | Unauthenticated |
| `403` | Insufficient permissions |

---

## GET `/api/sites/[id]`

Returns a single site by ID (string).

---

## POST `/api/sites/create`

Creates a new site.

### Request body

```json
{
  "siteName": "New Site",
  "siteLatitude": 45.421,
  "siteLongitude": -75.690,
  "siteOrganizationId": 1
}
```

### Response

The created `Site` object.

---

## PUT `/api/sites/[id]`

Partial update. Also supports connecting or disconnecting buildings.

### Request body

```json
{
  "siteName": "Updated Name",
  "siteBuildings": {
    "connect": [{ "id": 5 }],
    "disconnect": [{ "id": 3 }]
  }
}
```

### Response

The updated `Site` object.

### Notes

Updating `siteBuildings` triggers SWR revalidation of the `buildings` cache key, since buildings hold a `buildingParentSiteId` reference.

---

## DELETE `/api/sites/[id]`

Deletes a site. Buildings associated with the site are not deleted — their `buildingParentSiteId` is cleared.

### Response

The deleted `Site` object.

---

## Related

- [Hooks — Sites](../hooks/sites.md)
- [Data Model — Site](../architecture/data-model.md#site)
- [Components — Site Details](../components/site-details.md)
