---
sidebar_position: 2
title: BIM Viewer
description: Open IFC models, navigate them in 3D, inspect properties, validate against IDS, and coordinate with BCF topics.
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# BIM Viewer

The BIM viewer loads, navigates, and interrogates IFC models independently of their map context. It is built on [That Open Engine](https://thatopen.com/) — an IFC engine on top of Three.js that gives full access to BIM geometry, metadata, and property sets while honouring openBIM standards.

## Goal

Load a BIM model, navigate it in 3D, read its property sets, and use the openBIM tools (IDS validation, BCF topics) for coordination work.

## Prerequisites

- A CDT account with **User** or **Admin** role (to upload).
- An IFC file. Public test files are at the [buildingSMART sample repository](https://github.com/buildingSMART/Sample-Test-Files).

## Load a model

**Goal:** get an IFC into the viewer.

1. Open the BIM Viewer from the left sidebar.
2. Drag the IFC file onto the viewer, or use the **File** tab → **Upload** button.
3. The platform converts the file to **Fragments 2.0** (`.frag`) on the server. The progress bar tracks parse → conversion → load.
4. Once finished, the model appears in the scene and is added to the **File** tab list.

The conversion happens once. Subsequent loads stream the cached `.frag` and are much faster.

**Supported formats** beyond IFC: glTF / GLB, FBX, OBJ, Collada, DXF, LAZ / LAS / COPC.

**Result:** the model is visible in the viewport and selectable.

## Navigate in 3D

| Control | What it does |
|---------|--------------|
| **Left-click + drag** | Orbit around the model |
| **Right-click + drag** | Pan |
| **Scroll wheel** | Zoom |
| **Double-click** | Set the orbit pivot point |
| **Fit Extents** (toolbar) | Frame the full model in the viewport |

**Result:** smooth navigation in any direction, with predictable pivot behaviour.

## Inspect element properties

**Goal:** read the IFC schema data for a specific element.

1. Click any element in the 3D scene.
2. The right panel populates with:
   - Entity attributes and geometry
   - Property sets (Psets)
   - Quantity sets (Qsets)
   - Material assignments
   - Associated `IfcTask` entries
   - Spatial container relationships
3. Use the search field to filter large property trees.
4. Hold **Shift** and click multiple elements to compare attributes side-by-side.
5. Click **Export** to save the current selection's properties as JSON or CSV.

**Result:** the property panel shows the full IFC data for the selected element(s).

## Cut a section

**Goal:** see inside the model with a clipping plane.

1. Click **Clipping plane** in the toolbar.
2. Click any face on the model — a section plane appears aligned with that face.
3. Drag the plane handle to adjust depth.
4. Click the toolbar icon again (or press **Esc**) to remove it.

**Result:** the model is sliced at your chosen plane and the interior is visible.

## Browse the spatial hierarchy

**Goal:** navigate to a specific element via the IFC tree rather than hunting in 3D.

1. Open the **Layers** tab in the left panel.
2. The IFC spatial tree expands as:

<BrowserOnly>
  {() => {
    const HierarchyTree = require('@site/src/components/HierarchyTree').default;
    return (
      <HierarchyTree
        data={{
          label: 'IfcProject',
          children: [{
            label: 'IfcSite',
            children: [{
              label: 'IfcBuilding',
              children: [{
                label: 'IfcBuildingStorey',
                children: [
                  { label: 'IfcSpace' },
                  { label: 'IfcWall / IfcSlab / …' },
                ],
              }],
            }],
          }],
        }}
      />
    );
  }}
</BrowserOnly>

3. Click any node — the corresponding geometry highlights in the 3D view.

This is the fastest way to find a specific room, storey, or system in a large federated model.

**Result:** the selected element is highlighted and the camera centres on it.

## Validate against an IDS file

**Goal:** check whether the model satisfies an Information Delivery Specification.

1. Open the **File** tab.
2. Click **Import IDS** and pick your `.ids` file.
3. The viewer evaluates each requirement against the model and lists pass/fail counts.
4. Click any failed requirement to see the offending elements highlighted in 3D.

**Result:** every requirement in the IDS shows pass/fail with element-level traceability.

## Track issues with BCF topics

**Goal:** open a coordination issue against a specific element and a specific viewpoint.

1. Click the element(s) related to the issue.
2. Open the **Topics** tab → **New topic**.
3. Fill in title, description, responsible party, status, and priority. The current viewpoint is captured automatically.
4. Save the topic.
5. Export to `.bcf` from the topic list to share with teams using Revit, Archicad, or any compliant authoring tool.

**Result:** the topic is saved against the element's `GlobalId` and viewpoint, and exports as a vendor-neutral `.bcf`.

## Generate a floor plan

**Goal:** view a 2D plan of any storey.

1. Open the **File** tab.
2. Floor plans are auto-generated for every `IfcStorey` — pick one from the list.
3. The viewer switches to a top-down 2D plan with the same measurement and annotation tools as the 3D view.

**Result:** a precise 2D plan of the chosen storey, navigable like the 3D view.

## Toolbar quick reference

| Tool | Description |
|------|-------------|
| **Clipping plane** | Section cut from any face. |
| **Fit extents** | Reset the camera to frame the model. |
| **Add feature** | Import IFC, IDS, or BCF; upload DXF; add media. |
| **Measurements** | Distance, angle, area, and element volume. |
| **Share** | URL + QR code encoding camera position and asset ID. |

## Settings reference

The **Settings** tab in the left panel controls the Three.js scene:

- **Theme** — system, dark, light.
- **Camera** — perspective vs orthographic; FOV, speed, frustum.
- **Grid** — toggle, resize, recolour.
- **Lighting** — position, intensity, colour.
- **Renderer** — gamma correction, ambient occlusion, gloss, outline effects.

## DXF / CAD overlay

Upload a `.dxf` to overlay a 2D drawing inside the 3D scene. The platform parses it through [DXF-Viewer](https://github.com/vagran/dxf-viewer) into Three.js lines. You can position, scale, and rotate it relative to the IFC coordinate system, and toggle CAD layers individually.

## Supported openBIM formats

| Format | Purpose |
|--------|---------|
| **IFC** | Building model geometry + metadata |
| **IDS** | Information delivery requirements + validation |
| **BCF** | Issue tracking and coordination |
| **bSDD** | buildingSMART Data Dictionary — element classification |

## Related

- [Concepts → BIM & IFC](../concepts/bim-and-ifc.mdx)
- [File Management](./file-management.md)
- [Collaboration → BCF Topics](./collaboration.md)
- [Components → BIM Tools](../components/bim-tools.md)
