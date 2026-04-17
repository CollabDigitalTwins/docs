---
title: Toolbar
description: Renders a context-sensitive toolbar at the bottom of a viewer with tools specific to that viewer type.
category: components
status: draft
last_updated: 2024-01-15
---

# Toolbar

Renders a floating toolbar anchored to the bottom center of the viewport. The toolbar displays different tool sets depending on which viewer is active (map, BIM, or point cloud). Each tool is rendered as a `ToolbarButton` within a `Menubar` container.

## Usage

```tsx
import { Toolbar } from '@/components/Toolbar';
import { ViewerNames } from '@/types';

<Toolbar viewer={ViewerNames.map} />
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `viewer` | `ViewerNames` | Yes | — | Determines which set of tools to display (`map`, `bim`, or `pointcloud`). |

## Behaviour

- Renders nothing if the `viewer` value doesn't match a known viewer type or if the corresponding tool set is empty.
- Tools are loaded dynamically based on the viewer:
  - `ViewerNames.map` → `mapToolbarTools()`
  - `ViewerNames.bim` → `bimToolbarTools()`
  - `ViewerNames.pointcloud` → `pointcloudToolbarTools()`
- The toolbar is positioned fixed at the bottom center of the screen with `pointer-events-none` on the container (individual buttons handle their own pointer events).
- Wraps all toolbar buttons in a `SubmenuProvider` to support tools with nested submenus.

## Design Decisions

Toolbar is intentionally a thin, stateless component — it receives the active viewer and renders the appropriate tool set, nothing more. All tool definitions and their behaviour live in viewer-specific files (`mapTools`, `bimToolbar`, `pointcloudToolbarTools`) rather than in Toolbar itself, so adding or changing tools for a viewer never requires touching this component.

The toolbar only renders for viewers that have tools (`map`, `bim`, `pointcloud`). Data viewers like Buildings, Sites, and Files return `null` — their actions live in `HeaderButtons` and `DetailActions` instead. This is a deliberate separation: spatial viewers need persistent, floating tool access; data viewers do not.

The toolbar is positioned fixed at the bottom-center of the screen and sits above the viewer content via `z-10`. `pointer-events-none` is set on the container so the toolbar doesn't block map interaction in the areas between buttons — `pointer-events-auto` is restored on individual buttons inside `ToolbarButton`.

## Permissions

No CASL permission checks in this component.

## Related

- [ToolbarButton](/docs/components/ui/toolbar-button) — Renders individual tool buttons
- [Menubar](https://ui.shadcn.com/docs/components/radix/menubar) — Container component for the toolbar
- [SubmenuProvider](/docs/components/toolbar-submenu) — Context provider for submenu state
- [mapToolbarTools](/docs/viewers/map/tools) — Tool definitions for the map viewer
- [bimToolbarTools](/docs/viewers/bim/tools) — Tool definitions for the BIM viewer
- [pointcloudToolbarTools](/docs/viewers/pointcloud/tools) — Tool definitions for the point cloud viewer
