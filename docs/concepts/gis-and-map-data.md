---
sidebar_position: 3
---

# GIS & Map Data

How CDT captures, renders, and analyzes geographic data to give your digital twin a sense of place.

:::info What is GIS?
**Geographic Information Systems (GIS)** are systems for capturing, storing, analyzing, and visualizing geographic data. Think of GIS as a smart map that understands *what* things are, not just *where* they are — a building footprint is not just a polygon on a screen, it is a record linked to ownership data, floor counts, energy usage, and more.
:::

## Common geospatial formats

CDT works with several standard formats you will encounter when working with open data or configuring map layers:

| Format | What it is |
|--------|------------|
| **GeoJSON** | A JSON-based vector format that encodes points, lines, and polygons alongside properties. Web-friendly and widely supported. |
| **Vector tiles** | Pre-sliced map data delivered tile by tile as you pan and zoom. Renders efficiently in the browser and supports interactive styling. |
| **Raster tiles** | Pre-rendered image tiles — satellite imagery, aerial photos, or scanned maps — stitched together as you navigate. |
| **WMS / WMTS** | Web Map Service standards that serve map images from a remote server. Common in government and municipal open data systems. |

## How CDT handles map data

CDT's map stack is built on three open-source tools, which means no proprietary API keys and no vendor lock-in:

- **MapLibre GL JS** renders the map in your browser using WebGL. It handles vector tiles, raster tiles, and custom layer styles, and is the same engine powering the interactive map viewer in CDT.
- **Martin** is a vector tile server that sits in front of your PostGIS database. It converts spatial database queries into vector tiles on demand, so CDT can serve building footprints and organization-specific spatial data without pre-generating static files.
- **Turf.js** runs geospatial calculations directly in the browser — distances between points, area of a polygon, spatial intersections — without sending data to a server.

## Open data integration

CDT connects to **CKAN-based open data portals** — the same platform used by national, provincial (or any country subdivision), and many municipal governments around the world. From the dataset panel you can browse and toggle layers from these portals directly onto the map without downloading any files. The data stays at the source and is streamed into your session on demand.

This means you can overlay municipal zoning boundaries, federal flood hazard zones, or provincial land-use classifications alongside your own building data in a few clicks.

## What you can do with maps in CDT

The map viewer supports a range of tasks out of the box:

- **Navigate** — pan, zoom, tilt, and rotate to any view
- **Search locations** — find addresses or place names to jump quickly to an area of interest
- **View building footprints** — see your organization's buildings as interactive features on the map
- **Overlay open data layers** — toggle federal, provincial, and municipal datasets without leaving CDT
- **Measure distances and areas** — draw lines or polygons and get instant metric results, powered by Turf.js
- **Compare buildings** — select multiple buildings to compare attributes side by side
- **Share map positions** — generate a link or QR code that encodes the current map view (center, zoom, bearing, and pitch) so colleagues land exactly where you are

## Next steps

- [Map Viewer guide](../guides/map-viewer) — learn how to navigate the map, use tools, and customize layers
- [Datasets & Open Data guide](../guides/datasets-and-open-data) — connect to open data portals and add datasets as map layers
