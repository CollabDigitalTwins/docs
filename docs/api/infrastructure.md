---
title: /api/infrastructure
description: CRUD operations for infrastructure assets — roads, railways, bridges, utilities, and survey data.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/infrastructure

Manages `Infrastructure` records. Infrastructure assets cover civil engineering domains including roads, railways, bridges, marine facilities, utilities, and geotechnical features. The type system maps to IFC 4.x and CityGML standards.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/infrastructure` | List all infrastructure |
| `GET` | `/api/infrastructure/[id]` | Get a single infrastructure record |
| `POST` | `/api/infrastructure/create` | Create an infrastructure record |
| `PUT` | `/api/infrastructure/[id]` | Update an infrastructure record |
| `DELETE` | `/api/infrastructure/[id]` | Delete an infrastructure record |

---

## GET `/api/infrastructure`

Returns all infrastructure records for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "Infrastructure" }`

### Response

```json
[
  {
    "id": 1,
    "infrastructureName": "Main Street Bridge",
    "infrastructureType": "Alignment",
    "ifcDomain": "IfcBridge",
    "ifcBridgePartType": "Superstructure",
    "infrastructureState": "Existing",
    "organizationId": 1
  }
]
```

---

## POST `/api/infrastructure/create`

Creates a new infrastructure record.

### Request body

The full `Infrastructure` type is supported — provide only the fields relevant to the asset type. IFC domain fields (e.g., `ifcRoadType`, `ifcLaneCount`) are optional and depend on `ifcDomain`.

```json
{
  "infrastructureName": "Highway 417 On-Ramp",
  "infrastructureType": "Road",
  "ifcDomain": "IfcRoad",
  "ifcRoadType": "Highway",
  "ifcLaneCount": 2,
  "infrastructureState": "Existing",
  "infrastructureLongitude": -75.7,
  "infrastructureLatitude": 45.4
}
```

---

## PUT `/api/infrastructure/[id]`

Partial update.

---

## DELETE `/api/infrastructure/[id]`

Deletes the record. Associated geometry files are not automatically deleted.

### Notes

<!-- TODO: Confirm whether `infrastructureGeometryId` references are cleaned up on delete or left as orphans. -->

---

## Related

- [Hooks — Infrastructure](../hooks/infrastructures.md)
- [Data Model — Infrastructure](../architecture/data-model.md#infrastructure)
- [Concepts — IFC Infrastructure Types](../concepts/ifc-infrastructure-types.md)
