---
title: /api/buildings
description: CRUD operations for building records and OSM/feature ID lookups.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/buildings

Manages `Building` records for the active organization. Buildings are the primary asset type — they appear in the map viewer, BIM viewer, and data tables.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/buildings` | List all buildings |
| `GET` | `/api/buildings/[id]` | Get a single building |
| `GET` | `/api/buildings/osm/[osmId]` | Find buildings by OSM ID |
| `GET` | `/api/buildings/feature/[featureId]` | Find buildings by GIS feature ID |
| `GET` | `/api/buildings/osm-ids` | List all OSM IDs for the org's buildings |
| `POST` | `/api/buildings/create` | Create a building |
| `PUT` | `/api/buildings/[id]` | Update a building |

---

## GET `/api/buildings`

Returns all buildings for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "Building" }`

### Response

```json
[
  {
    "id": 1,
    "buildingName": "Main Building",
    "buildingLatitude": 45.421,
    "buildingLongitude": -75.690,
    "buildingType": ["Residential"],
    "buildingProjectPhase": "Operations_Phase"
  }
]
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `401` | Unauthenticated |
| `403` | Insufficient permissions |

---

## GET `/api/buildings/[id]`

Returns a single building by numeric ID.

### Response

Single `Building` object or `null` if not found.

---

## GET `/api/buildings/osm/[osmId]`

Returns buildings matching a MapTiler/OSM building polygon ID. Used by the map viewer to link clicked 3D building polygons to CDT building records.

---

## GET `/api/buildings/feature/[featureId]`

Returns buildings with a matching `featureId`. Used to correlate buildings with external GIS datasets.

---

## GET `/api/buildings/osm-ids`

Returns an array of all `buildingOsmId` values for the organization. Used by the map to decide which MapTiler polygons to hide when a CDT building is present.

---

## POST `/api/buildings/create`

Creates a new building.

### Request body

```json
{
  "buildingData": {
    "buildingName": "New Building",
    "buildingLatitude": 45.421,
    "buildingLongitude": -75.690
  },
  "organizationId": "1"
}
```

### Response

The created `Building` object.

| Status | Meaning |
|--------|---------|
| `200` | Created |
| `401` | Unauthenticated |
| `403` | Insufficient permissions |

---

## PUT `/api/buildings/[id]`

Partial update — only fields present in the body are changed.

### Request body

```json
{
  "buildingName": "Updated Name",
  "buildingProjectPhase": "Handover_Phase"
}
```

### Response

The updated `Building` object.

### Notes

<!-- TODO: Confirm whether a building can be moved to a different organization via this route. -->

---

## Related

- [Hooks — Buildings](../hooks/buildings.md)
- [Data Model — Building](../architecture/data-model.md#building)
- [Components — Building Details](../components/building-details.md)
