---
title: DataMenu
description: Multi-purpose data management panel that displays tables of buildings, sites, infrastructure, files, or users with search, filtering, and detail views.
---

# DataMenu

The container that renders a searchable, filterable data table for buildings, sites, infrastructure, files or users, with row selection for comparison, navigation to detail views, and CRUD through child detail components.

```tsx
import { DataMenu } from '@collabdt/core/core/components/viewers/Data/DataMenu';
import { ViewerNames } from '@collabdt/core/core/types/dbTypes';

<DataMenu
  currentViewer={ViewerNames.buildings}
  height="h-[600px]"
/>

// Minimal variant without frame styling
<DataMenu
  currentViewer={ViewerNames.users}
  hideFrame
  hideTitle
  hideActions
/>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentViewer` | `ViewerNames` | Yes | — | Which entity type to display: `buildings`, `sites`, `infrastructure`, `files` or `users` |
| `height` | `string` | No | `'h-full'` | Tailwind height class for the container |
| `hideFrame` | `boolean` | No | `false` | Removes background, padding and shadow styling |
| `hideTitle` | `boolean` | No | `false` | Hides the header title row with its icon |
| `hideActions` | `boolean` | No | `false` | Undocumented. |

## Behaviour

**Table view.** A `DataTable` is populated from the relevant SWR hook (`useBuildings`, `useSites`, and so on). The search input filters rows by name and address fields, `FilterButtons` applies advanced filters, and `HeaderButtons` provides the compare toggle and entity creation. Clicking a row opens its detail view, except in compare mode, where clicking toggles selection to a maximum of three items and checkboxes appear in the leading cells.

**Detail view.** The detail component for `currentViewer` is rendered (`BuildingDetails`, `SiteDetails`, and so on), the breadcrumb shows the selected entity's name, and `DetailActions` drives the edit, save and cancel flow. Save calls `saveChanges()` on the detail component's ref and reports the outcome through `sonner`. Back navigation clears the selection and returns to the table.

**Loading and errors.** `isLoading` is passed through to `DataTable` for skeleton rendering, and API errors go through `handleApiError`, which raises error toasts.

**State reset.** Changing `currentViewer` resets compare mode and clears selected items; changing the selected item ID resets the active tab in detail views.

## Design decisions

DataMenu is orchestration only. It manages state, wires context and handles layout, and delegates every entity-specific concern to a focused sub-component or utility, so adding a viewer type means touching those rather than this file.

| Piece | Responsibility |
|-------|----------------|
| `viewerConfig.ts` | Static map of viewer metadata (icon, i18n title key, DataTypes value). A new viewer is one entry. |
| `useViewerData` | Per-viewer data selection, search and filter logic, keeping DataMenu agnostic to each viewer's data shape. |
| `DetailHeader` | Entity title rendering. Each entity follows the same `name \|\| fallback` pattern; a new entity adds one small sub-component. |
| `DetailActions` | Button logic, label resolution and all CASL permission checks. DataMenu passes behaviour in as callbacks and keeps ownership of state. |

The tradeoff is that `DetailActions` has a wide props interface, because it needs both the selected items (for labels and `MoreOptions`) and the callbacks that trigger upstream state changes. Lifting that state into context was considered and rejected, to keep the permissions and edit flow easy to trace.

## Permissions

DataMenu itself gates nothing and renders for any authenticated user. Enforcement happens at the action level in its children:

| Action | Subject | Where enforced |
|--------|---------|----------------|
| `create` | `Building` | `HeaderButtons` → Add Building button |
| `create` | `User` | `HeaderButtons` → Add User button |
| `read` | `Building` | `HeaderButtons` → View All on Map, Compare |
| `read` | `Site` | `HeaderButtons` → View All on Map, Compare |
| `update` | `Building` | `DetailActions` → Edit Details button |
| `update` | `Site` | `DetailActions` → Edit Details button |
| `update` | `Infrastructure` | `DetailActions` → Edit Details button |
| `update` | `File` | `DetailActions` → Edit Details button |
| `update` | `Role` | `DetailActions` → Edit/Save buttons (users) |
| `delete` | `User` | `DetailActions` → via `MoreOptions` |
| `update` | `Site` | `MoreOptions` → Delete Site |

When adding a viewer with edit or create actions, put the `ability.can()` check inside `DetailActions` for the edit and save buttons, and inside `HeaderButtons` for any creation entry point.

## Related

- [Data Pages](../architecture/data-pages.mdx) — how these pages are assembled
- [DataTable](./data-table.md)
- [useBuildings](../hooks/buildings.md), [useSites](../hooks/sites.md), [useInfrastructures](../hooks/infrastructures.md), [useFiles](../hooks/files.md), [useUsers](../hooks/users.md)
