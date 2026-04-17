---
title: BuildingDetails
description: Displays and edits detailed building information across multiple tabbed sections.
category: components
status: draft
last_updated: 2025-01-13
---

# BuildingDetails

Renders a tabbed detail view for a building record. Supports viewing, editing, and creating buildings with fields organized into sections like general info, units, energy, environmental, and attached files. Exposes a `saveChanges` method via `forwardRef` for parent-controlled saves.

## Usage

```tsx
import BuildingDetails, { BuildingDetailsRef } from '@/core/components/viewers/Data/buildingDetails/BuildingDetails';

const detailsRef = React.useRef<BuildingDetailsRef>(null);

<BuildingDetails
  ref={detailsRef}
  selectedItem={building}
  setSelectedItem={setBuilding}
  editing={isEditing}
  setEditing={setIsEditing}
  setActiveChanges={setHasChanges}
  activeTab="general"
  setActiveTab={setActiveTab}
/>

// Trigger save from parent
await detailsRef.current?.saveChanges();
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selectedItem` | `Building` | No | — | The building record to display or edit. |
| `setSelectedItem` | `(building: Building) => void` | No | — | Callback to update the selected building in parent state. |
| `editing` | `boolean` | No | `false` | Whether the component is in edit mode. |
| `setEditing` | `(editing: boolean) => void` | No | — | Callback to toggle edit mode. |
| `setActiveChanges` | `(editing: boolean) => void` | No | — | Callback to signal unsaved changes exist. |
| `buildings` | `Building[]` | No | — | <!-- description --> |
| `activeTab` | `string` | No | — | The currently active tab key. |
| `setActiveTab` | `(tab: string) => void` | No | `() => {}` | Callback when tab selection changes. |

## Ref Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `saveChanges` | `() => Promise<void>` | Persists edits—creates new buildings (ID < 0) or updates existing ones. |

## Behaviour

- **Tab navigation**: Sections are derived from `useBuildingHeaders()`. Clicking a tab updates `activeTab` and renders the corresponding fields.
- **Edit mode**: When `editing` is true, fields render as inputs via `FieldRenderer`. Changes are tracked in local `editingValues` state and surfaced to the parent via `setActiveChanges`.
- **New building flow**: If `selectedItem.id < 0`, the component auto-enables edit mode and calls `createBuilding` on save.
- **File handling**: Attached files are fetched via `useFilesByBuildingId` and organized by tag into relational properties (e.g. `buildingMaintenanceRecords`). File uploads trigger SWR revalidation.
- **Loading/error states**: Uses `handleApiError` to surface hook errors as toasts. Shows a loading spinner in `TabSidebar` when files are loading.
- **Optimistic updates**: After save, `selectedItem` is updated locally with the API response before SWR revalidates.


## Permissions

Editing controls are gated by CASL. The `FieldRenderer` disables inputs when the user lacks update permission.

```tsx
{ability.can("update", "Building") && <input ... />}
```

## Related

- [AddBuilding](/docs/components/AddBuilding) — Dialog for initiating new building creation
- [FieldRenderer](/docs/components/FieldRenderer) — Renders individual form fields based on type
- [useBuilding / useCreateBuilding](/docs/hooks/buildings) — Data fetching and mutation hooks
- [Building data model](/docs/data-model/building) — Prisma schema and type definitions
