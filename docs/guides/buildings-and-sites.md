---
sidebar_position: 4
title: Buildings & Sites
description: Create and manage buildings and sites, attach files and sensors, and use role-based access controls.
---

# Buildings & Sites

CDT organizes assets in a two-level hierarchy: **Sites** contain **Buildings**, and Buildings contain files and sub-assets. A campus or district is a Site; the individual facilities within it are Buildings.

Creating or editing assets requires the **User** or **Admin** role.

## Create a Site

You can create a Site by drawing it on the map, or from the Sites list.

**On the map:** navigate to the area, click **New Site**, enter a **Name**, then click to place the boundary points and close the boundary by clicking the first point again. The Site is created when you close the boundary. There are no separate longitude/latitude fields and no Save button, because the location comes from the shape you draw.

**From the Sites list:** add a new Site there instead, when you do not want to draw on the map.

## Attach a Building to a Site

Open the Site, switch to the **Associated Buildings** tab, click **Attach Building**, fill in the name and any other required fields, then **Save**. The building appears as a marker on the map and in the buildings list under the Site.

## Attach files to a Building

Open the building, switch to the **Files** tab, click **Upload** and choose the files. File metadata is linked to the building automatically, and IFC files are converted to Fragments on upload.

See [File Management](./file-management.md) for supported formats and the upload pipeline.

## Edit Building metadata

Open the building, click **Edit** in the details panel, and update the name, year of construction (used for filtering and retrofit planning), or the longitude/latitude of the building origin. Changes appear immediately in lists and on the map.

## Filter and search

Open the Buildings list and use the filter controls at the top for construction year range and Site. The list narrows to matching buildings and the map highlights them in place.

## Storage layers

Files attached to a building are split across two storage layers: binary payloads in MinIO (S3-compatible), and metadata in PostgreSQL, indexed for fast querying.

The platform also distinguishes **georeferenced files**, defined by longitude/latitude and placed on the map automatically, from **local Cartesian files**, defined by XYZ coordinates relative to the building origin and displayed in the BIM viewer. Both record provenance and respect permission-based access.

## Access control

A Building's files and metadata are visible to members of its organization according to their role, enforced on the API server-side rather than only in the UI. See [Authorization → Permission reference](../authorization/permission-reference.mdx) for the full matrix.

## Related

- [Map Viewer](./map-viewer.md)
- [File Management](./file-management.md)
- [Authorization → Managing roles](../authorization/managing-roles.mdx)
- [Architecture → Data Model](../architecture/data-model.mdx)
