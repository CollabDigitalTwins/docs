---
sidebar_position: 6
---

# Multi-Viewer Architecture

CDT exposes data through three specialized viewers — Map, BIM, and Point Cloud — each optimized for a different data type and scale. They are not separate applications; they share the same underlying project data, coordinate system, and storage layer, and can be used in combination within a single session.

## The Three Viewers

### Map Viewer
**Library:** [MapLibre GL JS](https://maplibre.org/)  
**Data types:** GeoJSON, WMS/WMTS, vector tiles, OpenStreetMap, georeferenced BIM models  
**Scale:** National → municipal → site

The map viewer is the entry point for any CDT project. It provides geographic context — the coordinate system that everything else is positioned within. Open data layers from federal, provincial, and municipal sources are stacked here. Buildings from the platform's database appear as interactive features on the map. Georeferenced IFC models are overlaid as Three.js layers synchronized with the MapLibre camera.

### BIM Viewer
**Library:** [That Open Company Engine](https://thatopen.com/) (web-ifc + Three.js)  
**Data types:** IFC, IDS, BCF, DXF, glTF/GLB, FBX, OBJ  
**Scale:** Building → storey → element

The BIM viewer is designed for detailed interrogation of building models. It provides access to the full IFC schema — geometry, properties, spatial hierarchy, classification — alongside coordination tools (BCF topics, IDS validation, clipping planes, measurements). Models uploaded here are stored in the database and appear in the map viewer at their geographic position automatically.

### Point Cloud Viewer
**Library:** [Potree](https://potree.org/) (Three.js-based)  
**Data types:** LAS, LAZ, COPC, BIN  
**Scale:** Building → site → urban area

The point cloud viewer handles large reality capture datasets that would be impractical to load in a GIS tool. It uses tile-based streaming and LOD to render billions of points in real time. Because Potree shares Three.js with the BIM viewer, point clouds and IFC models can occupy the same scene simultaneously for as-built vs. design comparison.

---

## Shared Infrastructure

All three viewers draw from the same backend:

```
                        Browser
┌──────────────┐  ┌──────────────┐  ┌──────────────┐
│  Map Viewer  │  │  BIM Viewer  │  │  Point Cloud │
│  (MapLibre)  │  │ (That Open)  │  │   (Potree)   │
└──────┬───────┘  └──────┬───────┘  └──────┬───────┘
       │                 │                 │
       └─────────────────┴─────────────────┘
                         │
                    Next.js API
                         │
          ┌──────────────┴──────────────┐
          │                             │
     PostgreSQL                       MinIO
       + PostGIS                  (object storage)
    (structured data)          (binary files: IFC,
                                LAS, images, etc.)
```

- **PostgreSQL + PostGIS** — stores building and site records, user metadata, sensor readings, BCF topics, and spatial queries
- **MinIO** — stores binary assets: IFC files, Fragments, point clouds, media uploads. S3-compatible, versioned, Canadian-hosted
- **Martin** — generates vector tiles from PostGIS on demand for the map viewer
- **Next.js API** — validates all writes, runs the IFC → Fragments conversion pipeline, enforces role-based access control

---

## Coordinate System Alignment

Everything in CDT is anchored to **WGS 84** (EPSG:4326). When you upload an IFC file, the server reads its georeferencing information (IfcSite, IfcMapConversion) and stores the longitude/latitude origin. When the file is loaded in the map viewer, the Three.js scene is positioned at those coordinates and the camera is synchronized — so the building appears at its correct location on the globe.

Point clouds with GPS coordinates are treated the same way. Local Cartesian files (XYZ-only, no geographic reference) are stored with their Building's coordinate and displayed in the BIM viewer with an explicit local origin.

Proj4js handles reprojection for incoming open data that arrives in local coordinate systems (MTM, UTM, provincial variants), converting to WGS 84 before rendering.

---

## How the Viewers Interact

A typical workflow moves between all three:

1. **Map Viewer** — find the site, stack open data layers (zoning, flood zones, transit) for context
2. **Buildings panel** — select a building to open its asset list
3. **BIM Viewer** — load the IFC model, inspect properties, validate against IDS, create BCF topics for coordination
4. **Point Cloud Viewer** — load a LiDAR scan of the same building, compare as-built dimensions against the model
5. **Map Viewer** — return to urban scale, the model visible in its geographic context alongside GIS layers

The share tool in each viewer generates a URL encoding the full viewer state (location, zoom, active assets, camera position), so any view can be handed to a collaborator who arrives at the exact same position.
