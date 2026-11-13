---
sidebar_position: 5
title: File Management
description: Upload, organize, and manage files attached to buildings and sites.
---

# File Management

CDT stores binary assets in [MinIO](https://min.io/), an open-source object store with the S3 API. Metadata and relational attributes live in PostgreSQL.

Uploading requires the **User** or **Admin** role on the target building or site.

## Upload a file

Open the building → **Files** tab → **Upload**, then pick one or more files. The platform detects the file type, routes it to the right pipeline, stores the binary in MinIO, and creates a metadata record.

## Supported file types

| Category | Formats |
|----------|---------|
| **BIM models** | IFC |
| **3D geometry** | glTF, GLB, FBX, OBJ, Collada |
| **Point clouds** | LAS, LAZ, COPC (`.copc.laz`), E57 |
| **Gaussian splats** | SPZ, PLY, SPLAT, KSPLAT, SOG |
| **CAD drawings** | DXF |
| **GIS data** | GeoJSON |
| **Documents** | PDF |
| **Media** | JPG, PNG, MP4, MP3, and other common video/audio formats |

Gaussian splats need no conversion: the viewer reads the uploaded file directly, so they appear under **Models** as soon as the upload finishes. SPZ is the most compact and the fastest to load; PLY is the most common export but the largest.

Point clouds are converted to a Potree octree on upload, producing three files (`metadata.json`, `octree.bin`, `hierarchy.bin`) that the viewer streams. Those are conversion output, not something you upload.

## What happens to an IFC on upload

Your browser prepares the model before it is stored:

1. Reads the georeference from the IFC STEP file (`IfcMapConversion` and its `IfcProjectedCRS`), if the model has one.
2. Converts geometry and metadata to **Fragments 2.0** (`.frag`) using FlatBuffers encoding.
3. Uploads the `.frag` to object storage. The viewers stream it at load time.

Fragments cut RAM use and load time sharply compared with parsing IFC on every load, which matters for multi-gigabyte federated models.

A georeferenced IFC is placed on the map at its surveyed location and turned to its true orientation. Its height on the map is measured from the terrain. The height from the IFC is kept for reference, and you can adjust the elevation with **Move**.

## Place and geolocate files

- **Linking to a building.** A file you upload from a building, or place on a building's footprint on the map, is linked to that building. It is then listed in the building's **Files** tab in the BIM viewer.
- **Placing in the BIM viewer.** An IFC model loads at the scene origin. A 3D model, CAD drawing or splat that has no position yet shows **Place** in its menu: double-click in the scene to put it there.
- **Geolocating.** **Geolocate** in a file's menu sets where a BIM model, point cloud, 3D model or splat stands on the map. Pick the file's coordinate system, enter its coordinates, height and rotation from north, and check the converted latitude and longitude before saving.
  - **Coordinate systems:** WGS 84, NAD83 and NAD83(CSRS) UTM zones, NAD83(CSRS) MTM zones and WGS 84 UTM zones. For any other system, paste a proj4 definition.
  - **Revert:** the source coordinates are kept when you move the file on the map, so **Revert to source position** brings it back.

## File metadata

Every file record stores its name, format, author, created and updated timestamps, linked IFC `GlobalId`, location (longitude/latitude or XYZ), CRS, parent building, and owning organization.

GlobalId linkage means sensor data, BCF topics, IDS results, and media all pin to the same physical asset across different file types.

## Permissions

File visibility and editability follow the organization's role assignments, enforced server-side. See [Authorization → Permission reference](../authorization/permission-reference.mdx) for the full matrix.

## Storage architecture

The MinIO instance for hosted CDT runs on Canadian infrastructure (Fullhost VPS in Vancouver and Toronto) for data sovereignty, so all storage and processing remain within Canadian boundaries. Network policy restricts database and storage access to the application server's IP only.

Self-hosted deployments inherit the same architecture. See [Self-Hosting](../deployment/self-hosting.md).

## Related

- [Buildings & Sites](./buildings-and-sites.md)
- [BIM Viewer](./bim-viewer.md)
- [Components → File Details](../components/file-details.md)
- [Architecture → Data Layer](../architecture/data-layer.mdx)
