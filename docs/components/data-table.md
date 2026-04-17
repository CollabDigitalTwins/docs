---
title: DataTable
description: Generic data table with sorting, pagination, row interactions, and loading states.
category: components
status: draft
last_updated: 2025-01-13
---

# DataTable

A flexible, generic table component built on TanStack Table (React Table v8). Renders tabular data with column sorting, pagination, row click/hover handlers, and optional leading/trailing cells. Displays a skeleton loader during data fetching and context-aware empty state messages.

## Usage

```tsx
import { DataTable } from '@/components/ui/DataTable';
import { ColumnDef } from '@tanstack/react-table';

type Building = {
  id: string;
  name: string;
  address: string;
};

const columns: ColumnDef<Building>[] = [
  { accessorKey: 'name', header: 'Name' },
  { accessorKey: 'address', header: 'Address' },
];

<DataTable
  columns={columns}
  data={buildings}
  onRowClick={(building) => router.push(`/buildings/${building.id}`)}
  onRowHover={(building) => highlightOnMap(building.id)}
  isLoading={isLoading}
  showPagination={true}
/>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `columns` | `ColumnDef<TData, TValue>[]` | Yes | — | TanStack Table column definitions |
| `data` | `TData[]` | Yes | — | Array of row data to render |
| `onRowClick` | `(row: TData) => void` | No | — | Callback fired when a row is clicked (unless clicking dropdown or button) |
| `onRowHover` | `(row: TData) => void` | No | — | Callback fired on row mouse enter |
| `currentViewer` | `string` | No | — | Current viewer name, used for empty state messaging |
| `className` | `string` | No | — | Additional classes for the table container |
| `paginationClasses` | `string` | No | — | Additional classes for the pagination container |
| `leadingCell` | `React.ComponentType<any>` | No | — | Component rendered at the start of each row, receives `dataset` prop |
| `trailingCell` | `React.ComponentType<any>` | No | — | Component rendered at the end of each row, receives `row` prop |
| `showPagination` | `boolean` | No | `true` | Whether to display pagination controls |
| `tab` | `string` | No | `''` | Tab identifier for context-specific empty state messages |
| `isLoading` | `boolean` | No | `false` | Shows skeleton loader when true |

## Behaviour

- **Sorting**: Click column headers to sort. Sorting state managed internally via `SortingState`.
- **Pagination**: Page size persisted to `MenusContext`. Options: 10, 20, 50, 100 rows per page. Navigation buttons for first/previous/next/last page.
- **Loading state**: When `isLoading` is true, renders `DataTableSkeleton` with matching column count and row count.
- **Empty state**: When `data` is falsy, shows generic message. When `data` is empty array, shows context-aware message based on `tab` or `currentViewer` (e.g., "No buildings", "No favourites").
- **Row interactions**: `onRowClick` fires unless the click target is inside `.dropdown-menu-trigger` or a `Button`. `onRowHover` fires on `mouseEnter`.
- **Sticky header**: Table header remains visible when scrolling within the table container.
- **Column metadata**: Columns can define `meta.columnClasses` for custom styling.


## Permissions

This component does not enforce permissions directly. Gating should be handled by the parent component.

## Related

- [DataTableSkeleton](/docs/components/DataTableSkeleton) — Skeleton loader used during loading state
- [Table](/docs/components/ui/Table) — Underlying table primitives
- [MenusContext](/docs/store/MenusContext) — Stores pagination preferences
- [MapContext](/docs/store/MapContext) — Provides location data for empty state messages
