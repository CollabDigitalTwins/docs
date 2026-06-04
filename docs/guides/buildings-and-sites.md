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

- A CDT account with **User** or **Admin** role to create or edit assets.
- A clear idea of the geographic boundary — even a rough one.

## Create a Site

**Goal:** set up a Site so you can group buildings under it.

You can create a Site by drawing it on the map, or from the Sites list.

### Draw it on the map

1. Open the map viewer and navigate to the area.
2. Click **New Site**.
3. Enter a **Name**.
4. Start drawing and click on the map to place the boundary points. Close the boundary by clicking the first point again.

The Site is created when you close the boundary — there are no separate longitude/latitude fields and no Save button; the location comes from the shape you draw.

### From the Sites list

Open the **Sites** list and add a new Site there. Use this when you want to add a Site without drawing on the map.

**Result:** the Site appears on the map and in the Sites list.

## Attach a Building to a Site

**Goal:** add a Building under a Site.

1. Open the Site.
2. Switch to the **Associated Buildings** tab.
3. Click **Attach Building**.
4. Fill in the building's name and any other required fields shown in the dialog.
5. Click **Save**.

**Result:** the building appears as a marker on the map and in the buildings list under the Site.

## Attach files to a Building

**Goal:** associate IFC, point clouds, drawings, or documents with a Building.

1. Open the building.
2. Switch to the **Files** tab.
3. Click **Upload** and choose the files.
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
| Year of Building Construction | Used for filtering and retrofit planning. |
| Coordinate | Longitude / latitude of the building origin. |

4. Click **Save**.

**Result:** the record is updated and the change appears immediately in lists and on the map.

## Filter and search

**Goal:** find a subset of buildings on a Site.

1. Open the Buildings list.
2. Use the filter controls at the top:
   - **Construction year range**
   - **Site**
3. Click any result to open it.

**Result:** the list narrows to matching buildings; the map highlights them in place.

## Storage layers

Files attached to a building are split across two storage layers:

- **Binary payloads** — stored in MinIO (S3-compatible).
- **Metadata** — stored in PostgreSQL, indexed for fast querying.

The platform also distinguishes between:

- **Georeferenced files** — defined by longitude/latitude, placed on the map automatically.
- **Local Cartesian files** — defined by XYZ coordinates relative to the building origin, displayed in the BIM viewer.

Both types record provenance (author, timestamp) and respect permission-based access.

## Access control

A Building's files and metadata are visible to members of its Organization based on their role:

| Role | Permissions |
|------|-------------|
| **Viewer** | Read files and metadata. |
| **User** | Read everything; create, edit, and delete buildings, sites, files, and comments. |
| **Admin** | Full control, including managing members and organization settings. |

Roles enforce on the API server-side, not just in the UI. See [Authorization → Permission reference](../authorization/permission-reference.mdx) for the full matrix.

## Related

- [Map Viewer](./map-viewer.md)
- [File Management](./file-management.md)
- [Authorization → Managing roles](../authorization/managing-roles.mdx)
- [Architecture → Data Model](../architecture/data-model.mdx)
