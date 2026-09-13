---
title: useInfrastructure hooks
description: SWR-based hooks for fetching, creating, updating, and deleting infrastructure records.
---

# useInfrastructure hooks

Hooks for infrastructure records.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useInfrastructures` | Fetches all infrastructure records |
| `useInfrastructure` | Fetches a single infrastructure by ID, with update capability |
| `useCreateInfrastructure` | Creates a new infrastructure record |
| `useDeleteInfrastructure` | Deletes an infrastructure record by ID |

## `useInfrastructures()`

Fetches the complete list as `infrastructures: Infrastructure[]`.

```tsx
const { infrastructures, isLoading, isError } = useInfrastructures();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <InfrastructureList items={infrastructures} />;
```

## `useInfrastructure(infrastructureId)`

Fetches a single record by `infrastructureId` (`number`), and provides an update mutation.

| Field | Type | Description |
|-------|------|-------------|
| `infrastructure` | `Infrastructure \| null` | The record, or null if not loaded |
| `updateInfrastructure` | `(arg: Partial<Infrastructure>) => Promise<Infrastructure>` | Mutation trigger |

```tsx
const { infrastructure, isLoading, updateInfrastructure, isMutating } = useInfrastructure(42);

const handleSave = async (changes: Partial<Infrastructure>) => {
  await updateInfrastructure(changes);
};
```

A successful update revalidates both the individual record and the list.

## `useCreateInfrastructure()`

Creates a record. Returns `createInfrastructure: (arg: Partial<Infrastructure>) => Promise<Infrastructure>`, and revalidates the list on success.

```tsx
const { createInfrastructure, isMutating, createError } = useCreateInfrastructure();

const handleCreate = async (data: Partial<Infrastructure>) => {
  const created = await createInfrastructure(data);
  router.push(`/infrastructures/${created.id}`);
};
```

## `useDeleteInfrastructure(infrastructureId?)`

Deletes a record. The optional `infrastructureId` (`number`) only seeds the SWR cache key; the ID to delete is passed to the trigger.

Returns `deleteInfrastructure: (id: number) => Promise<void>`, plus `deletedData: unknown`, and revalidates the list after deletion.

```tsx
const { deleteInfrastructure, isMutating } = useDeleteInfrastructure();

const handleDelete = async (id: number) => {
  if (confirm("Delete this infrastructure?")) {
    await deleteInfrastructure(id);
  }
};
```

## Related

- [Data model: Infrastructure](/docs/architecture/data-model#infrastructure)
- [Concepts: IFC infrastructure types](/docs/concepts/ifc-infrastructure-types)
