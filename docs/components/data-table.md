---
title: DataTable
description: Generic data table with sorting, pagination, row interactions, and loading states.
---

# DataTable

A generic table built on TanStack Table (React Table v8), with column sorting, pagination, row click and hover handlers, optional leading and trailing cells, a skeleton loader, and context-aware empty states.

```tsx
import { DataTable } from '@collabdt/core/core/components/ui/DataTable';
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
| `onRowClick` | `(row: TData) => void` | No | — | Fired when a row is clicked (unless clicking a dropdown or button) |
| `onRowHover` | `(row: TData) => void` | No | — | Fired on row mouse enter |
| `currentViewer` | `string` | No | — | Current viewer name, used for empty state messaging |
| `className` | `string` | No | — | Additional classes for the table container |
| `paginationClasses` | `string` | No | — | Additional classes for the pagination container |
| `leadingCell` | `React.ComponentType<any>` | No | — | Component rendered at the start of each row, receives a `dataset` prop |
| `trailingCell` | `React.ComponentType<any>` | No | — | Component rendered at the end of each row, receives a `row` prop |
| `showPagination` | `boolean` | No | `true` | Whether to display pagination controls |
| `tab` | `string` | No | `''` | Tab identifier for context-specific empty state messages |
| `isLoading` | `boolean` | No | `false` | Shows the skeleton loader when true |

## Behaviour

Clicking a column header sorts it; sorting state is held internally as `SortingState`. Page size is persisted to `MenusContext`, with options of 10, 20, 50 and 100 rows, and first/previous/next/last navigation buttons. The header stays visible while the table body scrolls, and a column can set `meta.columnClasses` for custom styling.

`onRowClick` fires unless the click target is inside `.dropdown-menu-trigger` or a `Button`; `onRowHover` fires on `mouseEnter`.

When `isLoading` is true the table renders `DataTableSkeleton` with a matching column and row count. A falsy `data` shows a generic empty message; an empty array shows a message chosen from `tab` or `currentViewer`, for example "No buildings" or "No favourites", with location data supplied by `MapContext`.

See [Shared conventions](./overview.md#shared-conventions) for permissions: gating belongs to the parent component.
