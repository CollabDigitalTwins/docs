---
title: Viewer
description: Root component that orchestrates viewer switching between map, BIM, point cloud, and data views based on URL parameters.
category: components
status: draft
last_updated: 2025-01-14
---

# Viewer

Root viewer component that manages switching between different visualization modes (map, BIM, point cloud) and data management views (buildings, sites, files, etc.). Synchronizes the active viewer with URL search parameters and validates viewer availability based on organization settings.

## Usage

```tsx
import { Viewer } from '@/components/Viewer';

<Viewer organization={organization} />
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `organization` | `Organization` | Yes | — | The organization object containing `appContent` (available viewers) and `languages` configuration. |

## Behaviour

- **Initial mount**: Reads `viewer` from URL search params, defaults to `map` if not present or invalid.
- **Viewer validation**: Checks if the requested viewer is allowed by `organization.appContent`. Falls back to `map` if not.
- **URL sync**: When the viewer changes via context (sidebar, toolbar), updates the URL. When URL changes directly, updates context.
- **Circular update prevention**: Uses a ref to prevent infinite loops between URL and context synchronization.
- **Language switching**: Sets the default language from `organization.languages[0]` on mount.
- **Conditional rendering**: Map viewer is always mounted but hidden when inactive (preserves state). BIM and point cloud viewers mount/unmount on demand.
- **Sidebar trigger**: Displays `SidebarTrigger` only for map, BIM, and point cloud viewers.

## Design Decisions

<!-- TODO: Why was this component built this way? Note any tradeoffs, constraints, or alternatives considered. -->

## Permissions

<!-- Not applicable — viewer switching is controlled by organization.appContent, not CASL permissions. -->

## Related

- [MapViewer](/docs/components/map/MapViewer) — Map visualization component
- [BimViewer](/docs/components/bim/BimViewer) — BIM model viewer
- [PointCloudViewer](/docs/components/pointcloud/PointCloudViewer) — Point cloud visualization
- [DataMenu](/docs/components/Data/DataMenu) — Data management views
- [Toolbar](/docs/components/Toolbar) — Viewer toolbar controls
- [MenusContext](/docs/store/MenusContext) — State management for current viewer
- [BuildingsContext](/docs/store/BuildingsContext) — Building selection state