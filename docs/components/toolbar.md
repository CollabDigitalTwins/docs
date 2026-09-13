---
title: Toolbar
description: Renders a context-sensitive toolbar at the bottom of a viewer with tools specific to that viewer type.
---

# Toolbar

A floating toolbar anchored to the bottom centre of the viewport, showing a different tool set depending on which viewer is active. Each tool renders as a `ToolbarButton` inside a `Menubar`, and all of them are wrapped in a `SubmenuProvider` so tools can carry nested submenus.

```tsx
import { Toolbar } from '@collabdt/core/core/components/Toolbar';
import { ViewerNames } from '@collabdt/core/core/types/dbTypes';

<Toolbar viewer={ViewerNames.map} />
```

`viewer` (`ViewerKey`, required) selects the tool set: `ViewerNames.map` loads `useMapToolbarTools()` and `ViewerNames.bim` loads `useBimToolbarTools()`. A plugin page key (`plugin:<id>:<page>`), an unknown viewer, or an empty tool set all render nothing.

See [Shared conventions](./overview.md#shared-conventions) for permissions.

## Design decisions

Toolbar is deliberately thin and stateless: it receives the active viewer and renders the matching tool set, nothing more. Tool definitions and behaviour live in viewer-specific files (`mapTools`, `bimToolbar`), so adding or changing a viewer's tools never touches this component.

Only spatial viewers get a toolbar. Data viewers like Buildings, Sites and Files return `null`, because their actions belong in `HeaderButtons` and `DetailActions` instead; persistent floating tool access is something only map and BIM need.

The toolbar is fixed at the bottom centre and sits above viewer content via `z-10`. The container sets `pointer-events-none` so it does not block map interaction in the gaps between buttons, and `ToolbarButton` restores `pointer-events-auto` on each button.

## Related

- [BIM Viewer Tools](./bim-tools.md) — the tools `useBimToolbarTools()` supplies
- [Menubar](https://ui.shadcn.com/docs/components/radix/menubar) — the container primitive
