---
title: InfrastructureDetails
description: Displays and edits infrastructure properties in a tabbed detail view.
category: components
status: draft
last_updated: 2025-01-13
---

# InfrastructureDetails

Tabbed detail panel for viewing and editing infrastructure records. Appears in the data viewer when an infrastructure item is selected. Supports both viewing mode and editing mode, with automatic edit mode activation for new (unsaved) infrastructure.

## Usage

```tsx
import InfrastructureDetails from '@/core/components/viewers/Data/infrastructureDetails/InfrastructureDetails';

const detailsRef = useRef<InfrastructureDetailsRef>(null);

<InfrastructureDetails
  ref={detailsRef}
  selectedInfrastructure={infrastructure}
  setSelectedInfrastructure={setInfrastructure}
  editing={isEditing}
  setEditing={setIsEditing}
  setActiveChanges={setHasChanges}
  activeTab="general"
  setActiveTab={setActiveTab}
/>

// Save from parent
await detailsRef.current?.saveChanges();
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selectedInfrastructure` | `InfrastructureWithAssociatedBuildings` | No | — | The infrastructure record to display |
| `setSelectedInfrastructure` | `(infrastructure: InfrastructureWithAssociatedBuildings) => void` | No | — | Callback to update the selected infrastructure after save |
| `editing` | `boolean` | No | `false` | Whether the form is in edit mode |
| `setEditing` | `(editing: boolean) => void` | No | — | Callback to toggle edit mode |
| `setActiveChanges` | `(editing: boolean) => void` | No | — | Callback to signal unsaved changes exist |
| `infrastructures` | `InfrastructureWithAssociatedBuildings[]` | No | — | <!-- description --> |
| `activeTab` | `string` | No | — | The currently selected tab key |
| `setActiveTab` | `(tab: string) => void` | No | `() => {}` | Callback when tab selection changes |

## Ref Methods

| Method | Return Type | Description |
|--------|-------------|-------------|
| `saveChanges` | `Promise<void>` | Persists edits via create or update API, then exits edit mode |

## Behaviour

- Tabs are generated dynamically from `useInfrastructureHeaders()`.
- Fields render differently based on type: text inputs, textareas, date pickers, checkboxes, file uploads, and enum selects.
- New infrastructure records (id < 0) automatically enter edit mode on mount.
- On save, calls `createInfrastructure` for new records or `updateInfrastructure` for existing ones.
- Displays toast notifications on success or failure.
- API errors are processed through `handleApiError` for consistent error handling.

## Design Decisions

<!-- TODO: Why was this component built this way? Note any tradeoffs, constraints, or alternatives considered. -->

## Permissions

Individual field inputs are disabled based on CASL permissions. The `FieldRenderer` child component checks permissions before enabling edits.

```tsx
{ability.can('update', 'Infrastructure') && <Input ... />}
```

## Related

- [FieldRenderer](/docs/components/field-renderer) — renders individual form fields
- [AddInfrastructure](/docs/components/add-infrastructure) — dialog for initiating new infrastructure creation
- [useInfrastructure](/docs/hooks/infrastructures) — SWR hook for fetching and mutating infrastructure
- [useCreateInfrastructure](/docs/hooks/infrastructures) — SWR hook for creating infrastructure
- [Infrastructure](/docs/data-model/infrastructure) — Prisma model definition