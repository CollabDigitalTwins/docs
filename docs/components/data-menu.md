---
title: DataMenu
description: Multi-purpose data management panel that displays tables of buildings, sites, infrastructure, files, or users with search, filtering, and detail views.
category: components
status: draft
last_updated: 2025-01-14
---

# DataMenu

A container component that renders a searchable, filterable data table for various entity types (buildings, sites, infrastructure, files, users). Supports row selection for comparison, inline navigation to detail views, and CRUD operations through child detail components.

## Usage

```tsx
import { DataMenu } from '@/components/menus/DataMenu';
import { ViewerNames } from '@/types';

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

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `currentViewer` | `ViewerNames` | Yes | — | Determines which entity type to display: `buildings`, `sites`, `infrastructure`, `files`, or `users`. |
| `height` | `string` | No | `'h-full'` | Tailwind height class for the container. |
| `hideFrame` | `boolean` | No | `false` | Removes background, padding, and shadow styling when `true`. |
| `hideTitle` | `boolean` | No | `false` | Hides the header title row with icon. |
| `hideActions` | `boolean` | No | `false` | <!-- description --> |

## Behaviour

**Table View**
- Displays a `DataTable` populated with data from the relevant SWR hook (`useBuildings`, `useSites`, etc.)
- Search input filters rows by name/address fields
- `FilterButtons` applies advanced filters; `HeaderButtons` provides compare mode toggle and entity creation
- Clicking a row navigates to the detail view for that entity
- In compare mode, clicking a row toggles selection (max 3 items); checkboxes appear in leading cells

**Detail View**
- Shows the appropriate detail component (`BuildingDetails`, `SiteDetails`, etc.) based on `currentViewer`
- Breadcrumb updates to show the selected entity name
- `DetailActions` controls edit/save/cancel flow
- Save triggers `saveChanges()` on the detail component ref; success/failure toasts display via `sonner`
- Back navigation clears selection and returns to table view

**Loading & Errors**
- While data loads, `isLoading` is passed to `DataTable` for skeleton rendering
- API errors are handled through `handleApiError`, which displays error toasts

**State Reset**
- Switching `currentViewer` resets compare mode and clears selected items
- Switching selected item ID resets the active tab in detail views

## Design Decisions
 
DataMenu is intentionally an orchestration-only component — it manages state, wires context, and handles layout, but delegates all entity-specific logic to focused sub-components and utilities. This makes it easier to extend: adding a new viewer type only requires touching the relevant utility or sub-component rather than editing the core file.
 
- **`viewerConfig.ts`** — viewer-specific metadata (icon, i18n title key, DataTypes value) lives in a static config map. Adding a new viewer means adding one entry here.
- **`useViewerData`** — all per-viewer data selection, search, and filter logic is encapsulated in this hook, keeping DataMenu agnostic to how each viewer's data is shaped.
- **`DetailHeader`** — entity title rendering is isolated here. Each entity type follows the same `name || fallback` pattern, and new entities add one small sub-component.
- **`DetailActions`** — button logic, label resolution, and all CASL permission checks live here. DataMenu passes behaviour via callbacks and keeps state ownership to itself.
The key tradeoff: `DetailActions` has a wide props interface because it needs both selected items (for labels and MoreOptions) and callbacks (to trigger upstream state changes). Lifting this state into context was considered but rejected to keep the permissions and edit flow easy to trace.

---

## Permissions

DataMenu itself does not gate rendering on any CASL ability check — it always renders for any authenticated user. Permission enforcement happens at the action level inside child components:

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

If you are adding a new viewer with edit/create actions, the pattern is: add the `ability.can()` check inside `DetailActions` for the edit/save buttons, and inside `HeaderButtons` for any creation entry point.

## Related

- [BuildingDetails](/docs/components/building-details)
- [SiteDetails](/docs/components/site-details)
- [InfrastructureDetails](/docs/components/infrastructure-details)
- [UserDetails](/docs/components/user-details)
- [FileDetails](/docs/components/file-details)
- [DataTable](/docs/components/ui/data-table)
- [useBuildings](/docs/hooks/buildings)
- [useSites](/docs/hooks/sites)
- [useInfrastructures](/docs/hooks/infrastructures)
- [useFiles](/docs/hooks/files)
- [useUsers](/docs/hooks/users)
- [useViewerData](/docs/hooks/use-viewer-data)
