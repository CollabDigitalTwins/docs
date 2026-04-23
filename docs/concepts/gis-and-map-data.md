---
sidebar_position: 3
---

# GIS & Map Data

**Geographic Information Systems (GIS)** are systems for capturing, storing, analyzing, and visualizing geographic data. A GIS is a smart map that understands *what* things are, not just *where* — a building footprint is not just a polygon, it is a record linked to ownership data, floor counts, energy usage, zoning classification, and more.

Where BIM operates at the building scale, GIS operates at the site, city, regional, and national scale. CDT integrates both: a building's IFC model appears in its correct geographic position on the map, surrounded by the city data that gives it context.

## Why GIS Matters for Digital Twins

Infrastructure planning, environmental monitoring, and asset management all require understanding how things relate to each other across geography. A proposed transit line affects property values, flood zones, and walkability simultaneously. A wildfire perimeter needs to be read against fuel loads, roads, and community boundaries. Housing affordability data only makes sense when overlaid with income, transit access, and zoning.

GIS makes these relationships visible and queryable. CDT's map viewer is the interface where multi-scale, multi-source geospatial data comes together with building-scale BIM.

## Common Geospatial Formats

| Format | What it is |
|---|---|
| **GeoJSON** | JSON-based vector format encoding points, lines, and polygons with properties. Web-friendly and widely supported by open data portals |
| **Vector tiles** | Pre-sliced map data delivered tile by tile as you pan and zoom. Renders efficiently in WebGL and supports interactive styling |
| **Raster tiles (WMTS)** | Pre-rendered image tiles — satellite imagery, aerial photos, scanned maps — served by OGC Web Map Tile Service |
| **WMS** | OGC Web Map Service — map images requested from a remote server with metadata; common in government and municipal open data systems |
| **GeoTIFF** | Georeferenced raster imagery, used for elevation models and remote sensing data |

## Coordinate Reference Systems

Geographic data comes in many projections. Canadian open data frequently arrives in local systems: **MTM** (Modified Transverse Mercator), **UTM** (Universal Transverse Mercator), or provincial variants. CDT uses [Proj4js](https://proj4js.org/) to reproject all incoming data to **WGS 84** (EPSG:4326) automatically, so layers from different jurisdictions align correctly without manual re-projection.

## CDT's Map Stack

CDT's map infrastructure is built entirely on open-source tools — no proprietary API keys, no vendor lock-in:

| Tool | Role |
|---|---|
| **MapLibre GL JS** | WebGL-based map renderer in the browser. Handles vector tiles, raster tiles, custom layer styles, and 3D camera. 100% free and open-source |
| **Martin** | Lightweight vector tile server. Generates tiles dynamically from PostGIS queries, so the map reflects changes in the database instantly without pre-generated static files |
| **PostGIS** | Spatial extension for PostgreSQL. Stores and indexes geometric types (points, polygons, rasters), enabling high-performance spatial queries and proximity searches |
| **Turf.js** | Client-side geospatial analysis library. Calculates distances, areas, buffers, and spatial intersections directly in the browser without a server round-trip |
| **Proj4js** | Coordinate reprojection library. Manages transformation between different CRS using standard EPSG identifiers |

Four map renderers were evaluated before choosing MapLibre: Leaflet (excluded — lacks 3D/tilt support), Cesium (strong 3D but proprietary and fee-based), Mapbox GL JS (proprietary, fee-based), and MapLibre (fully open-source fork of Mapbox GL JS, actively maintained by a large community).

## Open Data Integration

Canada is a global leader in open data availability, but the information is fragmented across hundreds of portals using four different platform types: **CKAN**, **Huwise**, **Socrata**, and **ArcGIS Online** — each with its own API and data structure. CDT normalizes access to all of them, giving users a single interface regardless of the source system.

Data is fetched in real time directly from original sources — nothing is cached or replicated locally. This ensures currency and respects the data governance of the original publisher.

Supported open data scales:

| Scale | Example sources |
|---|---|
| Federal | Open Government, NRCan, Statistics Canada, Geo.ca, CIFFC |
| Provincial | Open Ontario, Données ouvertes Québec, Open BC, and others |
| Municipal | Open Ottawa, Open Toronto, Vancouver Open Data, and more |
| Community | OpenStreetMap (building footprints, roads, POIs) |

## Urban Context

For urban context, the platform uses OpenStreetMap building footprints extruded to their approximate height in LOD 1.3 (simple box volumes). This gives every location a readable volumetric context without loading full BIM models for every building in the scene.

At larger scales, the map fetches tile layers from national and provincial services — topography, land cover, transportation networks — to provide geographic grounding for whatever asset-level data is loaded.

## BIM / GIS Integration

The fundamental integration point in CDT is the coexistence of IFC models and GIS data in the same coordinate system and the same scene. A Three.js layer is added on top of the MapLibre viewport: the map camera and the 3D scene camera are synchronized, so zooming or rotating the map moves the IFC model in lockstep with the surrounding urban context.

This allows users to:
- Verify a building's geographic position relative to site boundaries, roads, and neighbouring structures
- Analyze shadow impact on adjacent buildings using BIM geometry in a GIS context
- Overlay federal or municipal datasets (flood zones, zoning, infrastructure) directly against a building model

See the [Map Viewer guide](../guides/map-viewer) and [Datasets & Open Data guide](../guides/datasets-and-open-data) for usage details.
