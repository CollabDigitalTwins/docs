---
sidebar_position: 4
---

# Point Clouds

A **point cloud** is a collection of data points in a 3D coordinate system, each representing a sampled location on the surface of an object or environment. Each point carries at minimum an XYZ position; most modern captures also include intensity values, RGB color from photography, and classification codes (ground, vegetation, building, water, etc.).

Point clouds are the primary output of reality capture technologies:

- **Terrestrial LiDAR** — tripod-mounted scanners for interior documentation, heritage recording, and site surveys
- **Airborne LiDAR** — aircraft or drone-mounted scanners for terrain modeling, forest inventory, and urban mapping
- **Photogrammetry** — 3D geometry derived from overlapping photographs; output includes both a dense point cloud and a textured mesh

In AECO practice, point clouds are used for as-built documentation, heritage preservation, construction monitoring, clash verification between design and built, and generating the source geometry for BIM models.

## Why Point Clouds in a Digital Twin?

A BIM model represents design intent. A point cloud represents physical reality. The gap between the two — tolerances, deviations, as-built conditions — is often where problems in construction and facility management live.

Including point clouds in a digital twin:

- Provides a ground-truth reference that design models can be compared against
- Documents the building or site at a moment in time (useful for condition assessment and insurance)
- Gives context for spaces that have not been modeled in BIM (common in retrofit projects)
- Enables precise dimensional analysis without physical access

## Formats

| Format | Notes |
|---|---|
| **LAS** | Standard binary format for LiDAR data. Stores XYZ, intensity, RGB, and classification per point |
| **LAZ** | Losslessly compressed LAS. Typically 5–10× smaller; the default for storage and exchange |
| **COPC** (Cloud Optimized Point Cloud) | A spatial index built into the LAZ container. Enables progressive tile-based streaming — the viewer only downloads the points visible in the current viewport |
| **BIN** | Potree native binary format, generated during the Potree conversion pipeline |

**COPC is the recommended format for CDT.** Because it supports streaming, multi-gigabyte datasets are practical on consumer hardware and mobile devices — the viewer does not need to download the full dataset before rendering begins.

## How CDT Renders Point Clouds

CDT's point cloud viewer is built on [Potree](https://potree.org/), a WebGL-based renderer designed for large-scale point cloud visualization. Potree uses an **octree-based level-of-detail (LOD)** system:

1. The dataset is pre-organized into a spatial tree of tiles at multiple detail levels
2. The viewer requests only the tiles covering the current viewport and camera distance
3. Close tiles are rendered at full density; distant tiles at progressively coarser density
4. As the camera moves, new tiles are streamed in and low-priority tiles are evicted

This keeps memory usage bounded regardless of total dataset size. Potree can render billions of points smoothly even on mobile devices.

Because Potree is built on Three.js — the same 3D engine as CDT's BIM viewer — point clouds can be displayed in the same scene as IFC models, allowing direct visual comparison between design and as-built.

## Visualization Options

- **Color mode** — RGB (if captured), elevation gradient, intensity, classification code, or flat color
- **Custom colormaps** — apply gradient palettes to any numeric attribute
- **Classification coloring** — standard LAS/LAZ classification codes (ground, low/medium/high vegetation, building, water, noise) are mapped to distinct colors automatically
- **Point size** — global or distance-scaled
- **Imagery overlay** — drape aerial imagery over the point cloud for visual reference

## Multi-Dataset Scenes

Multiple point clouds can be loaded in one scene simultaneously — useful for:

- Comparing survey epochs (before/after construction)
- Combining partial scans (indoor + outdoor, or multiple floors)
- Overlaying point clouds from different sensors (terrestrial + aerial)

Each dataset has its own visibility toggle, position offset, color settings, and classification filter in the layer panel.

## Integration with BIM and GIS

When a point cloud carries geographic coordinates (from GPS or ground control points), CDT places it in the correct position on the map viewer. It aligns with surrounding GIS layers — parcel boundaries, building footprints, topography — automatically.

Within the BIM viewer, a point cloud and one or more IFC models can occupy the same scene, enabling side-by-side comparison of design model and physical reality at element level.

See the [Point Cloud Viewer guide](../guides/point-cloud-viewer) for upload and navigation instructions.
