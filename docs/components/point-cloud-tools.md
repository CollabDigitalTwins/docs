---
title: Point Cloud Viewer Tools
description: The toolbar tools available in the point cloud viewer — measurement, clipping, camera, and performance settings.
category: components
status: draft
last_updated: 2026-04-23
---

# Point Cloud Viewer Tools

The point cloud viewer toolbar is built from `pointcloudToolbarTools()`. Tools interact with the Potree-based viewer instance stored in `PointCloudContext`.

Source: `src/core/components/viewers/pointcloud/src/tools/`

## Available Tools

| Tool ID | Component | Enabled | Description |
|---------|-----------|---------|-------------|
| `pc-fit-to-screen-tool` | `FitToScreen` | Yes | Fit camera to the point cloud bounds |
| `pc-dimensions-tool` | `MeasurePointCloudTool` | Yes | Line, area, and angle measurements |
| `pc-set-camera-option` | `SetCameraOption` | Yes | Toggle camera projection (perspective/orthographic) |
| `pc-clip-tool` | `ClippingTool` | Disabled | Clip the point cloud with a volume (not yet enabled) |
| `pc-share-tool` | `SharePointCloudTool` | Disabled | Share camera position link (not yet enabled) |

---

## `MeasurePointCloudTool`

Sub-menu offering three measurement modes. All measurements use the Potree viewer's built-in measurement API.

### Measurement types

| Sub-tool | Component | Description |
|----------|-----------|-------------|
| Line | `LineMeasurement` | Measure distance between two points |
| Area | `AreaMeasurement` | Measure a polygonal area |
| Angle | `AngleMeasurement` | Measure the angle between three points |

### Behaviour

- Active measurement type is stored in `PointCloudContext` via `SET_ACTIVE_TOOL` action.
- Length unit is set to inches (`viewer.setLengthUnit('in')`) when activating.
- All active measurements can be cleared via a "Remove all" action, which iterates `viewer.scene.measurements` in reverse.
- Cancelling returns `activeTool` to `PointCloudTools.NONE`.

```tsx
const { state, dispatch } = useContext(PointCloudContext)
dispatch({ type: 'SET_ACTIVE_TOOL', payload: { activeTool: PointCloudTools.LINE_MEASURE } })
```

---

## `FitToScreen`

Resets the camera to fit the point cloud bounding box. Single-action — no persistent active state.

---

## `SetCameraOption`

Toggles between perspective and orthographic camera projections on the Potree viewer. Reads/writes viewer camera state directly.

---

## `PerformanceSettingTools`

A sub-group of performance controls accessible from the toolbar:

| Component | Description |
|-----------|-------------|
| `PointBudgetTool` | Adjust the maximum number of rendered points |
| `NodeSizeSelectionTool` | Set the point size |
| `SplatQualitySelection` | Choose splat rendering quality |
| `ShowOctreeBoxTool` | Toggle octree debug visualization |

<!-- TODO: Confirm whether PerformanceSettingTools is currently wired into the toolbar or available only via a separate menu. -->

---

## `ClippingTool` (disabled)

Volume clipping tool — not yet enabled in the toolbar (`disabled: true`). Will clip the rendered point cloud to a user-defined box or plane.

---

## `SharePointCloudTool` (disabled)

Generates a shareable URL encoding the camera position. Not yet enabled (`disabled: true`). Source in `SharePointCloudTool/src/getCameraPosition.ts`.

---

## Activating a tool

Tools are activated via `ToolsContext` and `PointCloudContext` together:

```tsx
const { dispatch: toolsDispatch } = useContext(ToolsContext)
const { dispatch: pcDispatch } = useContext(PointCloudContext)

// Activate measurement
toolsDispatch({ type: 'SET-TOOL', payload: { currentToolId: 'pc-dimensions-tool' } })
pcDispatch({ type: 'SET_ACTIVE_TOOL', payload: { activeTool: PointCloudTools.LINE_MEASURE } })
```

## Key Files

| File | Role |
|------|------|
| `src/core/components/viewers/pointcloud/src/tools/pointcloudToolbarTools.ts` | Tool list definition |
| `src/core/components/viewers/pointcloud/src/tools/MeasureTools/MeasurePointCloudTool.tsx` | Measurement tool sub-menu |
| `src/core/components/viewers/pointcloud/src/tools/MeasureTools/LineMeasurement.tsx` | Line measurement |
| `src/core/components/viewers/pointcloud/src/tools/MeasureTools/AreaMeasurement.tsx` | Area measurement |
| `src/core/components/viewers/pointcloud/src/tools/MeasureTools/AngleMeasurement.tsx` | Angle measurement |
| `src/core/components/viewers/pointcloud/src/tools/FitToScreen.tsx` | Fit to screen |
| `src/core/components/viewers/pointcloud/src/tools/SetCameraOption.tsx` | Camera projection toggle |
| `src/core/components/viewers/pointcloud/src/tools/PerformanceSettingsTools/` | Performance controls |

## Related

- [State Management](../architecture/state-management.md) — `PointCloudProvider`, `ToolsProvider`
- [Components — Toolbar](./toolbar.md)
- [Concepts — Point Clouds](../concepts/point-clouds.md)
- [Guides — Point Cloud Viewer](../guides/point-cloud-viewer.md)
