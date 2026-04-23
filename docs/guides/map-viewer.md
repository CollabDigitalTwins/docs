---
sidebar_position: 1
---

# Map Viewer

The map viewer is the primary interface when you open CDT. It is built on [MapLibre GL JS](https://maplibre.org/) — a fully open-source WebGL map renderer — and serves as the spatial anchor for all other data types in the platform.

## Navigation

Use your mouse or trackpad to pan, zoom, and tilt the map. MapLibre supports full 3D camera control: hold **right-click + drag** (or two-finger rotate on trackpad) to pitch and bearing-rotate the view. The map uses the **WGS 84** coordinate reference system as its base.

For context, the map displays [OpenStreetMap](https://www.openstreetmap.org/) building footprints extruded to approximate height (LOD 1.3), giving you volumetric urban context without loading full BIM models.

## Geocoder

The search bar in the top-left queries both **Pelias** and **Nominatim** geocoder APIs, and also searches the platform's own database of loaded assets. Type any Canadian address, place name, or asset name to jump to that location.

## Layer Panel

A collapsible side menu shows available data layers organized by scale:

- **Federal** — Natural Resources Canada (NRCan), Statistics Canada, Open Government
- **Provincial** — Open Ontario, Données ouvertes Québec, Open BC, and others
- **Municipal** — Open Ottawa, Open Toronto, Vancouver Open Data, etc.

The map uses **scale-dependent visibility**: layers reveal progressively more detail as you zoom in. At the national level you see aggregated datasets; zooming into a city reveals neighbourhood-scale data; zooming further shows parcel and building-level information.

You can stack layers from different sources and scales simultaneously. Click any feature to access its full metadata directly on the map.

## Open Data Integration

The platform fetches data in real time directly from its original sources — nothing is cached or replicated locally. Supported formats include:

- **GeoJSON** — vector features from most open data portals
- **WMS / WMTS** — tiled raster imagery from geospatial services
- **Vector tiles** — served from PostGIS via the Martin tile server

Each layer displays comprehensive metadata so you always know the provenance of what you are looking at.

## Styling Tools

You can style any layer by a numeric attribute — for example, colouring census tracts by population density or housing units by median rent. This makes it easy to surface spatial patterns in datasets without any GIS software.

## Measurement Tool

Click the ruler icon to measure distances and areas directly on the map. Click two or more points to get distances; close a polygon to get area. Uses the [Turf.js](https://turfjs.org/) library for client-side geospatial calculations.

## BIM on the Map

IFC models can be overlaid on the map as georeferenced 3D objects. The platform synchronizes the MapLibre camera with a Three.js scene, so BIM geometry appears correctly positioned relative to surrounding urban context. Models are loaded as Fragments and optimized with Level of Detail (LOD): distant models render at lower detail to keep interaction fluid.

Supported approaches for loading geometry onto the map:

1. **Fragments 2.0** (preferred) — binary IFC format for fast streaming and LOD
2. **glTF / GLB** — pre-converted exterior geometry for faster load times
3. **Three.js layer** — full IFC parsed at runtime via That Open Company libraries

## Share

The share tool generates a URL that encodes the full map state: longitude, latitude, zoom, pitch, bearing, active map style, and the IDs of any loaded assets. Share this URL with a colleague and they open the exact same view — no re-navigation needed.

## Coordinate Reprojection

Canadian open data often arrives in local projections such as MTM or UTM. The platform uses [Proj4js](https://proj4js.org/) to reproject all incoming datasets to WGS 84 automatically, so layers from different jurisdictions align correctly.
