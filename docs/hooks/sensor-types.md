---
title: useSensorType hooks
description: Hooks for fetching, creating, updating, and deleting sensor type records.
category: hooks
status: draft
last_updated: 2025-01-14
---

# useSensorType hooks

These hooks manage sensor type data used throughout the platform. They provide read access to sensor type lists and individual records, plus mutations for create, update, and delete operations. Built on SWR for caching and revalidation, with adapter-based data fetching for flexibility across different API implementations.

## Hooks

| Hook | Description |
|------|-------------|
| `useSensorTypes` | Fetches all sensor types |
| `useSensorType` | Fetches a single sensor type by ID, with update and delete mutations |
| `useCreateSensorType` | Creates a new sensor type |

---

## `useSensorTypes`

Fetches the complete list of sensor types. Returns an array that defaults to empty while loading.

### Signature

```ts
function useSensorTypes(): UseSensorTypesReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensorTypes` | `SensorType[]` | Array of sensor types, defaults to `[]` |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { sensorTypes, isLoading } = useSensorTypes();

if (isLoading) return <Skeleton />;

return (
  <ul>
    {sensorTypes.map((type) => (
      <li key={type.id}>{type.name}</li>
    ))}
  </ul>
);
```


---

## `useSensorType`

Fetches a single sensor type by ID. Also provides `updateSensorType` and `deleteSensorType` mutation triggers.

### Signature

```ts
function useSensorType(id: number | null): UseSensorTypeReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | Sensor type ID to fetch. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensorType` | `SensorType \| null` | The fetched sensor type, or `null` if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateSensorType` | `(arg: Partial<SensorType>) => Promise<SensorType>` | Trigger to update the sensor type |
| `isMutating` | `boolean` | Whether an update is in progress |
| `updateError` | `Error \| undefined` | Error from the most recent update attempt |
| `updatedData` | `SensorType \| undefined` | Data returned from the most recent update |
| `deleteSensorType` | `() => Promise<SensorType>` | Trigger to delete the sensor type |
| `isDeleting` | `boolean` | Whether a delete is in progress |
| `deleteError` | `Error \| undefined` | Error from the most recent delete attempt |

### Example

```tsx
const { sensorType, isLoading, updateSensorType, deleteSensorType } = useSensorType(42);

const handleRename = async () => {
  await updateSensorType({ name: "Updated Name" });
};

const handleDelete = async () => {
  await deleteSensorType();
};
```

### Notes

On successful update, revalidates both the individual sensor type cache key (`["sensorType", id]`) and the list (`["sensorTypes"]`).

On successful delete, removes the individual entry from cache without revalidation and revalidates the list.

---

## `useCreateSensorType`

Creates a new sensor type record.

### Signature

```ts
function useCreateSensorType(): UseCreateSensorTypeReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createSensorType` | `(arg: { sensorTypeData: Partial<SensorType> }) => Promise<SensorType>` | Trigger to create a sensor type |
| `isMutating` | `boolean` | Whether creation is in progress |
| `createError` | `Error \| undefined` | Error from the most recent create attempt |
| `createdData` | `SensorType \| undefined` | Data returned from the most recent creation |

### Example

```tsx
const { createSensorType, isMutating } = useCreateSensorType();

const handleCreate = async () => {
  await createSensorType({ sensorTypeData: { name: "Temperature" } });
};

return (
  <Button onClick={handleCreate} disabled={isMutating}>
    Add Sensor Type
  </Button>
);
```

### Notes

On successful creation, revalidates the `["sensorTypes"]` list cache key.

---

## Related

- [Data Model: SensorType](/docs/data-model/sensor-type)
- [Hooks: Provider](/docs/hooks/provider)
