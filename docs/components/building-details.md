---
title: BuildingDetails
description: Displays and edits detailed building information across multiple tabbed sections.
---

# BuildingDetails

The tabbed detail panel for a building record, with fields organized into sections such as general info, units, energy, environmental, and attached files. It follows the [detail panel contract](./overview.md#shared-conventions): every prop is optional, `saveChanges` is exposed through a ref, and a `selectedItem.id` below zero means a new record.

```tsx
import BuildingDetails, { BuildingDetailsRef } from '@collabdt/core/core/components/viewers/Data/buildingDetails/BuildingDetails';

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

await detailsRef.current?.saveChanges();
```

The entity-specific props are `selectedItem` (`Building`), `setSelectedItem` (`(building: Building) => void`) and `buildings` (`Building[]`, undocumented).

## Behaviour

Sections come from `useBuildingHeaders()`; clicking a tab updates `activeTab` and renders that section's fields. In edit mode `FieldRenderer` turns each field into an input, changes accumulate in local `editingValues` state, and `setActiveChanges` reports them to the parent. A new building (`id < 0`) auto-enables edit mode and saves through `createBuilding`.

Attached files are fetched with `useFilesByBuildingId` and grouped by tag into relational properties such as `buildingMaintenanceRecords`; an upload triggers SWR revalidation, and `TabSidebar` shows a spinner while files load.

After a save, `selectedItem` is updated locally from the API response before SWR revalidates.

Editing controls are gated on `update` for the `Building` subject; see [Shared conventions](./overview.md#shared-conventions).

## Related

- [AddBuilding](./data-menu.md) — the dialog that starts a new building
- [useBuilding / useCreateBuilding](../hooks/buildings.md)
- [Building data model](../architecture/data-model.mdx#building)
