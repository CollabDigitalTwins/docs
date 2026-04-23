---
sidebar_position: 7
---

# Datasets & Open Data

CDT aggregates open data from federal, provincial, and municipal sources into a single interface — no GIS software required. Data is fetched in real time directly from its original source, so you always see the most current version.

## Why a Federated Approach

Canada is a global leader in open data availability, but the information is fragmented across hundreds of portals using different systems, formats, and APIs. The four main data management platforms in use across the country — CKAN, Huwise, Socrata, and ArcGIS — each have their own APIs and data structures. CDT normalizes these into a unified interface so you can stack layers from different jurisdictions without downloading anything or knowing GIS.

## Supported Data Sources

### Federal

| Source | Content |
|---|---|
| Open Government (open.canada.ca) | Policy data, infrastructure, environment |
| Natural Resources Canada (NRCan) | Topography, geology, forestry, energy |
| Statistics Canada | Census, demographic, economic data |
| Geo.ca | National geospatial catalogue |
| CIFFC | Active wildfire perimeters and conditions |

### Provincial

British Columbia (Open BC), Quebec (Données ouvertes), Ontario, New Brunswick, Alberta, Saskatchewan, Yukon, Nunavut, and others.

### Municipal

Ottawa, Toronto, Vancouver, Montreal, Calgary, Halifax, and additional cities — providing parcel data, zoning, infrastructure, transit, and more.

### Community

- **OpenStreetMap** — building footprints, roads, points of interest
- **Affordable housing databases** — from municipal and non-profit partners
- **User-uploaded data** — contributed directly through the platform

## Supported Formats

| Format | Protocol |
|---|---|
| **GeoJSON** | Direct HTTP fetch from open data portals |
| **WMS** | OGC Web Map Service — tiled raster imagery |
| **WMTS** | OGC Web Map Tile Service — pre-rendered tiles |
| **Vector tiles** | Served from PostGIS via Martin tile server |

## Using the Layer Panel

1. Open the side menu in the map viewer
2. Browse or search the dataset catalogue by keyword, jurisdiction, or category
3. Click a dataset to add it as a layer
4. The layer appears on the map immediately — click any feature to read its attributes

You can have multiple layers active simultaneously. Layers from different scales and sources stack correctly because CDT reprojects all data to WGS 84 using Proj4js.

## Styling Layers

Any numeric attribute in a dataset can drive a color gradient on the map. For example:

- Color census tracts by median household income
- Color building footprints by construction year
- Color wildfire perimeters by threat level

Use the **Style** panel on any active layer to configure the attribute, color ramp, and value range.

## Real-Time Data

Some datasets update continuously. Wildfire perimeters from CIFFC, for example, are fetched on a short refresh interval so the map reflects current fire conditions. The platform uses SWR (stale-while-revalidate) to serve cached values instantly while refreshing in the background.

## User-Generated Data

In addition to official open data, users can upload their own datasets through the **Add media** feature:

- Drop a GeoJSON file onto the map to add it as a private or shared layer
- Upload photos, videos, and audio geotagged to a location
- Add text annotations pinned to map coordinates

User content is stored in MinIO and is visible to all members of the same Organization. This supports a bottom-up, crowdsourced layer on top of the official top-down data — useful for field observation, community engagement, and site documentation.

## Metadata Transparency

Every dataset and every feature exposes its full metadata in the UI. When you click a feature, the properties panel shows all available attributes and, where available, the data source, update frequency, and licence. CDT does not modify or re-interpret source data — what you see is what the original publisher provides.
