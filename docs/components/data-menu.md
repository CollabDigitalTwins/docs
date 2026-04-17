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

<!-- TODO: Why was this component built this way? Note any tradeoffs, constraints, or alternatives considered. -->

## Permissions

<!-- If gated by CASL, note the required action/subject pair. Remove this section if not applicable. -->

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