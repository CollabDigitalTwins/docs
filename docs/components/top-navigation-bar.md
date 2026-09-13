---
title: NavigationBar
description: Top navigation bar that provides search and sidebar toggle controls for different viewer modes.
---

# NavigationBar

Top-level navigation bar that adapts to the current viewer mode. It takes no props, reading viewer state from `MenusContext` and sidebar state from `useSidebar()`, and is rendered at the layout level rather than instantiated directly:

```tsx
import NavigationBar from '@collabdt/core/core/components/TopNavigationBar';

<NavigationBar />
```

## Behaviour

`currentViewer` decides which search tool appears: `ViewerNames.map` renders `Geocoder`, `ViewerNames.bim` renders `BIMSearchTool`.

A menu button appears for the BIM and map viewers. Clicking it calls `toggleInfoSidebar()`, which opens the [ViewerSidebar](./viewer-sidebar.md). The button transitions from 70% to 100% opacity on hover.

When `openInfo` is true and the viewer needs a sidebar, NavigationBar returns `null` so it cannot overlap the sidebar.

See [Shared conventions](./overview.md#shared-conventions) for permissions.

## Related

- [Sidebar](./app-sidebar.md) — sidebar context provider and hooks
- [MenusContext](../architecture/state-management.mdx) — viewer state management
