---
sidebar_position: 1
title: Map Viewer
description: Navigate the map, search for places, toggle data layers, measure, and share views.
---

# Map Viewer

The map viewer is the primary interface when you open CDT. It is built on [MapLibre GL JS](https://maplibre.org/) — a fully open-source WebGL renderer — and serves as the spatial anchor for every other data type in the platform.

## Goal

Become productive in the map viewer: find a location, add data layers, measure distances, and share what you find with a teammate.

## Prerequisites

- A CDT account. Sign in at your organization's CDT URL.
- A modern browser with WebGL enabled.

## Tour the controls

| Control | Where it is | What it does |
|---------|-------------|--------------|
| **Search bar** | Top-left | Geocodes addresses and place names; also searches your organization's assets. |
| **Layer panel** | Left sidebar | Toggle federal, provincial, and municipal data layers. |
| **Bottom toolbar** | Bottom of viewport | Datasets, Compare Buildings, Share, and Measure tools. |
| **Settings** | Left sidebar | Language, support, and account. |

## Navigate the map

**Goal:** move the camera and orient yourself in 3D.

1. Drag with the left mouse button to pan.
2. Scroll the mouse wheel (or pinch on a trackpad) to zoom.
3. Hold the right mouse button and drag to tilt and rotate the camera in 3D.
4. Single-click a building footprint at street level to see its OSM attributes; CDT-managed buildings open the full Building Details panel.

**Result:** the map responds smoothly to all camera controls. Building footprints render as extruded polygons at LOD 1.3 once you are zoomed in.

## Find a location

**Goal:** centre the map on an address, place, or asset.

1. Click the search bar in the top-left.
2. Type a Canadian address, place name, or the name of an asset in your organization.
3. Pick a result from the dropdown. The map flies to it.

The search queries Pelias and Nominatim geocoders **and** your organization's own asset names, so saved buildings appear alongside public results.

**Result:** the camera centres on your chosen location and the search bar shows what you typed.

## Toggle a data layer

**Goal:** overlay an open-data layer on the map.

1. Click the **Datasets** icon in the bottom toolbar.
2. The layer panel opens, organized by jurisdiction:
   - **Federal** — Natural Resources Canada, Statistics Canada, Open Government, CIFFC.
   - **Provincial** — British Columbia, Quebec, Ontario, Alberta, and others.
   - **Municipal** — Ottawa, Toronto, Vancouver, Montreal, Calgary, Halifax, and more.
3. Tick a layer. It appears on the map immediately.
4. Click any feature on the layer to read its full attributes.

**Result:** the layer is visible on the map and you can read attributes per feature. You can stack as many layers as you need — CDT reprojects everything to WGS 84 with [Proj4js](https://proj4js.org/) so jurisdictions align.

The map uses **scale-dependent visibility**: more detailed layers reveal as you zoom in.

## Style a layer by an attribute

**Goal:** colour features by a numeric attribute (for example, census tracts by income).

1. With a layer active, click its name in the layer panel.
2. Open the **Style** subpanel.
3. Pick the attribute that should drive the colour gradient.
4. Choose a colour ramp and value range.
5. Click **Apply**.

**Result:** features are coloured by the attribute you selected.

## Measure a distance or area

**Goal:** measure with the ruler tool.

1. Click the **Measure** icon in the bottom toolbar.
2. Click two or more points on the map for a distance.
3. Close the polygon by clicking the first point again to get an area.
4. Press **Esc** to clear and start over.

The measurement uses [Turf.js](https://turfjs.org/) for client-side geospatial calculations. Distances are in metres; areas in square metres.

**Result:** the measured value is displayed next to the cursor and on each segment.

## Share a view

**Goal:** send a teammate the exact view you are looking at.

1. Click the **Share** icon in the bottom toolbar.
2. Copy the generated URL, or scan the QR code with your phone.
3. Send the URL to your collaborator.

The URL encodes longitude, latitude, zoom, pitch, bearing, the active map style, and the IDs of any loaded assets. Opening it loads the same scene without any re-navigation.

**Result:** anyone who follows the URL sees the same map, layers, and assets you do.

## Overlay an IFC model

**Goal:** see a BIM model georeferenced on the map.

IFC models are placed automatically when a building has a model attached.

1. Open a building from the buildings list.
2. If the building has an IFC attached, it appears as a 3D object at the building's coordinates.
3. Pan and zoom — the model stays anchored.

The platform synchronizes the MapLibre camera with a Three.js scene and uses **Fragments 2.0** with Level-of-Detail streaming so distant models render at lower fidelity to keep interaction fluid.

**Result:** the IFC sits in its real geographic position alongside open-data layers.

## Supported data formats

| Format | Use |
|--------|-----|
| **GeoJSON** | Most open data portals. |
| **WMS / WMTS** | OGC tiled raster imagery from geospatial services. |
| **Vector tiles** | Served from PostGIS via the Martin tile server. |

## Related

- [Concepts → GIS & Map Data](../concepts/gis-and-map-data.mdx)
- [Datasets & Open Data](./datasets-and-open-data.md)
- [BIM Viewer](./bim-viewer.md)
- [Components → Viewer](../components/viewer.md)
