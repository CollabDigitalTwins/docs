---
sidebar_position: 7
title: Datasets & Open Data
description: Browse, overlay, and style federated open data from national, provincial/territorial, and municipal portals.
---

# Datasets & Open Data

CDT aggregates open data from national, provincial/territorial, and municipal sources into a single interface — no GIS software required. Data fetches in real time directly from its original source, so you always see the most current version.

## Goal

Find an open dataset, overlay it on the map, style it by an attribute, and (optionally) upload your own dataset.

## Prerequisites

- A CDT account.
- For uploads, **User** or **Admin** role in your Organization.

## Why a federated approach

Canada is a global leader in open data availability, but the information is fragmented across hundreds of portals. The four main data management platforms across the country — CKAN, Huwise, Socrata, and ArcGIS — each have their own APIs and structures. CDT normalizes them into a unified interface so you can stack layers from different jurisdictions without downloading anything or knowing GIS.

## Add a dataset to the map

**Goal:** overlay a public dataset on the map.

1. Click the **Datasets** icon in the bottom toolbar.
2. Browse or search the catalogue by keyword, jurisdiction, or category.
3. Click a dataset to add it as a layer.
4. The layer appears immediately. Click any feature to read its attributes.

You can have multiple layers active at once. CDT reprojects everything to WGS 84 with [Proj4js](https://proj4js.org/) so layers from different scales and sources stack correctly.

**Result:** the dataset is overlaid on the map and explorable feature-by-feature.

## Style a layer by an attribute

**Goal:** colour a layer by a numeric attribute (income, year built, threat level, etc.).

1. Click the layer name in the layer panel.
2. Open the **Style** subpanel.
3. Pick the attribute that should drive the colour gradient.
4. Choose a colour ramp and value range.
5. Apply.

**Result:** features take the colour of the value they hold.

## Upload your own dataset

**Goal:** add a private or shared dataset to your Organization.

1. Open the **Add media** feature in the map.
2. Choose the source type:
   - **GeoJSON** — drop a file onto the map, or browse and pick one.
   - **ArcGIS Feature Service** — paste the service URL to pull its features directly.
   - **WMS** — paste the service URL and enter the **WMS layer name(s)**. WMS data is added as a **raster overlay** rather than a vector dataset, so its features are not individually clickable.
3. Choose visibility — **Private** (only you) or **Organization** (all members).
4. The dataset is added to the map and listed alongside official datasets. Uploaded GeoJSON files are stored in MinIO; ArcGIS and WMS layers are fetched live from their source.

You can also upload geotagged photos, videos, audio, and pinned text annotations through the same flow. Useful for fieldwork, community engagement, and site documentation.

**Result:** your dataset is selectable in the layer panel like any other.

Portals are organized by jurisdiction — **National**, **Country Subdivision** (provincial/territorial), and **Municipal** — plus **Organizational** datasets your own organization adds.

### National

| Source | Content |
|--------|---------|
| Open Government (open.canada.ca) | Policy data, infrastructure, environment |
| Natural Resources Canada (NRCan) | Topography, geology, forestry, energy |
| Statistics Canada | Census, demographic, economic data |
| Geo.ca | National geospatial catalogue |
| CIFFC | Active wildfire perimeters and conditions |

### Country subdivision (provincial / territorial)

British Columbia (Open BC), Quebec (Données ouvertes), Ontario, New Brunswick, Alberta, Saskatchewan, Yukon, Nunavut, and others.

### Municipal

Ottawa, Toronto, Vancouver, Montreal, Calgary, Halifax, and additional cities — providing parcel data, zoning, infrastructure, transit, and more.

### Organizational

Datasets your organization adds to the platform — see [Upload your own dataset](#upload-your-own-dataset) above. Community and global sources are also available, including **OpenStreetMap** (building footprints, roads, points of interest) and partner **affordable-housing databases**.

## Supported formats

| Format | Protocol |
|--------|----------|
| **GeoJSON** | Direct HTTP fetch from open data portals |
| **WMS** | OGC Web Map Service — tiled raster imagery |
| **WMTS** | OGC Web Map Tile Service — pre-rendered tiles |
| **Vector tiles** | Served from PostGIS via the Martin tile server |

## Real-time data

Some datasets update continuously. Wildfire perimeters from CIFFC, for example, refresh on a short interval so the map reflects current fire conditions. The platform uses SWR (stale-while-revalidate) to serve cached values instantly while refreshing in the background.

## Metadata transparency

Every dataset and feature exposes its full metadata in the UI. Clicking a feature shows all available attributes and, where available, the data source, update frequency, and licence. CDT does not modify or re-interpret source data — what you see is what the original publisher provides.

## Related

- [Map Viewer](./map-viewer.md)
- [Concepts → GIS & Map Data](../concepts/gis-and-map-data.mdx)
- [Concepts → Open Data Portals](../concepts/open-data-portals.mdx)
- [API → Open Data Portals](../api/open-data-portals.md)
