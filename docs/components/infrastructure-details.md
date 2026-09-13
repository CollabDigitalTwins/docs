---
title: InfrastructureDetails
description: Displays and edits infrastructure properties in a tabbed detail view.
---

# InfrastructureDetails

The tabbed detail panel for an infrastructure record, shown in the data viewer when an infrastructure item is selected. It follows the [detail panel contract](./overview.md#shared-conventions): every prop is optional, `saveChanges` is exposed through a ref, and a record with an `id` below zero enters edit mode automatically.

```tsx
import InfrastructureDetails from '@collabdt/core/core/components/viewers/Data/infrastructureDetails/InfrastructureDetails';

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

await detailsRef.current?.saveChanges();
```

The entity-specific props are `selectedInfrastructure` (`InfrastructureWithAssociatedBuildings`), `setSelectedInfrastructure` (`(infrastructure: InfrastructureWithAssociatedBuildings) => void`) and `infrastructures` (`InfrastructureWithAssociatedBuildings[]`, undocumented).

## Behaviour

Tabs are generated from `useInfrastructureHeaders()`. Fields render by type as text inputs, textareas, date pickers, checkboxes, file uploads or enum selects. Saving calls `createInfrastructure` for new records and `updateInfrastructure` for existing ones, then reports the outcome as a toast; API errors go through `handleApiError`.

Individual inputs are disabled without `update` on the `Infrastructure` subject; `FieldRenderer` does the check. See [Shared conventions](./overview.md#shared-conventions).

## Related

- [AddInfrastructure](./data-menu.md) — the dialog that starts a new infrastructure record
- [useInfrastructure / useCreateInfrastructure](../hooks/infrastructures.md)
- [Infrastructure data model](../architecture/data-model.mdx#infrastructure)
