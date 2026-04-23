---
sidebar_position: 2
---

# BIM Viewer

The BIM viewer lets you load, navigate, and interrogate IFC models independently of their map context. It is built on [That Open Engine](https://thatopen.com/) — an IFC engine based on Three.js that gives you full access to BIM geometry, metadata, and property sets while adhering to openBIM standards.

## Loading Models

Drag and drop an IFC file onto the viewer, or use the **File** tab in the left panel to upload from your device. The platform intercepts the raw IFC, converts it to the Fragments 2.0 binary format (`.frag`) on the server side, and streams the optimized file to your browser — significantly reducing load time compared to parsing IFC directly on the client.

Additional supported formats: **glTF / GLB, FBX, OBJ, Collada, DXF, LAZ / LAS / COPC** (point clouds).

## Toolbar

The top toolbar gives quick access to the most common actions:

| Tool | Description |
|---|---|
| **Clipping plane** | Create a section cut from any face in the model. Drag to adjust depth and orientation. |
| **Fit extents** | Resets the camera to frame the full model within the viewport. |
| **Add feature** | Import IFC, IDS, or BCF files; upload DXF drawings; add media (images, video, audio, PDFs). |
| **Measurements** | Measure distances, angles, areas, and element volumes. |
| **Share** | Generates a URL + QR code encoding the camera position and active asset ID. |

## Left Panel

### File tab

Shows all models currently loaded in the scene. For each model you can:

- Toggle visibility
- Download the original IFC source file
- Remove the model from the scene

The panel also lists **floor plans** (auto-generated for every `IfcStorey`) and **elevation views** (Front, Back, Left, Right) — both support the same measurement and annotation tools as the 3D view.

**IDS validation** is available here: import an Information Delivery Specification file and the viewer highlights which model elements pass or fail each requirement, making compliance checks visual and actionable.

**Selection sets** let you save named groups of elements for recurring queries or coordination tasks.

### Layers tab

Displays the full IFC spatial hierarchy as a collapsible tree:

```
IfcProject
  └─ IfcSite
       └─ IfcBuilding
            └─ IfcBuildingStorey
                 └─ IfcSpace / elements...
```

Click any node to highlight the corresponding geometry. Use this to navigate large federated models without hunting through the 3D scene.

### Topics tab (BCF)

Full [BIM Collaboration Format (BCF)](https://www.buildingsmart.org/standards/bsi-standards/bim-collaboration-format-bcf/) support. Upload existing BCF files or create new topics directly in the interface.

For each topic you can:

- Link the issue to a specific element or viewpoint in the model
- Assign responsible parties and status (open / closed)
- Add comments and screenshots
- Sort and filter by status or priority

Topics are vendor-neutral — BCF files exported here open in Revit, Archicad, or any other compliant authoring tool.

### Settings tab

Controls the visual environment of the Three.js scene:

- **Theme** — system / dark / light
- **Camera** — switch between perspective and orthographic; adjust FOV, speed, frustum
- **Grid** — toggle, resize, recolour
- **Lighting** — position, intensity, colour
- **Renderer** — gamma correction, ambient occlusion, gloss, outline effects

## Right Panel — Properties

Click any element in the 3D scene to populate the properties panel with the full IFC schema data for that element:

- Entity attributes and geometry
- Property sets (Psets)
- Quantity sets (Qsets)
- Material assignments
- Associated `IfcTask` entries
- Spatial container relationships

Select multiple elements to compare attributes side by side. Use the search field to filter large property trees in real time. Export the current selection's properties to a file for external documentation.

## DXF / CAD Integration

Upload DXF files to overlay 2D CAD drawings within the 3D scene. The platform uses [DXF-Viewer](https://github.com/vagran/dxf-viewer) to parse DXF geometry into Three.js lines. Once loaded, you can:

- Position, scale, and rotate the drawing relative to the IFC coordinate system
- Toggle individual CAD layers on or off
- Use it as a reference alongside 3D BIM elements

## Supported openBIM Formats

| Format | Purpose |
|---|---|
| **IFC** | Building model geometry + metadata |
| **IDS** | Information delivery requirements + validation |
| **BCF** | Issue tracking and coordination |
| **bSDD** | buildingSMART Data Dictionary — used for element classification |
