---
sidebar_position: 8
title: Collaboration
description: Invite teammates, manage roles, leave comments, raise BCF topics, and share live views.
---

# Collaboration

CDT is built for multi-user workflows. Several features let teams annotate, discuss, and coordinate directly within the platform — without leaving the 3D or map environment.

## Goal

Comment on a building or BIM element, raise a coordination issue (BCF), and share a live view.

## Prerequisites

- A CDT account.

To invite teammates and manage roles, see [Managing roles and permissions](../authorization/managing-roles.mdx).

## Pin a comment to a map location

**Goal:** annotate a place on the map for your team.

1. Open the **Add feature** tool from the toolbar.
2. **Double-click** the map where you want the pin. A single click won't place it — the map uses a double-click to set the point.
3. Add text, and optionally attach images, video, audio, or PDFs.
4. Save.

All pinned items are geolocated automatically and persist in the database. Useful for site observations, fieldwork, or flagging issues for a remote team.

**Result:** the comment is visible to all Organization members at that map location.

## Comment on a BIM element

**Goal:** attach a discussion thread to a specific building component.

1. Open the building in the BIM viewer.
2. Click the element you want to comment on.
3. In the properties panel, open the **Comments** subpanel and add your comment.
4. The comment is linked to the element's `GlobalId`, so it stays with the element even if the model is replaced with a newer version.

You can also use the **Add feature** toolbar button inside the BIM viewer to add media positioned at explicit XYZ coordinates within the scene.

**Result:** the comment is anchored to the element and visible to anyone with access to the building.

## Place, reply to, and edit comments

When you start writing a new comment, the panel prompts you to click the **+** to place it. After you click **+**, a message confirms that you can double-click in the viewer to drop the comment at a location.

Comments support lightweight, single-level threads. In the **Comments** sidebar each comment shows its author, relative time, and full text once. Replies are shown as a distinct, indented thread beneath the comment — expand or collapse them with the reply count toggle. This keeps a comment and its discussion visually separate rather than repeating the same text.

- **Reply:** use the reply action on a comment. Replies appear in the nested thread under the original comment.
- **Edit:** the author can edit their own comment text with the pencil action. Edited comments show an "Edited" badge.
- **Delete:** the author can remove their own comment.

## Interacting with comment markers in the viewer

Comment markers on the map and in the BIM scene share the same interactions:

- **Open:** click a marker's avatar to open its card.
- **Actions on the card:** the card has a **close** button, and — mirroring the sidebar — **reply**, **edit**, and **delete** actions (edit and delete are limited to the comment's author). In the BIM viewer, reply and edit open the comment's editor in the **Comments** sidebar so you have room to type; delete and close act in place.
- **Zoom to a comment:** **double-click** a marker — or a comment in the sidebar — to fly the camera to it. The focused comment is outlined with a thicker highlight ring so it is easy to spot. Double-clicking again re-frames it.

Markers use a thin ring by default, a highlight ring when hovered or selected, and a thicker ring when focused, so the current state is always clear.

## Grouped (clustered) comments

When several comments overlap, they collapse into a single numbered circle. **Hover** the circle and the members animate outward into a fan so you can see and click each one; move the mouse away and they animate back into the cluster. Clicking a member opens that comment and zooms to it. This keeps busy maps and dense BIM scenes readable. The BIM clusters use the same colour scheme as the map clusters. On the map, clicking a cluster also zooms in to separate the comments.

## Raise a BCF topic

**Goal:** open a coordination issue with a specific viewpoint.

The [BIM Collaboration Format (BCF)](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format-bcf/) is the openBIM standard for communicating design issues. The Topics tab in the BIM viewer gives you a full BCF workflow.

### Create a topic

1. Click the element(s) related to the issue.
2. Open the **Topics** tab → **New topic**.
3. Fill in title, description, and responsible party. The current camera viewpoint is captured automatically.
4. Set status (open / in progress / closed) and priority.
5. Save.

### Manage topics

- Filter by status or sort by date / priority.
- Click any topic to navigate the camera to its viewpoint.
- Export the topic list as a `.bcf` file for import into Revit, Archicad, or any compliant authoring tool.

BCF is vendor-neutral — issues created in CDT open correctly in any compliant authoring application, and vice versa.

**Result:** the team has a structured, viewpoint-anchored coordination thread.

## Share a live view

**Goal:** send a teammate the exact view you are looking at.

Both the map viewer and the BIM viewer have a **Share** button.

1. Click **Share** on the toolbar.
2. Copy the URL or scan the QR code.
3. Send the link.

The URL encodes:

- **Map** — longitude, latitude, zoom, pitch, bearing, active style, loaded asset IDs.
- **BIM** — camera XYZ position and target, active asset ID.

Anyone who follows the URL arrives at the exact same view — no re-navigation required.

**Result:** the recipient sees the same scene you do.

## Real-time synchronization

Media and annotations added by any user are visible to others in the same Organization as soon as they are uploaded. There is no manual sync step. A team on a site visit can upload photos from mobile devices while a remote teammate watches them appear on the map in real time.

## Internationalization

The interface supports **English, French, and Spanish** via i18n. Switch language from **Settings → Language**. For implementation details, see [Architecture → Internationalization](../architecture/internationalization.mdx).

## Related

- [Authorization → Managing roles](../authorization/managing-roles.mdx)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Concepts → Organizations and multi-tenancy](../concepts/organizations.mdx)
