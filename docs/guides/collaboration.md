---
sidebar_position: 8
---

# Collaboration

CDT is built for multi-user workflows. Several features allow teams to annotate, discuss, and coordinate directly within the platform — without leaving the 3D or map environment.

## Organizations and Roles

All collaboration in CDT is scoped to an **Organization** — a group that can represent a university department, a government agency, a project team, or an open community.

Role-based access control (RBAC) determines what each member can do:

| Role | Capabilities |
|---|---|
| **Viewer** | View all content within the Organization |
| **Contributor** | Upload files, add comments and media |
| **Manager** | Edit asset records, manage member roles |
| **Admin** | Full control, including deletion and settings |

Roles are enforced at the API level — not just hidden in the UI — so permissions are reliable across all access paths.

## Comments and Annotations

### On the Map

Click any location on the map and use the **Add feature** tool to pin a comment to that coordinate. Comments are visible to all Organization members. They support:

- Text notes
- Attached images, videos, or audio
- Attached PDF documents

All pinned items are automatically geolocated and persist in the database. This is useful for site observations, fieldwork documentation, or flagging issues for a remote team.

### In the BIM Viewer

Inside the BIM viewer, you can attach comments to specific model elements. Click an element, open its properties, and add a comment. Comments reference the element's GlobalId, so they remain linked to the correct object even if the model is replaced with a newer version.

The **Add feature** toolbar button inside the BIM viewer lets you add media (images, video, audio, PDFs) positioned at explicit XYZ coordinates within the scene.

## BCF Topics (BIM Issue Tracking)

The [BIM Collaboration Format (BCF)](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format-bcf/) is the openBIM standard for communicating design coordination issues. The **Topics** tab in the BIM viewer gives you a full BCF workflow:

**Creating a topic:**
1. Click the element(s) related to the issue
2. Open the Topics tab → New Topic
3. Assign a title, description, and responsible party
4. Capture a screenshot of the current viewpoint automatically
5. Set status (open / in progress / closed) and priority

**Managing topics:**
- Filter by status or sort by date / priority
- Navigate directly to the linked model viewpoint by clicking a topic
- Export topics as a `.bcf` file for import into Revit, Archicad, or any other compliant authoring tool

BCF is vendor-neutral — issues created in CDT open correctly in any BIM authoring application and vice versa.

## Sharing Views

Both the map viewer and the BIM viewer have a **Share** button that generates a URL encoding the full current state:

- **Map** — longitude, latitude, zoom, pitch, bearing, active style, loaded asset IDs
- **BIM** — camera XYZ position and target, active asset ID

Send this URL to a collaborator and they arrive at the exact same view — no re-navigation required. A QR code is also generated for sharing in presentations or printed documents.

## Real-Time Synchronization

Media and annotations added by any user are visible to others in the same Organization as soon as they are uploaded. There is no manual "sync" step. This means a team working on a site visit can upload photos from mobile devices while a remote team member sees them appear on the map in real time.

## Internationalization Support

The platform supports multiple interface languages using i18n, including **English, French, and Spanish**. User-facing labels, tooltips, and navigation content are localized through translation messages, and additional languages can be added with minimal code changes.

For implementation details, see the [Internationalization architecture page](../architecture/internationalization.md).
