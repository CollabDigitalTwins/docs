---
sidebar_position: 8
title: Collaboration
description: Invite teammates, manage roles, leave comments, raise BCF topics, and share live views.
---

# Collaboration

CDT is built for multi-user workflows. Several features let teams annotate, discuss, and coordinate directly within the platform — without leaving the 3D or map environment.

## Goal

Invite a teammate, comment on a building or BIM element, raise a coordination issue (BCF), and share a live view.

## Prerequisites

- A CDT account.
- For invites and role management, an Admin role on the Organization.

## Invite a teammate

**Goal:** add someone to your Organization with the right level of access.

1. Open **Settings → Members → Invite member**.
2. Enter the email and pick a role:

| Role | Capabilities |
|------|--------------|
| **Viewer** | View all content within the Organization. |
| **Contributor** | Upload files, add comments and media. |
| **Manager** | Edit asset records, manage member roles. |
| **Admin** | Full control, including deletion and settings. |

3. Click **Send invitation**.

The new member receives an email with a sign-up link. Once they accept, they appear in the members list with the role you chose.

**Result:** the teammate can sign in and see what their role allows.

For the full role matrix, see [Authorization → Permission reference](../authorization/permission-reference.md).

## Pin a comment to a map location

**Goal:** annotate a place on the map for your team.

1. Click the map at the location.
2. Open the **Add feature** tool from the toolbar.
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

The interface supports **English, French, and Spanish** via i18n. Switch language from **Settings → Language**. For implementation details, see [Architecture → Internationalization](../architecture/internationalization.md).

## Related

- [Authorization → Managing roles](../authorization/managing-roles.md)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Concepts → Organizations and multi-tenancy](../concepts/organizations.md)
