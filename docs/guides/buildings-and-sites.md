---
sidebar_position: 4
title: Buildings & Sites
description: Create and manage buildings and sites, attach files and sensors, and use role-based access controls.
---

# Buildings & Sites

CDT organizes assets in a two-level hierarchy: **Sites** contain **Buildings**, and Buildings contain files and sub-assets. This maps directly to how real-world facilities are managed — a campus or district is a Site; the individual facilities within it are Buildings.

## Goal

Create a Site, add Buildings to it, attach files, and configure access for your team.

## Prerequisites

- A CDT account with at least Manager permissions to create or edit assets.
- A clear idea of the geographic boundary — even a rough one.

## Create a Site

**Goal:** set up a Site so you can group buildings under it.

1. Open the map viewer and navigate to the area.
2. Click **New Site** in the left panel.
3. Fill in:
   - **Name** and **description**.
   - **CRS** (coordinate reference system) — the projection used for files inside the Site (e.g., UTM Zone 17N, MTM, or WGS 84).
   - **Boundary** — draw on the map or enter coordinates.
   - **Organization** — which org owns this Site.
4. Click **Save**.

**Result:** the Site appears in the map and in the Sites list. Its CRS is now the default for any file uploaded inside it.

## Create a Building

**Goal:** add a Building under a Site.

1. Select the parent Site on the map (or pick from the dropdown if you are already in the Buildings list).
2. Click **Add Building**.
3. Fill in:
   - **Name** — human-readable identifier.
   - **Typology** — pick from the [bSDD](https://www.buildingsmart.org/users/services/buildingsmart-data-dictionary/) classification.
   - **Construction year** — for portfolio filtering and retrofit analysis.
   - **Coordinate** — drop a pin on the map or paste latitude/longitude.
4. Click **Save**.

**Result:** the building appears as a marker on the map and in the buildings list.

## Attach files to a Building

**Goal:** associate IFC, point clouds, drawings, or documents with a Building.

1. Open the building.
2. Switch to the **Files** tab.
3. Drag-and-drop files onto the panel, or click **Upload** to choose them.
4. The file metadata is automatically linked to the building. IFC files are converted to Fragments format on upload.

**Result:** files are listed under the building and accessible to anyone with permission.

For details on supported formats and the upload pipeline, see [File Management](./file-management.md).

## Edit Building metadata

**Goal:** correct or augment the data record for a Building.

1. Open the building.
2. Click **Edit** in the details panel.
3. Update any of:

| Field | Description |
|-------|-------------|
| Name | Display name. |
| bSDD classification | Standardized building type. |
| Construction year | Used for filtering and retrofit planning. |
| Coordinate | Longitude / latitude of the building origin. |
| CRS | Coordinate reference system for local Cartesian files. |
| Organization | Access-control scope. |

4. Click **Save**.

**Result:** the database record is updated and the change appears immediately in lists and on the map.

## Filter and search

**Goal:** find a subset of buildings — for example, all pre-1980 residential buildings on a Site.

1. Open the Buildings list.
2. Use the filter controls at the top:
   - **bSDD typology** (office, residential, industrial, etc.)
   - **Construction year range**
   - **Site**
   - **Organization**
3. Click any result to open it.

**Result:** the list narrows to matching buildings; the map highlights them in place.

## Storage layers

Files attached to a building are split across two storage layers:

- **Binary payloads** — stored in MinIO (S3-compatible), versioned automatically.
- **Metadata** — stored in PostgreSQL, indexed for fast querying.

The platform also distinguishes between:

- **Georeferenced files** — defined by longitude/latitude, placed on the map automatically.
- **Local Cartesian files** — defined by XYZ coordinates relative to the building origin, displayed in the BIM viewer.

Both types support version history, provenance (author, timestamp), and permission-based access.

## Access control

A Building's files and metadata are visible to members of its Organization based on their role. Typical defaults:

| Role | Permissions |
|------|-------------|
| **Viewer** | Read files and metadata. |
| **Contributor** | Upload files, add comments and media. |
| **Manager** | Edit building records, manage members. |
| **Admin** | Full control, including deletion and CRS changes. |

Roles enforce on the API server-side, not just in the UI. See [Authorization → Permission reference](../authorization/permission-reference.mdx) for the full matrix.

## Related

- [Map Viewer](./map-viewer.md)
- [File Management](./file-management.md)
- [Authorization → Managing roles](../authorization/managing-roles.mdx)
- [Architecture → Data Model](../architecture/data-model.mdx)
