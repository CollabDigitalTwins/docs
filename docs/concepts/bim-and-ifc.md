---
sidebar_position: 2
---

# BIM & IFC

## What is BIM?

**Building Information Modeling (BIM)** is the process of creating and managing a data-rich, parametric model of a building throughout its lifecycle. The distinction from CAD is in the *I*: information.

In CAD, a wall is two parallel lines. In BIM, a wall is an object that knows its materials, fire rating, thermal properties, acoustic performance, which spaces it separates, and what structural role it plays. When the wall's thickness changes, every dependent view, schedule, and calculation updates automatically.

Charles Eastman — widely considered the father of BIM — defined building information *modelling* as a verb: the tools, processes, and technologies that manage "digital, machine-readable documentation about a building."[^eastman] The resulting artifact, the building model, replaces conventional construction drawings as the primary medium of delivery. Plans, sections, schedules, and cost estimates are extracted from the same model rather than drawn separately.

[^eastman]: Chuck Eastman et al., *BIM Handbook: A Guide to Building Information Modeling for Owners, Managers, Designers, Engineers, and Contractors*, 3rd ed. (Hoboken: Wiley, 2018), 617.

A model that contains only 3D geometry with no object attributes, no behavioral logic, or no automatic propagation of changes does not qualify as BIM.[^eastman2] The geometry is a means, not the end.

[^eastman2]: Eastman et al., *BIM Handbook*, 20.

## From CAD to BIM

CAD accelerated architectural production by digitizing the drafting table. But it preserved the same representational logic: lines and shapes that humans interpret through orthographic convention. The shift to BIM is a change in what the model *is*, not just how it looks.

| | CAD | BIM |
|---|---|---|
| Wall representation | Two parallel lines + separate spec document | Parametric object with materials, dimensions, and properties |
| Change propagation | Manual re-drafting across views | Automatic update in all dependent views and schedules |
| Output | Construction drawings | Model as source; drawings, schedules, reports extracted from it |
| Data richness | Geometry only | Geometry + metadata + relationships + lifecycle information |

Patrick MacLeamy — founder of buildingSMART International — framed this directly: "The shift from paper drawing to computer drawing was not a paradigm change: BIM is."[^macleamy]

[^macleamy]: Patrick MacLeamy, foreword to Eastman et al., *BIM Handbook*, xvii.

## What is IFC?

**Industry Foundation Classes (IFC)** is the open, vendor-neutral file format for exchanging BIM data. Standardized as ISO 16739, it defines a common language for thousands of building element types — walls, beams, spaces, sensors, structural connections — along with their properties and relationships.

Most architecture and engineering firms work in proprietary tools: Autodesk Revit (`.rvt`), Bentley MicroStation, Graphisoft ArchiCAD. These formats are locked to their respective ecosystems. IFC breaks that dependency. A model exported to IFC (`.ifc` or `.ifczip`) becomes:

- **Vendor-neutral** — readable by any compliant application, including open-source ones
- **Long-lived** — the ISO standard is maintained independently of any commercial product
- **Interoperable** — architectural, structural, and MEP models from different authoring tools can be exchanged without format negotiation
- **Auditable** — the plain-text STEP encoding means the file can be inspected or processed with standard tooling

For a platform like CDT, IFC is the natural entry point: it brings building geometry, element properties, and spatial relationships from the design tool into the browser without requiring proprietary desktop software on either end.

## openBIM

**openBIM** is the principle that BIM workflows should be transparent, vendor-neutral, and based on open standards — primarily IFC for model exchange, IDS for information requirements, and BCF for issue tracking. buildingSMART International (bSI) defines it as sharable project information that "supports seamless collaboration for all project participants" using open formats rather than proprietary ones.

In practice, much of the industry still operates in **closedBIM**: data exchanged in vendor-specific formats (`.rvt`, `.rvt`, `.dwg`) that restrict interoperability and lock stakeholders into a single software ecosystem. Even IFC round-trips — exporting from one tool and reimporting — can lose data: geometric misrepresentation, missing property sets, dropped relationships.[^interop]

[^interop]: See Gordon Lai et al., "Interoperability of IFC Data in BIM Software," *Automation in Construction* (2018).

CDT is built entirely on openBIM principles. IFC is the only building model format it ingests natively, and all BIM-related features (viewer, IDS validation, BCF topics) operate on the open standard, not on any proprietary representation.

## openBIM Standards in CDT

| Standard | Governs | Used in CDT |
|---|---|---|
| **IFC** (ISO 16739) | Building geometry and metadata | BIM viewer, file upload, property inspection |
| **IDS** | Information delivery requirements and validation | Model validation in BIM viewer |
| **BCF** | Issue tracking and coordination | Topics tab in BIM viewer |
| **bSDD** | buildingSMART Data Dictionary — element classification | Building records in the platform database |

## How CDT Handles BIM

CDT parses and renders IFC models using two open-source projects from [That Open Company](https://thatopen.com):

- **web-ifc** — a C++ IFC parser compiled to WebAssembly, running inside the browser tab at near-native speed
- **That Open Engine** — builds on web-ifc to provide scene graph, camera controls, highlighting, and property extraction; rendered with Three.js

When you upload an IFC file, the server converts it to **Fragments 2.0** binary format — a compact representation using FlatBuffers encoding that drastically reduces RAM overhead and load time compared to parsing raw IFC STEP files in the browser. Both the original IFC and the optimized `.frag` file are stored; the `.frag` version is what streams to the client.

See the [BIM Viewer guide](../guides/bim-viewer) for step-by-step instructions.
