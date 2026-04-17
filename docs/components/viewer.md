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
 
Viewer is the top-level routing and layout component for the platform — it owns the relationship between the URL (`?viewer=`) and the active viewer state in context, and decides which viewer component to render.
 
The core design choice is a **two-way sync between URL and context** rather than treating one as the single source of truth. This is necessary because viewer changes can come from two directions — direct URL navigation (browser back/forward, shared links) and in-app actions (sidebar, HeaderButtons). A `isUpdatingRef` flag prevents the two `useEffect`s from triggering each other in a loop when one initiates a change.
 
The MapViewer is always mounted but hidden via `display: none` when not active. This is intentional — MapLibre is expensive to initialise and tear down, so keeping it mounted preserves map state (position, loaded layers, datasets) when the user switches to another viewer and back. All other viewers mount and unmount normally.
 
`appContent` on the Organization model controls which viewers are available for a given instance. If the URL contains a viewer that isn't in `appContent`, Viewer silently falls back to the map and updates the URL — so viewer availability is enforced at the routing level rather than inside each individual viewer component.
 
The `isMounted` flag ensures the URL-to-context sync only runs after the initial mount, avoiding a race condition where the URL and context briefly disagree on first load.

## Permissions

No permissions are necessary here.

## Related

- [MapViewer](/docs/components/map/MapViewer) — Map visualization component
- [BimViewer](/docs/components/bim/BimViewer) — BIM model viewer
- [PointCloudViewer](/docs/components/pointcloud/PointCloudViewer) — Point cloud visualization
- [DataMenu](/docs/components/Data/DataMenu) — Data management views
- [Toolbar](/docs/components/Toolbar) — Viewer toolbar controls
- [MenusContext](/docs/store/MenusContext) — State management for current viewer
- [BuildingsContext](/docs/store/BuildingsContext) — Building selection state
