---
sidebar_position: 7
title: Datasets & Open Data
description: Browse, overlay, and style federated open data from national, provincial/territorial, and municipal portals.
---

# Datasets & Open Data

CDT aggregates open data from national, provincial/territorial, and municipal sources into a single interface, with no GIS software required. Data fetches in real time from its original source, so you always see the most current version.

Canada publishes a great deal of open data, but it is fragmented across hundreds of portals running four different platforms: CKAN, Huwise, Socrata, and ArcGIS. CDT normalizes their APIs so you can stack layers from different jurisdictions without downloading anything.

Uploading requires the **User** or **Admin** role in your organization.

## Add a dataset to the map

1. Click the **Datasets** icon in the bottom toolbar.
2. Browse or search the catalogue by keyword, jurisdiction, or category.
3. Click a dataset to add it as a layer.
4. Click any feature to read its attributes.

Multiple layers can be active at once. CDT reprojects everything to WGS 84 with [Proj4js](https://proj4js.org/), so layers from different scales and sources stack correctly.

## Style a layer by an attribute

Click the layer name in the layer panel, open the **Style** subpanel, pick the attribute that should drive the colour gradient, choose a colour ramp and value range, then apply. Features take the colour of the value they hold.

## Upload your own dataset

1. Open the **Add media** feature in the map.
2. Choose the source type:
   - **GeoJSON** — drop a file onto the map, or browse and pick one.
   - **ArcGIS Feature Service** — paste the service URL to pull its features directly.
   - **WMS** — paste the service URL and enter the **WMS layer name(s)**. WMS data is added as a raster overlay rather than a vector dataset, so its features are not individually clickable.
3. Choose visibility: **Private** (only you) or **Organization** (all members).
4. The dataset is listed alongside official datasets. Uploaded GeoJSON is stored in MinIO; ArcGIS and WMS layers are fetched live from their source.

The same flow takes geotagged photos, videos, audio, and pinned text annotations, which is useful for fieldwork, community engagement, and site documentation.

## Where the data comes from

Portals are organized by jurisdiction, plus **Organizational** datasets your own organization adds.

**National**

| Source | Content |
|--------|---------|
| Open Government (open.canada.ca) | Policy data, infrastructure, environment |
| Natural Resources Canada (NRCan) | Topography, geology, forestry, energy |
| Statistics Canada | Census, demographic, economic data |
| Geo.ca | National geospatial catalogue |
| CIFFC | Active wildfire perimeters and conditions |

**Country subdivision (provincial / territorial)** — British Columbia (Open BC), Quebec (Données ouvertes), Ontario, New Brunswick, Alberta, Saskatchewan, Yukon, Nunavut, and others.

**Municipal** — Ottawa, Toronto, Vancouver, Montreal, Calgary, Halifax, and more, providing parcel data, zoning, infrastructure, and transit.

**Community and global** — OpenStreetMap (building footprints, roads, points of interest) and partner affordable-housing databases.

## Supported formats

| Format | Protocol |
|--------|----------|
| **GeoJSON** | Direct HTTP fetch from open data portals |
| **WMS** | OGC Web Map Service, tiled raster imagery |
| **WMTS** | OGC Web Map Tile Service, pre-rendered tiles |
| **Vector tiles** | Served from PostGIS via the Martin tile server |

## Real-time data

Some datasets update continuously. Wildfire perimeters from CIFFC, for example, refresh on a short interval so the map reflects current conditions. The platform uses SWR (stale-while-revalidate) to serve cached values instantly while refreshing in the background.

## Metadata transparency

Every dataset and feature exposes its full metadata in the UI. Clicking a feature shows all available attributes and, where available, the data source, update frequency, and licence. CDT does not modify or re-interpret source data.

## Related

- [Map Viewer](./map-viewer.md)
- [Concepts → GIS & Map Data](../concepts/gis-and-map-data.mdx)
- [Concepts → Open Data Portals](../concepts/open-data-portals.mdx)
