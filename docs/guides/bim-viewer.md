---
sidebar_position: 2
title: BIM Viewer
description: Open IFC models, navigate them in 3D, inspect properties, validate against IDS, and coordinate with BCF topics.
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# BIM Viewer

The BIM viewer loads, navigates, and interrogates IFC models independently of their map context. It is built on [That Open Engine](https://thatopen.com/), an IFC engine on top of Three.js that gives full access to BIM geometry, metadata, and property sets while honouring openBIM standards.

To upload you need a CDT account with the **User** or **Admin** role. Public test files are at the [buildingSMART sample repository](https://github.com/buildingSMART/Sample-Test-Files).

## Load a model

1. Open the BIM Viewer from the left sidebar.
2. Drag the IFC file onto the viewer, or use the **File** tab → **Upload**.
3. The platform converts the file to **Fragments 2.0** (`.frag`) on the server. The progress bar tracks parse → conversion → load.
4. The model appears in the scene and is added to the **File** tab list.

Conversion happens once. Subsequent loads stream the cached `.frag` and are much faster.

Beyond IFC, the viewer accepts glTF / GLB, FBX, OBJ, Collada, DXF, and LAS / LAZ / COPC / E57.

### The File tab

The **File** tab holds four resizable, collapsible sections, each with its own **+** upload button: **BIM** (IFC/Fragments), **Point Clouds**, **Models** (other 3D geometry), and **Files** (CAD, media, documents). Drag the divider between two open sections to resize them.

Press and hold a section's header for about a second to pick it up, then drag it above or below the others and release. Keyboard equivalent: focus a header and press **Alt+↑** / **Alt+↓**, with **Esc** to abandon a drag. The order lasts for the browser session and resets on reload.

A section holding nothing starts collapsed and sits below the sections that hold something. It returns to its usual place as soon as it has a file, and opening an empty section keeps it open.

Every upload shows the same progress bar, both on the row and as a toast, moving through **Uploading**, **Converting** (IFC and point clouds only) and **Finalising** as the record is saved.

## Navigate in 3D

| Control | What it does |
|---------|--------------|
| **Left-click + drag** | Orbit around the model |
| **Right-click + drag** | Pan |
| **Scroll wheel** | Zoom |
| **Double-click** | Set the orbit pivot point |
| **Fit Extents** (toolbar) | Frame the full model in the viewport |

## Inspect element properties

Click any element in the 3D scene. The right panel populates with entity attributes and geometry, property sets (Psets), quantity sets (Qsets), material assignments, associated `IfcTask` entries, and spatial container relationships.

Use the search field to filter large property trees. Hold **Shift** and click multiple elements to compare attributes side by side, and click **Export** to save the current selection's properties as JSON or CSV.

## Cut a section

1. Click **Clipping plane** in the toolbar, then **Add clipping plane**.
2. Double-click any face on the model. A section plane appears aligned with that face.
3. Drag the arrow handle to adjust depth.
4. Press **Enter** (or **Cancel add clipping plane**) to finish. The section stays and its arrow is still draggable.

**Backspace** removes the plane under the cursor, **Esc** removes every plane, and **Ctrl+Z** undoes the last change.

## Browse and filter the model

Open the **Layers** tab in the left panel to navigate elements by list rather than hunting in 3D. It holds two collapsible groups, each with a switcher between two views:

| Group | Views | What it lists |
|-------|-------|---------------|
| **Drawings** | Floorplans / Elevations | Generated 2D views of the model |
| **Classifier** | Spatial / IFC Classes | The IFC spatial tree, or every IFC class in the model |

Collapsing one group gives its height to the other, and the divider between them can be dragged.

### Drawings

Selecting a storey generates its floorplan and frames it in the view. Below the drawing, a **Layers** list gives every IFC class in the plan its own visibility switch and colour picker, so you can mute furniture, recolour the structure, and so on.

#### Rooms

Rooms (`IFCSPACE`) get their own **Rooms** layer, drawn the way most authoring software does: a translucent light-blue fill over the room's footprint, an X across it, and the room's name at its centre. The fill follows the room's real footprint, so an L-shaped room is drawn as an L rather than as its bounding rectangle.

The layer starts **off**, because room fills sit over the linework underneath. Switch it on from the Layers list.

Picking a colour for the layer replaces the light blue and **hides the X**. The cross reads as "unstyled room", so it stops making sense once a room carries a deliberate colour. The name tags stay either way, since they are information rather than styling.

### Spatial

The spatial view is the IFC containment hierarchy, rooted at each model's building:

<BrowserOnly>
  {() => {
    const HierarchyTree = require('@site/src/components/HierarchyTree').default;
    return (
      <HierarchyTree
        data={{
          label: 'IfcBuilding',
          children: [{
            label: 'IfcBuildingStorey',
            children: [
              { label: 'IfcSpace' },
              { label: 'IfcWall / IfcSlab / …' },
            ],
          }],
        }}
      />
    );
  }}
</BrowserOnly>

Rows show each element's **name** (`Basic Wall:Generic 200mm`) with its IFC class beside it. Every loaded model contributes its own building, so a federated set appears as sibling branches in one tree.

### IFC Classes

The classes view groups the same elements by what they *are* rather than where they sit: one row per IFC class (`IFCWALL`, `IFCSLAB`, `IFCDOOR`, …) with the number of elements in it. Class names are shown exactly as the IFC defines them, in every language. Only classes that have geometry are listed.

:::note Classes hidden by default

Three classes start hidden, because their geometry envelops the building and would obscure everything behind it:

| Class | Why |
|-------|-----|
| `IFCGEOGRAPHICELEMENT` | Topography in IFC4 |
| `IFCSITE` | Topography in IFC2x3, where the terrain hangs off the site |
| `IFCSPACE` | Room volumes |

Which class topography lands in depends on the schema version and the authoring software's IFC export mapping, so both cases are covered. They are still listed: switch one on to show it. The choice sticks for the rest of the session, and a model loaded afterwards comes in with its own topography and spaces hidden.

`IFCBUILDINGELEMENTPROXY` is **not** hidden by default. Some IFC2x3 exports put terrain there too, but it is also the catch-all for any element the authoring software has no specific IFC class for, so hiding it would take real building geometry with it. Switch it off manually if your export needs it.

:::

### Select, hide, isolate

Every row in both views supports the same actions:

| Action | How | Effect |
|--------|-----|--------|
| **Select** | Click the row | Highlights the element(s) in 3D and opens the properties panel |
| **Hide / show** | The row's switch | Toggles visibility of the row and everything under it |
| **Isolate** | The crosshair button (appears on hover) | Hides everything else |
| **Recolour / fade** | The small circle at the left of the row | Sets a colour and an opacity for the row and everything under it |

These act across **all loaded models**, so isolating `IFCWALL` leaves only walls in a federated set. Use the eye button in the view's toolbar, or **Selection → Show all** in the viewer toolbar, to bring everything back.

The search box at the top of the tab filters both groups at once and opens the branches leading to each match.

### Colour and opacity

Every row carries a small circle at its left. It stays an empty outline until you use it, then fills with whatever colour and opacity you gave that row.

Click it to open the picker: a colour well and an opacity slider. Both are optional and independent, so you can tint a class without fading it, or fade a storey while it keeps its own colours. **Reset** in the picker clears just that row.

Colouring cascades. Tint a storey in the **Spatial** view and everything inside it takes the colour; a wall you had already coloured separately keeps its own, whichever order you set the two in. Setting only an opacity on that wall leaves it the storey's colour and fades it.

The two views can name the same element, since `IFCWALL` and a storey overlap. Whichever view you touched most recently wins the overlap, and undoing that change hands the elements back to the other view.

| Control | Where | Effect |
|---------|-------|--------|
| **Reset** | Inside a row's picker | Clears that row |
| **Reset colours** | The brush button in the view's toolbar | Clears the whole view, leaving the other one alone |
| **Undo** | `Ctrl+Z` (`Cmd+Z` on macOS) | Steps back one colour or opacity change |
| **Redo** | `Ctrl+Y`, or `Ctrl+Shift+Z` | Puts the change you just undid back |

Undo and redo cover colour and opacity only, not visibility or selection, and they work anywhere in the viewer rather than only while the Layers tab is open. Inside the search box `Ctrl+Z` edits the text as usual.

A whole slider drag counts as one step, so undoing a fade takes one keystroke rather than one per tick, and redoing it lands where you let go. Making a new change after undoing drops the redo trail.

Colours last for the session. They are not saved with the model, and not shared with anyone else looking at it.

## Validate against an IDS file

Open the **File** tab, click **Import IDS** and pick your `.ids` file. The viewer evaluates each requirement against the model and lists pass/fail counts. Click any failed requirement to highlight the offending elements in 3D.

## Track issues with BCF topics

1. Click the element(s) related to the issue.
2. Open the **Topics** tab → **New topic**.
3. Fill in title, description, responsible party, status, and priority. The current viewpoint is captured automatically.
4. Save the topic.

The topic is stored against the element's `GlobalId` and viewpoint. Export it to `.bcf` from the topic list to share with teams using Revit, Archicad, or any compliant authoring tool.

## Generate a floor plan

Floor plans are auto-generated for every `IfcStorey`. Pick one from the **File** tab and the viewer switches to a top-down 2D plan with the same measurement and annotation tools as the 3D view.

## Toolbar quick reference

| Tool | Description |
|------|-------------|
| **Clipping plane** | Section cut from any face |
| **Fit extents** | Reset the camera to frame the model |
| **Add feature** | Import IFC, IDS, or BCF; upload DXF; add media |
| **Measurements** | Distance, angle, area, and element volume |
| **Share** | URL + QR code encoding camera position and asset ID |

## Settings reference

The **Settings** tab in the left panel controls the Three.js scene: **theme** (system, dark, light), **camera** (perspective vs orthographic; FOV, speed, frustum), **grid** (toggle, resize, recolour), **lighting** (position, intensity, colour), and **renderer** (gamma correction, ambient occlusion, gloss, outline effects).

## Placing and editing scene content

Right-click anything you have added to the scene, whether a 3D object, a DXF drawing or a point cloud, to open its card: **Move**, **Rotate**, **Scale** and **Delete**. Holding the right button to pan the camera does not open it; only a right-click that stays put does. The same card is on the pin that floats above small objects, and the `move` action on a Files row opens it too.

The file list and the scene stay in step. Delete a row and the object leaves the scene; place a file and its row is marked visible. Deleting from the viewport card asks for confirmation first.

### Animated 3D models

A GLB or glTF containing animation clips gets a fourth action on that card, **Animation**: pick a clip, play or pause, and set speed from 0.1x to 3x. Clips play automatically when the model loads, and models without clips do not show the action.

Playback settings are not saved: reopening the model starts its first clip at normal speed.

## DXF / CAD overlay

Upload a `.dxf` to overlay a 2D drawing inside the 3D scene. The platform parses it through [DXF-Viewer](https://github.com/vagran/dxf-viewer) into Three.js lines. You can position, scale, and rotate it relative to the IFC coordinate system, and toggle CAD layers individually.

## Related

- [Concepts → BIM & IFC](../concepts/bim-and-ifc.mdx) — what IFC, IDS, BCF and bSDD are
- [File Management](./file-management.md)
- [Collaboration → BCF Topics](./collaboration.md)
- [Components → BIM Tools](../components/bim-tools.md)
