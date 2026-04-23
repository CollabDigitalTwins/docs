---
title: /api/open-data-portals
description: CRUD and filtered lookup operations for open data portal registry entries.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/open-data-portals

Manages `OpenDataPortal` records — external open data sources (ArcGIS, CKAN, Opendatasoft, etc.) registered to the platform and available as dataset sources in the map viewer.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/open-data-portals` | List all portals |
| `GET` | `/api/open-data-portals/[id]` | Get a single portal |
| `GET` | `/api/open-data-portals/municipality/[municipality]` | Filter by municipality |
| `GET` | `/api/open-data-portals/country-subdivision/[code]` | Filter by province/state code |
| `GET` | `/api/open-data-portals/group/[group]` | Filter by group (Organizational, Municipal, etc.) |
| `GET` | `/api/open-data-portals/name/[name]` | Search by name |

---

## GET `/api/open-data-portals`

Returns all registered open data portals.

### Authentication

Requires permission: `{ action: "read", subject: "OpenDataPortal" }`

### Response

```json
[
  {
    "id": 1,
    "name": "City of Ottawa Open Data",
    "group": "Municipal",
    "dataManagementSystem": "Ckan",
    "portalUrl": "https://open.ottawa.ca",
    "apiUrl": "https://open.ottawa.ca/api/3",
    "countrySubdivision": "CA-ON",
    "municipality": "Ottawa",
    "country": "CA"
  }
]
```

---

## GET `/api/open-data-portals/municipality/[municipality]`

Returns portals for a specific municipality name. Used by the map viewer to suggest relevant datasets based on the user's current map viewport.

---

## GET `/api/open-data-portals/country-subdivision/[code]`

Returns portals for a province or state using ISO 3166-2 codes (e.g., `CA-ON`, `US-NY`).

---

## GET `/api/open-data-portals/group/[group]`

Filters by `DatasetGroup`:

| Value | Meaning |
|-------|---------|
| `Organizational` | CDT organization's own datasets |
| `Municipal` | City/town level portals |
| `Provincial` | Province/state level portals |
| `National` | National government portals |

---

## Notes

<!-- TODO: Confirm whether portals can be created/updated/deleted via the API, or whether they are managed exclusively by CDT administrators. The ApiAdapter interface only defines read operations. -->

---

## Related

- [Hooks — Open Data Portals](../hooks/open-data-portals.md)
- [Concepts — Open Data Portals](../concepts/open-data-portals.md)
- [Data Model — OpenDataPortal](../architecture/data-model.md#opendataportal)
- [Guides — Datasets & Open Data](../guides/datasets-and-open-data.md)
