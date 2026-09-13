---
sidebar_position: 8
title: Collaboration
description: Invite teammates, manage roles, leave comments, raise BCF topics, and share live views.
---

# Collaboration

Teams annotate, discuss, and coordinate inside the platform, without leaving the 3D or map environment.

To invite teammates and manage roles, see [Managing roles and permissions](../authorization/managing-roles.mdx).

## Pin a comment to a map location

1. Open the **Add feature** tool from the toolbar.
2. **Double-click** the map where you want the pin. A single click will not place it.
3. Add text, and optionally attach images, video, audio, or PDFs.
4. Save.

Pinned items are geolocated automatically and persist in the database, which suits site observations, fieldwork, and flagging issues for a remote team. The comment is visible to all organization members at that location.

## Comment on a BIM element

Open the building in the BIM viewer, click the element, then open the **Comments** subpanel in the properties panel and add your comment. The comment is linked to the element's `GlobalId`, so it stays with the element even if the model is replaced with a newer version.

The **Add feature** toolbar button inside the BIM viewer also adds media positioned at explicit XYZ coordinates within the scene.

## Place, reply to, and edit comments

When you start a new comment, the panel prompts you to click **+**, after which you can double-click in the viewer to drop the comment at a location.

Comments support single-level threads. In the **Comments** sidebar each comment shows its author, relative time, and full text once; replies appear as an indented thread beneath it, expanded or collapsed with the reply count toggle.

Authors can **edit** their own comment text with the pencil action (edited comments show an "Edited" badge) and **delete** their own comments.

## Comment markers in the viewer

Markers on the map and in the BIM scene share the same interactions:

- **Open** — click a marker's avatar to open its card.
- **Card actions** — close, plus reply, edit, and delete, mirroring the sidebar (edit and delete only for the author). In the BIM viewer, reply and edit open the comment's editor in the **Comments** sidebar so you have room to type; delete and close act in place.
- **Zoom to a comment** — double-click a marker, or a comment in the sidebar, to fly the camera to it. The focused comment gets a thicker highlight ring, and double-clicking again re-frames it.

Markers use a thin ring by default, a highlight ring when hovered or selected, and a thicker ring when focused.

### Grouped (clustered) comments

Overlapping comments collapse into a single numbered circle. Hover it and the members animate outward into a fan so you can see and click each one; move away and they animate back. Clicking a member opens that comment and zooms to it. On the map, clicking a cluster also zooms in to separate the comments. BIM clusters use the same colour scheme as map clusters.

## Raise a BCF topic

The [BIM Collaboration Format (BCF)](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format-bcf/) is the openBIM standard for communicating design issues, and the Topics tab in the BIM viewer gives you a full BCF workflow.

To create a topic, click the element(s) related to the issue, open **Topics** → **New topic**, fill in title, description, and responsible party, set status and priority, then save. The current camera viewpoint is captured automatically.

Topics can be filtered by status or sorted by date and priority. Click any topic to navigate the camera to its viewpoint, or export the list as a `.bcf` file. BCF is vendor-neutral, so issues created in CDT open correctly in Revit, Archicad, or any compliant authoring application, and vice versa.

## Share a live view

Both viewers have a **Share** button on the toolbar. Click it, then copy the URL or scan the QR code.

The URL encodes longitude, latitude, zoom, pitch, bearing, active style and loaded asset IDs on the map, or camera XYZ position, target and active asset ID in the BIM viewer. Anyone who follows it arrives at the same view with no re-navigation.

## Real-time synchronization

Media and annotations added by any user are visible to others in the same organization as soon as they are uploaded, with no manual sync step. A team on a site visit can upload photos from mobile devices while a remote teammate watches them appear on the map.

## Internationalization

The interface supports **English, French, and Spanish**. Switch language from **Settings → Language**. See [Architecture → Internationalization](../architecture/internationalization.mdx) for implementation details.

## Related

- [Authorization → Managing roles](../authorization/managing-roles.mdx)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Concepts → Organizations and multi-tenancy](../concepts/organizations.mdx)
