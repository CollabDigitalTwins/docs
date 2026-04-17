---
title: Infrastructure hooks
description: SWR-based hooks for fetching, creating, updating, and deleting infrastructure records.
category: hooks
status: draft
last_updated: 2025-01-14
---

# Infrastructure hooks

Hooks for managing infrastructure data throughout the application. Built on SWR for caching and revalidation, with mutation hooks for create, update, and delete operations. All hooks are accessed through the core hooks provider and delegate to an ApiAdapter for actual API calls.

## Hooks

| Hook | Description |
|------|-------------|
| `useInfrastructures` | Fetches all infrastructure records |
| `useInfrastructure` | Fetches a single infrastructure by ID, with update capability |
| `useCreateInfrastructure` | Creates a new infrastructure record |
| `useDeleteInfrastructure` | Deletes an infrastructure record by ID |

---

## `useInfrastructures`

Fetches the complete list of infrastructure records. Returns an empty array while loading or if no data exists.

### Signature

```ts
function useInfrastructures(): UseInfrastructuresReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `infrastructures` | `Infrastructure[]` | Array of infrastructure records, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { infrastructures, isLoading, isError } = useInfrastructures();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <InfrastructureList items={infrastructures} />;
```

---

## `useInfrastructure`

Fetches a single infrastructure record by ID. Also provides an update mutation that revalidates both the individual record and the list cache on success.

### Signature

```ts
function useInfrastructure(infrastructureId: number): UseInfrastructureReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `infrastructureId` | `number` | Yes | The ID of the infrastructure to fetch |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `infrastructure` | `Infrastructure \| null` | The infrastructure record, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateInfrastructure` | `(arg: Partial<Infrastructure>) => Promise<Infrastructure>` | Mutation trigger to update the record |
| `isMutating` | `boolean` | Whether an update is in progress |
| `updateError` | `Error \| undefined` | Error from the last update attempt |
| `updatedData` | `Infrastructure \| undefined` | Response data from successful update |

### Example

```tsx
const { infrastructure, isLoading, updateInfrastructure, isMutating } = useInfrastructure(42);

const handleSave = async (changes: Partial<Infrastructure>) => {
  await updateInfrastructure(changes);
};
```

---

## `useCreateInfrastructure`

Creates a new infrastructure record. Revalidates the infrastructure list cache on success.

### Signature

```ts
function useCreateInfrastructure(): UseCreateInfrastructureReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createInfrastructure` | `(arg: Partial<Infrastructure>) => Promise<Infrastructure>` | Mutation trigger to create a record |
| `isMutating` | `boolean` | Whether creation is in progress |
| `createError` | `Error \| undefined` | Error from the last create attempt |
| `createdData` | `Infrastructure \| undefined` | The newly created infrastructure record |

### Example

```tsx
const { createInfrastructure, isMutating, createError } = useCreateInfrastructure();

const handleCreate = async (data: Partial<Infrastructure>) => {
  const created = await createInfrastructure(data);
  router.push(`/infrastructures/${created.id}`);
};
```

---

## `useDeleteInfrastructure`

Deletes an infrastructure record by ID. Manually revalidates the infrastructure list cache after deletion.

### Signature

```ts
function useDeleteInfrastructure(infrastructureId?: number): UseDeleteInfrastructureReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `infrastructureId` | `number` | No | Optional ID used for SWR cache key |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `deleteInfrastructure` | `(id: number) => Promise<void>` | Function to delete an infrastructure by ID |
| `isMutating` | `boolean` | Whether deletion is in progress |
| `deleteError` | `Error \| undefined` | Error from the last delete attempt |
| `deletedData` | `unknown` | Response data from successful deletion |

### Example

```tsx
const { deleteInfrastructure, isMutating } = useDeleteInfrastructure();

const handleDelete = async (id: number) => {
  if (confirm("Delete this infrastructure?")) {
    await deleteInfrastructure(id);
  }
};
```

---

## Related

- [Data model: Infrastructure](/docs/data-model/infrastructure)
- [Hooks provider](/docs/hooks/provider)
