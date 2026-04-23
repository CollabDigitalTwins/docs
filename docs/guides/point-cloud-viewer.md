---
sidebar_position: 3
---

# Point Cloud Viewer

The point cloud viewer lets you visualize and interact with large 3D scanned datasets directly in the browser. It is built on [Potree](https://potree.org/), a WebGL-based renderer designed specifically for streaming and displaying massive point clouds efficiently.

## What is a Point Cloud?

Point clouds are collections of XYZ data points representing the surface of a scanned object or environment. They are produced by:

- **LiDAR scanners** — terrestrial or airborne
- **Laser scanners** — handheld or tripod-mounted
- **Photogrammetry** — derived from overlapping photographs

In the AECO industry, point clouds are used for as-built documentation, heritage preservation, site surveys, and generating the source geometry for BIM models.

## Supported Formats

| Format | Notes |
|---|---|
| **LAS** | Standard uncompressed point cloud format |
| **LAZ** | Compressed LAS — significantly smaller file sizes |
| **COPC** | Cloud Optimized Point Cloud — enables progressive streaming |
| **BIN** | Potree native binary format |

COPC is the recommended format for large datasets because it supports tile-based streaming: the viewer only downloads the points visible in the current viewport, keeping memory usage bounded regardless of total dataset size.

## Loading Data

Upload a point cloud file from the **File** tab in the left panel. Files are stored in MinIO object storage and streamed on demand. Multiple point clouds can be loaded simultaneously and viewed in the same scene.

## Navigation

Navigation follows the same mouse controls as the BIM viewer:

- **Left-click + drag** — orbit around the scene
- **Right-click + drag** — pan
- **Scroll** — zoom
- **Double-click** — set pivot point

The viewer renders billions of points smoothly by using Potree's tiling system: nearby points are rendered at full density, distant clusters at progressively lower density (LOD). This makes it practical on consumer hardware and mobile devices.

## Visualization Options

- **Color by** — RGB (if captured), elevation, intensity, classification, or a single flat color
- **Custom colormaps** — apply gradient palettes to any numeric attribute
- **Classification coloring** — standard LAS classification codes (ground, vegetation, building, etc.) are mapped to distinct colors automatically
- **Point size** — adjust globally or scale by distance from the camera
- **Imagery layers** — overlay aerial imagery onto the point cloud for reference

## Multi-Dataset Scenes

Load multiple point clouds in one scene to compare survey epochs or combine partial scans of a large site. Each dataset has its own visibility toggle, position offset, and color settings in the layer panel.

## Integration with BIM and GIS

Because Potree is built on Three.js, point clouds can be displayed in the same scene as IFC models. This allows you to:

- Compare as-built scans against design models
- Verify construction against drawings
- Provide spatial context for BIM elements within a surveyed environment

When placed on the map viewer, point clouds are georeferenced using their embedded coordinate data, so they align with surrounding GIS layers automatically.
