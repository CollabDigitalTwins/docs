---
title: BIM Viewer Tools
description: The toolbar tools available in the BIM viewer — clipping, measurement, inspection, model loading, and more.
category: components
status: draft
last_updated: 2026-07-28
---

# BIM Viewer Tools

The BIM viewer toolbar is built from a list of `Tool` objects defined in `useBimToolbarTools()`. Each tool is a React component rendered in a `ToolbarSubmenu` and activated/deactivated via `ToolsContext`.

Source: `@collabdt/core/components/viewers/bim/src/tools/`

## Available Tools

| Tool ID | Component | Description |
|---------|-----------|-------------|
| `bim-clipping` | `ClippingTool` | Add and remove section planes to cut through the model |
| `bim-camera-fit` | `FitCameraTool` | Fit camera to the loaded model |
| `bim-add` | `AddToBim` | Add files, comments, sensors, IFC/BCF/CAD/IDS content |
| `bim-dimensions` | `MeasureBimTool` | Measure length, area, volume and angle in the 3D model |
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

Measures length, area, volume and angle. The submenu offers five modes, all backed by
`@thatopen/components-front` measurement components rather than hand-rolled raycasting:

| Mode | Component | Interaction |
|------|-----------|-------------|
| Free | `OBF.LengthMeasurement` (`mode: 'free'`) | Double-click two points |
| Edge | `OBF.LengthMeasurement` (`mode: 'edge'`) | Double-click an edge; the measurement spans the whole edge |
| Area | `OBF.AreaMeasurement` (`mode: 'free'`) | Double-click each corner, then `Enter` to close the polygon |
| Volume | `OBF.VolumeMeasurement` | Double-click each element to add it, then `Enter` to total the volume |
| Angle | `OBF.AngleMeasurement` | Double-click three points: start, vertex, end |

`Delete` or `Backspace` removes the measurement under the cursor. `Escape` cancels the
in-progress shape and leaves measurement mode. `Clear` removes every measurement of every kind.

### `BimMeasurementManager`

All four components are owned by a single `OBC.Component`,
`BimMeasurements/BimMeasurementManager.ts`. Activation is exclusive: each measurement
component binds its own pointer listeners when enabled, so leaving two enabled at once would
make one double-click feed both.

The manager also handles three things the raw components do not:

- **World binding is resolved per activation**, not cached in the constructor. `Components.get()`
  caches, and the toolbar calls it on its first render — which can land before `CurrentWorld.world`
  is published. A constructor snapshot would cache `null` for the rest of the session.
- **Ordering.** `Measurement.enabled`'s setter calls `setEvents()`, which throws when `world` is
  null, so the world and all configuration are applied before `enabled = true`.
- **Hoverer coordination.** The Hoverer is disabled while length, area or angle is active.
  It is deliberately left alone for volume, because `VolumeMeasurement` saves, force-enables and
  restores it itself in order to highlight the items being picked.

Measurements are held in each component's own `list` and persist across tool switches until
`Clear` is used or the viewer is disposed.

### Snap tuning

The library defaults every measurement component to all three snap classes
(`POINT`, `LINE`, `FACE`) and to `MeasurementPickMode.MOUSE_MOVE`. All three classes compete on
each pick and the nearest wins, so the snap target flips between three different answers as the
cursor moves. The defaults here narrow that:

| Setting | Library default | CDT default |
|---------|-----------------|-------------|
| `snappings` | `[LINE, POINT, FACE]` | One or two classes per mode — `[LINE]` for edge length, `[FACE]` for face area, `[POINT, LINE]` otherwise, `undefined` for volume |
| `pickMode` | `MOUSE_MOVE` | `MOUSE_STOP` — one GPU pick per intentional cursor stop rather than one per animation frame |
| `delay` | 300 ms | 120 ms |
| `pickerSize` | 6 px | 10 px |
| `SnapResolvers` `maxDistance` | 1 m | 0.5 m |
| `stickyRadiusPx` | 12 px | 16 px |

:::note
`Measurement.snapDistance` looks like the snap-range knob but has no effect in
components-front 3.4.3 — its setter writes `GraphicVertexPicker.maxDistance`, which
`GraphicVertexPicker.get()` never reads. The live knob is
`components.get(OBC.SnapResolvers).get().maxDistance`.
:::

Colour, units, decimal places, snap range and marker size are user-editable under
**Measurements** in the BIM sidebar's Settings tab. Values are held on the manager, so they last
as long as the viewer's `Components` instance.

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
| `@collabdt/core/components/viewers/bim/src/tools/bimToolbar.ts` | Tool list definition |
| `@collabdt/core/components/viewers/bim/src/tools/ClippingTool/ClippingTool.tsx` | Clipping plane tool |
| `@collabdt/core/components/viewers/bim/src/tools/AddToBim/index.tsx` | Add content sub-menu |
| `@collabdt/core/components/viewers/bim/src/tools/InspectBimTool.tsx` | Element inspection |
| `@collabdt/core/components/viewers/bim/src/tools/measureBimTool.tsx` | Measurement submenu and hint card |
| `@collabdt/core/components/viewers/bim/src/BimMeasurements/BimMeasurementManager.ts` | Owns the four measurement components; exclusive activation, world binding, event wiring |
| `@collabdt/core/components/viewers/bim/src/BimMeasurements/measurementSettings.ts` | Snap tuning, units and the per-mode snap-class table |
| `@collabdt/core/components/viewers/bim/src/BimSidebar/src/SettingsTab/src/MeasurementSettings.tsx` | Colour, units, precision, snap range and marker size controls |
| `@collabdt/core/components/viewers/bim/src/tools/FitCameraTool.tsx` | Fit camera |
| `@collabdt/core/components/viewers/bim/src/tools/shareBimTool.tsx` | Share camera position |

## Permissions

<!-- TODO: Confirm which tools are gated by CASL permissions (e.g., adding content likely requires create permissions on File/Comment/Sensor). -->

## Related

- [State Management](../architecture/state-management.mdx) — `ToolsContext`, `BimContext`
- [Components — Toolbar](./toolbar.md)
- [Concepts — BIM and IFC](../concepts/bim-and-ifc.mdx)
- [Guides — BIM Viewer](../guides/bim-viewer.md)
