---
title: BIM Viewer Tools
description: The toolbar tools available in the BIM viewer — clipping, measurement, inspection, model loading, and more.
category: components
status: draft
last_updated: 2026-04-23
---

# BIM Viewer Tools

The BIM viewer toolbar is built from a list of `Tool` objects defined in `bimToolbarTools()`. Each tool is a React component rendered in a `ToolbarSubmenu` and activated/deactivated via `ToolsContext`.

Source: `src/core/components/viewers/bim/src/tools/`

## Available Tools

| Tool ID | Component | Description |
|---------|-----------|-------------|
| `bim-clipping` | `ClippingTool` | Add and remove section planes to cut through the model |
| `bim-camera-fit` | `FitCameraTool` | Fit camera to the loaded model |
| `bim-add` | `AddToBim` | Add files, comments, sensors, IFC/BCF/CAD/IDS content |
| `bim-dimensions` | `MeasureBimTool` | Measure distances and areas in the 3D model |
| `bim-inspect` | `InspectBimTool` | Inspect element properties by clicking |
| `bim-share` | `ShareBimTool` | Share a link to the current camera position |

---

## `ClippingTool`

Adds section planes to the Three.js scene using `@thatopen/components-front`. Each plane is rendered with a `LineMaterial` outline.

### Behaviour

- Activates via `ToolsContext` dispatch `SET-TOOL` with `tool.id`.
- Sets the viewer cursor to a crosshair while active.
- On double-click, a clipping plane is added at the clicked point.
- Keyboard shortcut clears all planes when active.
- Deactivates when another tool is selected — planes persist until explicitly removed.

### Dependencies

`@thatopen/components` (`OBC`), `@thatopen/components-front` (`OBF`), `three.js`

---

## `AddToBim`

Submenu with sub-tools for attaching content to the BIM model:

| Sub-tool | Description |
|----------|-------------|
| `bim-add-comment` | Pin a comment to a 3D position |
| `bim-add-file` | Attach a file at a 3D position |
| `bim-add-sensor` | Place a sensor in the model |
| `bim-add-ifc` | Load an additional IFC model |
| `bim-add-bcf` | Import a BCF topic file |
| `bim-add-cad` | Import a DXF/CAD file via `AddDxf` |
| `bim-add-ids` | Import an IDS validation file |

Position is set by clicking in the 3D view, captured as `x, y, z` coordinates relative to the model.

---

## `MeasureBimTool`

Measures distances and areas by clicking points in the model. Uses Three.js raycasting.

### Notes

<!-- TODO: Document which @thatopen measurement component is used and how measurements are stored/cleared. -->

---

## `InspectBimTool`

Activates element inspection mode. On click, highlights the selected element and reads its IFC properties. Supports `line` and `area` inspect types.

### Behaviour

- Sets cursor to a pointer while active.
- Attaches a `click` listener to the viewer container's canvas element.
- Removes the listener on deactivate.

---

## `FitCameraTool`

Fits the Three.js camera to the bounding box of the loaded model. Single-action tool — no persistent active state.

---

## `ShareBimTool`

Generates a shareable URL encoding the current camera position. Reads from `BimContext`.

---

## Activating a tool

Tools are activated and deactivated through `ToolsContext`:

```tsx
const { dispatch } = useContext(ToolsContext)

// Activate
dispatch({ type: 'SET-TOOL', payload: { currentToolId: 'bim-clipping' } })

// Deactivate
dispatch({ type: 'SET-TOOL', payload: { currentToolId: null } })
```

Only one tool is active at a time. When a new tool is activated, the previous tool's component is responsible for cleaning up (removing event listeners, resetting cursor, etc.).

## Key Files

| File | Role |
|------|------|
| `src/core/components/viewers/bim/src/tools/bimToolbar.ts` | Tool list definition |
| `src/core/components/viewers/bim/src/tools/ClippingTool/ClippingTool.tsx` | Clipping plane tool |
| `src/core/components/viewers/bim/src/tools/AddToBim/index.tsx` | Add content sub-menu |
| `src/core/components/viewers/bim/src/tools/InspectBimTool.tsx` | Element inspection |
| `src/core/components/viewers/bim/src/tools/measureBimTool.tsx` | Distance/area measurement |
| `src/core/components/viewers/bim/src/tools/FitCameraTool.tsx` | Fit camera |
| `src/core/components/viewers/bim/src/tools/shareBimTool.tsx` | Share camera position |

## Permissions

<!-- TODO: Confirm which tools are gated by CASL permissions (e.g., adding content likely requires create permissions on File/Comment/Sensor). -->

## Related

- [State Management](../architecture/state-management.md) — `ToolsContext`, `BimContext`
- [Components — Toolbar](./toolbar.md)
- [Concepts — BIM and IFC](../concepts/bim-and-ifc.md)
- [Guides — BIM Viewer](../guides/bim-viewer.md)
