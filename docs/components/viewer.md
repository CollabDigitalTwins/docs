---
title: Viewer
description: Root component that orchestrates viewer switching between map, BIM, and data views based on URL parameters.
---

# Viewer

The root viewer component. It switches between visualization modes (map, BIM) and data management views (buildings, sites, files, and so on), keeps the active viewer in sync with the `?viewer=` URL parameter, and validates the requested viewer against organization settings.

```tsx
import { Viewer } from '@collabdt/core/core/components/viewers/Viewer';

<Viewer organization={organization} />
```

`organization` (`Organization`, required) supplies `appContent`, the list of available viewers, and `languages`, whose first entry becomes the default language on mount.

## Behaviour

On mount, Viewer reads `viewer` from the URL search params and falls back to `map` when it is missing or not permitted by `organization.appContent`. Thereafter the URL and context stay in sync in both directions, and `SidebarTrigger` renders only for the map and BIM viewers.

## Design decisions

Viewer is the top-level routing and layout component: it owns the relationship between the URL and the active viewer state in context, and decides which viewer component to render.

The core choice is a two-way sync between URL and context rather than treating one as the single source of truth, because viewer changes arrive from two directions: direct URL navigation (browser back and forward, shared links) and in-app actions (sidebar, `HeaderButtons`). An `isUpdatingRef` flag stops the two `useEffect`s triggering each other in a loop when one initiates a change. An `isMounted` flag keeps the URL-to-context sync from running on the first render, where the URL and context would briefly disagree.

The MapViewer is always mounted and merely hidden with `display: none` when inactive. MapLibre is expensive to initialise and tear down, so staying mounted preserves map state (position, loaded layers, datasets) across a switch away and back. Every other viewer mounts and unmounts normally.

`appContent` on the Organization model controls which viewers an instance offers. A URL naming a viewer outside `appContent` silently falls back to the map and rewrites the URL, so availability is enforced at the routing level instead of inside each viewer.

See [Shared conventions](./overview.md#shared-conventions) for permissions.

## Related

- [Map Viewer](../guides/map-viewer.md)
- [BIM Viewer](../guides/bim-viewer.md)
- [DataMenu](./data-menu.md) — data management views
- [Toolbar](./toolbar.md) — viewer toolbar controls
- [State Management](../architecture/state-management.mdx) — `MenusContext` and `BuildingsContext`
