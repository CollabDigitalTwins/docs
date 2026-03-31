---
sidebar_position: 2
---

# BIM & IFC

Understanding Building Information Modeling and the IFC open standard for exchanging building data.

:::info What is BIM?
**Building Information Modeling (BIM)** is the process of creating and managing digital representations of physical buildings. A BIM model is much more than a 3D shape — it is a structured database of interconnected objects. A wall in a BIM model knows its materials, fire rating, thermal properties, and which spaces it separates. A door knows which wall it belongs to and what hardware is installed on it. This rich, relational data is what makes BIM useful for design, construction, facility management, and digital twin scenarios.
:::

:::info What is IFC?
**Industry Foundation Classes (IFC)** is the open, vendor-neutral file format for sharing BIM data. Standardized as ISO 16739, IFC defines a common language for building objects — walls, beams, spaces, sensors, and thousands of other element types — along with their properties and relationships. Any software that supports IFC can read a model produced by any other IFC-compliant tool, regardless of the authoring platform.
:::

## Why IFC matters

Most architecture and engineering firms work in proprietary tools: Autodesk Revit (`.rvt`), Bentley MicroStation, or ArchiCAD, to name a few. These formats are locked to their respective ecosystems — you cannot open a `.rvt` file without a Revit licence.

IFC breaks that dependency. When a model is exported to IFC (`.ifc` or `.ifczip`), it becomes:

- **Vendor-neutral** — readable by any compliant application, including open-source ones
- **Long-lived** — the ISO standard is maintained independently of any commercial product
- **Interoperable** — different disciplines (architecture, structure, MEP) can exchange models without format negotiation
- **Auditable** — the plain-text STEP encoding means the file contents can be inspected or processed with standard tooling

For a digital twin platform like CDT, IFC is the natural entry point: it brings building geometry, element properties, and spatial relationships from the design authoring tool into the browser without requiring proprietary desktop software on either end.

## How CDT handles BIM

CDT parses and renders IFC models entirely in the browser — no server-side conversion, no plugin to install.

Under the hood this relies on two closely related open-source projects:

- **[web-ifc](https://github.com/ThatOpenCompany/web-ifc)** (`web-ifc` v0.0.72) — a C++ IFC parser compiled to WebAssembly. It reads `.ifc` files at near-native speed directly inside the browser tab.
- **[That Open Company engine](https://thatopen.com)** (`@thatopen/components` and `@thatopen/components-front` v3.2) — the successor to the original IFC.js project. It builds on web-ifc to provide a full scene graph, camera controls, post-processing, highlighting, and property extraction.

The 3D scene is rendered with **Three.js**, and CDT uses the `@thatopen/fragments` format internally for efficient model streaming and visibility management. When you load an IFC file in CDT, web-ifc parses the geometry on a background worker thread, fragments are assembled in GPU memory, and the model appears in the viewport without a round-trip to the server.

## What you can do with BIM in CDT

Once a model is loaded you have access to a set of tools built directly on the That Open engine:

| Capability | What it does |
|---|---|
| **Load IFC models** | Upload `.ifc` files and toggle their visibility per-model in the Files panel |
| **Inspect element properties** | Click any element in the 3D view to open its property set — materials, dimensions, classification codes, and custom attributes |
| **View floorplans** | Switch to a 2D plan view of any storey using the floorplan section in the sidebar |
| **Manage model layers** | Navigate the spatial structure tree (Site → Building → Storey → Space → Element) and show or hide branches |
| **Validate against IDS** | Load an IDS (Information Delivery Specification) file to check whether model elements meet your project's data requirements |
| **BCF topics and discussions** | Import `.bcf` files or create topics directly in the viewer to link comments and viewpoints to specific elements — replacing email-based coordination |

## Next steps

- [BIM Viewer guide](../guides/bim-viewer) — step-by-step instructions for loading a model, navigating the scene, and using the sidebar tools
- [Architecture Overview](../architecture/overview) — how the BIM viewer fits into the broader CDT platform
