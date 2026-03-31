---
sidebar_position: 1
---

# What is a Digital Twin?

An introduction to digital twin technology and how CDT implements it for cities, buildings, and infrastructure.

## Overview

A **digital twin** is a virtual replica of a physical asset or system that stays synchronized with real-world data over time. Think of it as a living model — not a static snapshot, but a connected representation that reflects the current state of something in the real world, whether that is a single building, a neighbourhood, or an entire city.

When you work with a digital twin, you are interacting with structured data that mirrors physical reality: geometry, materials, sensors, spatial relationships, and historical records all in one place. Changes in the real world flow into the model; analysis and decisions made in the model can inform action in the real world.

:::info What makes a twin "digital"?
The word "twin" signals the bidirectional relationship. A 3D model sitting on a hard drive is not a twin — it is a file. A digital twin is connected to authoritative data sources and reflects reality as it changes.
:::

## Why Digital Twins Matter

Cities and the built environment generate enormous amounts of data — permit records, utility networks, sensor readings, satellite imagery, engineering drawings. The problem is not a lack of data; it is that data lives in disconnected silos, owned by different departments, in incompatible formats, accessible only to specialists who know where to look.

Digital twins address this directly:

- **Better decisions.** When planners, engineers, and community members share the same spatial model, they can evaluate options against real constraints rather than assumptions. A proposed transit corridor can be tested against existing building footprints, flood zones, and ridership data before any ground is broken.
- **Reduced waste.** Clash detection in a building model catches conflicts between structural, mechanical, and electrical systems before construction. Finding a problem in a model costs a fraction of what it costs to fix in the field.
- **Collaborative planning.** A shared, web-accessible twin lets architects, city staff, and the public look at the same data simultaneously. Decisions become easier to communicate and easier to scrutinize.

## How CDT Implements Digital Twins

CDT (Collab Digital Twins) is a Canadian non-profit platform purpose-built for the built environment. It takes a specific approach to the digital twin concept, prioritizing openness, scale, and accessibility.

### Open Standards — No Vendor Lock-in

CDT stores and exchanges data using established open standards:

| Standard | What it covers |
|----------|----------------|
| **IFC** (Industry Foundation Classes) | Buildings and infrastructure geometry and metadata |
| **CityGML** | City-scale 3D models including terrain, roads, and land use |
| **GeoJSON** | Vector geographic features and attributes |
| **COPC** (Cloud Optimized Point Cloud) | Large-scale 3D point cloud data from LiDAR and photogrammetry |

Your data is not locked into a proprietary format. You can bring existing files into CDT and export them to any tool that reads the same standards.

### Multi-Scale: Buildings to Cities

CDT operates across spatial scales in a single session. You can start with a city-wide map view, zoom into a neighbourhood, open a building's BIM model, and inspect a structural element — without switching applications. Data from federal open portals, provincial datasets, and site-specific surveys all coexist in the same coordinate system.

### Multi-Data: GIS + BIM + Point Clouds + IoT

Most platforms handle one data type well and tolerate others poorly. CDT treats geographic information (GIS), building information models (BIM), point clouds, and live sensor streams as first-class data sources that can be displayed and queried together.

:::info What is BIM?
BIM (Building Information Modeling) refers to structured 3D models of buildings that include not just geometry but metadata — materials, fire ratings, floor areas, ownership, and more. The IFC format is the open standard for exchanging BIM data.
:::

### Web-Based: No Desktop Software Required

CDT runs entirely in the browser. There is nothing to install. Anyone with a link and the right permissions can open a project, explore a model, and leave comments — whether they are on a construction site on a tablet or reviewing a proposal from a city council chamber.

### Collaborative: Multi-User with Role-Based Access

Digital twins are only useful if the right people can access them. CDT supports multiple simultaneous users and lets administrators assign roles that control who can view, annotate, upload, or administer each project.

## Key Components

CDT exposes the digital twin through three specialized viewers, each suited to a different data type:

- **Map Viewer** — A MapLibre-powered 2D/3D web map for GIS data, city models, and spatial context. This is typically your starting point for any project.
- **BIM Viewer** — Powered by That Open Company's open-source IFC engine, this viewer lets you open and inspect IFC building models directly in the browser without any plugin.
- **Point Cloud Viewer** — Built on Potree, this viewer handles large LiDAR and photogrammetry datasets (COPC format) that would be impractical to load in a conventional GIS tool.

All three viewers draw from the same underlying project data stored in PostgreSQL and object storage (MinIO), so a building you upload in the BIM viewer appears in its correct geographic position in the map viewer automatically.

## Next Steps

Now that you have a shared vocabulary, explore the data types that make up a CDT project:

- [BIM & IFC](./bim-and-ifc) — How building models are structured and what you can do with them in CDT
- [GIS & Map Data](./gis-and-map-data) — Geographic data formats, coordinate systems, and the open data portals CDT connects to
- [Architecture Overview](../architecture/overview) — How the platform is built under the hood
