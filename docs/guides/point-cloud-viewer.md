---
sidebar_position: 3
title: Point Cloud Viewer
description: Load LiDAR or photogrammetry datasets, navigate them in 3D, and combine them with BIM and map context.
---

# Point Cloud Viewer

The point cloud viewer visualizes large 3D scanned datasets directly in the browser. It is built on [Potree](https://potree.org/) — a WebGL renderer specifically designed to stream and display massive point clouds without overwhelming client memory.

## Goal

Load a point cloud, navigate it, change how it is coloured, and combine it with other CDT data.

## Prerequisites

- A CDT account.
- A point cloud file in LAS, LAZ, COPC, or Potree BIN format. COPC is recommended for large datasets because it streams progressively.

## Load a dataset

**Goal:** get a point cloud into the viewer.

1. Open the Point Cloud Viewer from the left sidebar.
2. Use the **File** tab → **Upload** to select your file. Files stream from MinIO on demand.
3. Once loaded, the cloud appears in the viewport at its embedded coordinates.

**Result:** the dataset is visible and the camera is framed on it.

## Navigate the scene

| Control | What it does |
|---------|--------------|
| **Left-click + drag** | Orbit |
| **Right-click + drag** | Pan |
| **Scroll wheel** | Zoom |
| **Double-click** | Set the orbit pivot point |

The viewer renders billions of points smoothly using Potree's tiling: nearby points render at full density and distant clusters at progressively lower density (LOD).

**Result:** smooth navigation regardless of dataset size.

## Change how points are coloured

**Goal:** make the cloud easier to read by colouring by an attribute.

1. Open the **Style** panel for the loaded cloud.
2. Pick a colour mode:
   - **RGB** — uses captured colour, if present.
   - **Elevation** — gradient by Z coordinate.
   - **Intensity** — return strength from the LiDAR sensor.
   - **Classification** — standard LAS classes (ground, vegetation, building, etc.).
   - **Flat colour** — single colour, useful for combining with other data.
3. Optionally apply a **custom colour ramp** to a numeric attribute.
4. Adjust **Point size** globally or scale by distance from the camera.

**Result:** the cloud is recoloured according to your settings.

## Overlay aerial imagery

**Goal:** add a basemap underneath or beside the cloud for orientation.

1. Open the **Imagery** subpanel in the layer settings.
2. Pick a tile source.
3. The imagery renders as a textured plane at the cloud's elevation.

**Result:** the cloud sits over a recognizable basemap.

## Compare multiple datasets

**Goal:** load two surveys to compare epochs, or stitch partial scans of one site.

1. Upload each file via the **File** tab.
2. Each cloud has its own visibility toggle, position offset, and colour settings in the layer panel.
3. Toggle visibility individually to flip between epochs, or display them simultaneously with different colours.

**Result:** multiple clouds in one scene, independently controllable.

## Combine with BIM and map context

Because Potree is built on Three.js, point clouds can share a scene with IFC models. This supports:

- Comparing as-built scans against design models
- Verifying construction against drawings
- Adding spatial context to BIM elements within a surveyed environment

When placed on the map viewer, georeferenced clouds align with surrounding GIS layers automatically using their embedded CRS.

## Supported formats

| Format | Notes |
|--------|-------|
| **LAS** | Standard uncompressed point cloud format |
| **LAZ** | Compressed LAS — smaller files, same data |
| **COPC** | Cloud Optimized Point Cloud — best for large datasets, streams progressively |
| **BIN** | Potree native binary format |

For large datasets, COPC is the recommended format because the viewer downloads only the points visible in the current viewport.

## Troubleshooting

**Cloud appears as a single dot.** The CRS is unknown or wildly different from the map view. Check the file metadata and confirm the XYZ extent.

**Performance is poor.** Reduce point size or LOD level in the Style panel. Close other browser tabs that hold WebGL contexts.

For more, see [Troubleshooting → Viewers](../getting-started/troubleshooting.md#viewers).

## Related

- [Concepts → Point Clouds](../concepts/point-clouds.md)
- [BIM Viewer](./bim-viewer.md)
- [File Management](./file-management.md)
- [Components → Point Cloud Tools](../components/point-cloud-tools.md)
