---
sidebar_position: 5
title: File Management
description: Upload, version, share, and manage files attached to buildings and sites.
---

# File Management

CDT stores all binary assets in [MinIO](https://min.io/), a high-performance open-source object store with the S3 API. Metadata and relational attributes live in PostgreSQL.

## Goal

Upload files to a building or site, see their version history, and understand where they go.

## Prerequisites

- A CDT account with at least Contributor permissions on the target Building or Site.
- Files in one of the supported formats listed below.

## Upload a file

**Goal:** add a file to a Building.

There are two upload paths:

### Path 1 — Drag and drop

1. Open the building (or open the BIM Viewer with the building active).
2. Drag the file onto the viewport or the **Files** tab.
3. The platform detects the type, routes it to the right pipeline, stores the binary in MinIO, and creates a metadata record.

### Path 2 — File panel

1. Open the building → **Files** tab → **Upload**.
2. Pick one or more files.
3. Optionally adjust placement and metadata before they are added to the scene.

**Result:** the files appear in the file list and are downloadable, previewable, and (if applicable) loadable in the BIM or point cloud viewers.

## Supported file types

| Category | Formats |
|----------|---------|
| **BIM models** | IFC |
| **3D geometry** | glTF, GLB, FBX, OBJ, Collada |
| **Point clouds** | LAS, LAZ, COPC, BIN |
| **CAD drawings** | DXF |
| **GIS data** | GeoJSON |
| **Documents** | PDF |
| **Media** | JPG, PNG, MP4, MP3, and other common video/audio formats |

## What happens to an IFC on upload

When you upload an IFC, the server runs an optimization pipeline before storage:

1. Parses the raw IFC STEP file.
2. Converts geometry and metadata to **Fragments 2.0** (`.frag`) using FlatBuffers encoding.
3. Stores both the original IFC and the `.frag` version in MinIO.
4. Streams the `.frag` to the client at load time.

This dramatically reduces RAM and load time compared with parsing IFC in the browser — important for multi-gigabyte federated models.

## See file version history

**Goal:** view or restore an older version of a file.

MinIO versioning is enabled on all buckets. Every re-upload preserves the previous version.

1. Open the building → **Files** tab.
2. Click the **History** icon on the file row.
3. The dialog lists every version with its uploader and timestamp.
4. Click **Restore** on any version to make it current, or **Download** to fetch that specific version.

**Result:** the file is restored or downloaded as you chose. Useful for ISO 19650-style information management.

## Inspect file metadata

Every file record stores:

| Field | Description |
|-------|-------------|
| Name | Display name. |
| Format | File type. |
| Author | User who uploaded it. |
| Created / Updated | Timestamps. |
| GlobalId | Linked IFC GlobalId (for BIM files). |
| Location | Longitude/latitude or XYZ coordinates. |
| CRS | Coordinate reference system. |
| Building | Parent Building record. |
| Organization | Access-control scope. |

GlobalId linkage means sensor data, BCF topics, IDS results, and media all pin to the same physical asset across different file types.

## Mark a file private or shared

**Goal:** restrict a file to yourself, or make it visible to all members of your Organization.

1. Open the file's details.
2. Toggle **Visibility** between **Private** (only you) and **Organization** (all members with Viewer permissions or higher).
3. The change applies immediately — no save step.

**Result:** the file's visibility matches what you selected.

## Permissions

File visibility and editability follow the Organization's role assignments. A file uploaded by one Organization member is accessible to all members with Viewer permissions or higher, unless marked private.

For the full matrix, see [Authorization → Permission reference](../authorization/permission-reference.md).

## Storage architecture

The MinIO instance for the hosted CDT runs on Canadian infrastructure (Fullhost VPS in Vancouver and Toronto) for data sovereignty. All storage and processing remain within Canadian boundaries. Network policy restricts database and storage access to the application server's IP only.

Self-hosted deployments inherit the same architecture — see [Self-Hosting](../deployment/self-hosting.md) and [Production Deployment](../deployment/production.md) for hardening guidance.

## Related

- [Buildings & Sites](./buildings-and-sites.md)
- [BIM Viewer](./bim-viewer.md)
- [Components → File Details](../components/file-details.md)
- [Architecture → Data Layer](../architecture/data-layer.md)
