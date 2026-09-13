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
| **CAD drawings** | DXF |
| **GIS data** | GeoJSON |
| **Documents** | PDF |
| **Media** | JPG, PNG, MP4, MP3, and other common video/audio formats |

Point clouds are converted to a Potree octree on upload, producing three files (`metadata.json`, `octree.bin`, `hierarchy.bin`) that the viewer streams. Those are conversion output, not something you upload.

## What happens to an IFC on upload

The server runs an optimization pipeline before storage:

1. Parses the raw IFC STEP file.
2. Converts geometry and metadata to **Fragments 2.0** (`.frag`) using FlatBuffers encoding.
3. Stores both the original IFC and the `.frag` version in MinIO.
4. Streams the `.frag` to the client at load time.

This cuts RAM use and load time sharply compared with parsing IFC in the browser, which matters for multi-gigabyte federated models.

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
