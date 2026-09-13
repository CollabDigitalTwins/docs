---
sidebar_position: 1
title: Map Viewer
description: Navigate the map, search for places, measure, share views, and see IFC models in their real location.
---

# Map Viewer

The map viewer is what you see when you open CDT, and the spatial anchor for every other data type in the platform. It is built on [MapLibre GL JS](https://maplibre.org/), a fully open-source WebGL renderer.

You need a CDT account and a browser with WebGL enabled.

## The controls

| Control | Where it is | What it does |
|---------|-------------|--------------|
| **Search bar** | Top-left | Geocodes addresses and place names, and searches your organization's assets |
| **Layer panel** | Left sidebar | Toggle national, provincial/territorial, and municipal data layers |
| **Bottom toolbar** | Bottom of viewport | Datasets, Compare Buildings, Share, and Measure |
| **Settings** | Left sidebar | Language, support, and account |

## Navigate the map

Drag with the left mouse button to pan, scroll to zoom, and hold the right mouse button to tilt and rotate in 3D. Building footprints render as extruded polygons at LOD 1.3 once you are zoomed in.

Single-click a footprint at street level to see its OSM attributes. CDT-managed buildings open the full Building Details panel instead.

## Find a location

Click the search bar, type a Canadian address, place name, or asset name, then pick a result. The map flies to it.

Search queries the Pelias and Nominatim geocoders alongside your organization's own asset names, so saved buildings appear next to public results.

## Add data layers

Click **Datasets** in the bottom toolbar to open the layer panel, tick a layer, and click any feature to read its attributes. Layers stack, and the map uses scale-dependent visibility so more detailed layers reveal as you zoom in.

See [Datasets & Open Data](./datasets-and-open-data.md) for the full source catalogue, styling layers by attribute, and supported formats.

## Measure a distance or area

1. Click **Measure** in the bottom toolbar.
2. Click two or more points for a distance.
3. Click the first point again to close a polygon and get an area.
4. Press **Esc** to clear.

Measurements use [Turf.js](https://turfjs.org/) client-side. Distances are in metres, areas in square metres.

## Share a view

Click **Share** in the bottom toolbar, then copy the URL or scan the QR code. The URL encodes longitude, latitude, zoom, pitch, bearing, the active map style, and the IDs of any loaded assets, so whoever opens it sees your exact scene with no re-navigation.

## Overlay an IFC model

A building with an IFC attached places its model automatically. Open the building from the buildings list and the model appears as a 3D object at the building's coordinates, staying anchored as you pan and zoom.

The platform synchronizes the MapLibre camera with a Three.js scene and streams **Fragments 2.0** with Level-of-Detail, so distant models render at lower fidelity and interaction stays fluid.

## Related

- [Concepts → GIS & Map Data](../concepts/gis-and-map-data.mdx)
- [Datasets & Open Data](./datasets-and-open-data.md)
- [BIM Viewer](./bim-viewer.md)
