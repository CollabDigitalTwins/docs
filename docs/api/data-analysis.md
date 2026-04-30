---
title: /api/data-analysis
description: Aggregation and reporting endpoints used by dashboards across the platform.
category: api
status: draft
last_updated: 2026-04-29
---

# /api/data-analysis

Aggregation endpoints used to populate dashboards and portfolio-level summaries. These routes join across `Building`, `Site`, `Sensor`, and `File` to produce derived views — they do not mutate data.

All routes require an authenticated session and `read` permission on the entities being aggregated.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/data-analysis/buildings/by-type` | Building counts grouped by `buildingType`. |
| `GET` | `/api/data-analysis/buildings/by-phase` | Building counts grouped by `buildingProjectPhase`. |
| `GET` | `/api/data-analysis/buildings/by-year` | Building counts grouped by construction year buckets. |
| `GET` | `/api/data-analysis/sites/summary` | Aggregate area, building count, and asset value per site. |
| `GET` | `/api/data-analysis/sensors/timeseries` | Time-series readings for a sensor or sensor group. |
| `GET` | `/api/data-analysis/files/by-format` | File counts grouped by format extension. |

---

## GET `/api/data-analysis/buildings/by-type`

Returns the number of buildings in the user's organization grouped by their `buildingType` value.

### Authentication

Requires permission: `{ action: "read", subject: "Building" }`.

### Response

```json
[
  { "type": "Residential", "count": 42 },
  { "type": "Office",      "count": 18 },
  { "type": "Industrial",  "count":  6 }
]
```

| Status | Meaning |
|--------|---------|
| `200` | Success |
| `401` | Unauthenticated |
| `403` | Insufficient permissions |

---

## GET `/api/data-analysis/buildings/by-phase`

Same shape as the by-type endpoint, grouped on `buildingProjectPhase`.

### Response

```json
[
  { "phase": "Concept_Phase",    "count": 4 },
  { "phase": "Construction_Phase", "count": 12 },
  { "phase": "Operations_Phase",   "count": 50 }
]
```

---

## GET `/api/data-analysis/buildings/by-year`

Buckets buildings by construction-year decade.

### Query parameters

| Param | Type | Description |
|-------|------|-------------|
| `from` | integer | Optional — earliest decade to include. |
| `to`   | integer | Optional — latest decade to include. |

### Response

```json
[
  { "decade": 1960, "count": 5 },
  { "decade": 1970, "count": 8 },
  { "decade": 1980, "count": 12 }
]
```

---

## GET `/api/data-analysis/sites/summary`

Aggregate metrics per site for the user's organization.

### Response

```json
[
  {
    "siteId": 1,
    "siteName": "Main Campus",
    "buildingCount": 23,
    "totalAreaSqM": 184500,
    "totalReplacementValue": 480000000
  }
]
```

---

## GET `/api/data-analysis/sensors/timeseries`

Returns time-series readings for one or more sensors over a time window.

### Query parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `sensorId` | integer | conditional | A specific sensor's ID. Mutually exclusive with `sensorTypeId`. |
| `sensorTypeId` | integer | conditional | Aggregates across all sensors of this type. |
| `from` | ISO 8601 timestamp | yes | Start of the window. |
| `to` | ISO 8601 timestamp | yes | End of the window. |
| `interval` | enum | no | `minute`, `hour` (default), `day`, `week`. |

### Response

```json
{
  "sensorId": 12,
  "unit": "°C",
  "interval": "hour",
  "points": [
    { "t": "2026-04-29T00:00:00Z", "v": 21.4 },
    { "t": "2026-04-29T01:00:00Z", "v": 21.2 }
  ]
}
```

---

## GET `/api/data-analysis/files/by-format`

File counts grouped by extension. Useful for understanding the composition of an organization's asset library.

### Response

```json
[
  { "format": "ifc",     "count": 47 },
  { "format": "pdf",     "count": 124 },
  { "format": "geojson", "count": 9 }
]
```

---

## Related

- [Hooks — Buildings](../hooks/buildings.md)
- [Hooks — Sensors](../hooks/sensors.md)
- [Architecture → Backend & API](../architecture/backend-and-api.mdx)
