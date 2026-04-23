---
title: Open Data Portals
description: How CDT federates external open data sources — ArcGIS, CKAN, Opendatasoft, and local datasets — as map layers.
category: concepts
status: draft
last_updated: 2026-04-23
---

# Open Data Portals

CDT can connect to external open data portals and display their datasets as vector layers in the map viewer. Portals are registered in the platform's database, and the frontend fetches and renders datasets directly from the external APIs.

## Overview

An `OpenDataPortal` record stores the connection details for a single portal (name, API URL, data management system type, geographic scope). When a user browses datasets in the map viewer, CDT queries the relevant portals based on the current map location and presents datasets as toggleable layers.

## How It Works in CDT

### Portal registry

Portals are stored in the database and exposed via the hooks in `src/core/hooks/openDataPortals/`. The map viewer queries portals filtered by municipality and country subdivision (ISO 3166-2 code) to surface the most relevant datasets for the visible area.

```ts
const { openDataPortals } = useOpenDataPortalsByMunicipalityAndCountrySubdivision(
  currentMunicipality,
  currentCountrySubdivision
)
```

### Dataset adapters

Each `DataManagementSystem` has a corresponding adapter that knows how to fetch and normalise data from that system's API:

| System | Value | Adapter |
|--------|-------|---------|
| CKAN | `Ckan` | `ckanDatasets` |
| ArcGIS | `Arcgis` | `arcGISDatasets` |
| Opendatasoft | `Opendatasoft` | `opendatasoftDatasets` |
| Local | — | `localDatasets` |
| Socrata | `Socrata` | <!-- TODO: confirm adapter location --> |

The adapters normalise external API responses into a common `Dataset` type with `getFeatures()` and `getFields()` methods. The map viewer calls these to build a GeoJSON `Source` and render a `Layer`.

### Groups

Portals are tagged with a `DatasetGroup`:

| Group | Meaning |
|-------|---------|
| `Organizational` | CDT organization's own hosted datasets |
| `Municipal` | City/municipality level portals |
| `Provincial` | Province/state level portals |
| `National` | Federal/national portals |

## Key Files

| File | Role |
|------|------|
| `src/core/hooks/openDataPortals/openDataPortals.ts` | Hook exports |
| `src/core/hooks/openDataPortals/createOpenDataPortalHooks.ts` | SWR hook implementations |
| `src/core/types/dbTypes.ts` | `OpenDataPortal`, `DatasetGroup`, `DataManagementSystem` types |
| `src/core/components/viewers/map/src/MapLayers/src/OpenDataLayers/` | Map layer that renders portal datasets |

## Gotchas

- Portal `apiUrl` and `portalUrl` are optional — some portals in the registry may not have API access configured, which will cause dataset fetches to fail silently.
- External API rate limits and CORS policies apply. CDT fetches dataset data client-side, so the user's browser must be able to reach the external portal API directly.
- `countrySubdivision` uses ISO 3166-2 format (e.g., `CA-ON`, `US-NY`). Mismatched formats will cause portal lookup by subdivision to return empty results.

## Further Reading

- [Hooks — Open Data Portals](../hooks/open-data-portals.md)
- [API — Open Data Portals](../api/open-data-portals.md)
- [Architecture — Map Layers](../architecture/map-layers.md)
- [Guides — Datasets & Open Data](../guides/datasets-and-open-data.md)
