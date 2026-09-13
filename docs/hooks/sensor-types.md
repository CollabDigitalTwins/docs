---
title: useSensorType hooks
description: Hooks for fetching, creating, updating, and deleting sensor type records.
---

# useSensorType hooks

Hooks for sensor type records: the value ranges and colour ramps that drive how readings are displayed.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useSensorTypes` | Fetches all sensor types |
| `useSensorType` | Fetches a single sensor type by ID, with update and delete mutations |
| `useCreateSensorType` | Creates a new sensor type |

## `useSensorTypes()`

Fetches the complete list as `sensorTypes: SensorType[]`.

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

## `useSensorType(id)`

Fetches a single sensor type by `id` (`number | null`), with update and delete mutations.

| Field | Type | Description |
|-------|------|-------------|
| `sensorType` | `SensorType \| null` | The fetched sensor type, or `null` if not loaded |
| `updateSensorType` | `(arg: Partial<SensorType>) => Promise<SensorType>` | Update trigger |
| `deleteSensorType` | `() => Promise<SensorType>` | Delete trigger |
| `isDeleting` | `boolean` | Whether a delete is in progress |
| `deleteError` | `Error \| undefined` | Error from the most recent delete attempt |

```tsx
const { sensorType, isLoading, updateSensorType, deleteSensorType } = useSensorType(42);

const handleRename = async () => {
  await updateSensorType({ name: "Updated Name" });
};

const handleDelete = async () => {
  await deleteSensorType();
};
```

A successful update revalidates `["sensorType", id]` and `["sensorTypes"]`. A successful delete drops the individual entry from cache without revalidating it, and revalidates the list.

## `useCreateSensorType()`

Creates a sensor type. Returns `createSensorType: (arg: { sensorTypeData: Partial<SensorType> }) => Promise<SensorType>`.

```tsx
const { createSensorType, isMutating } = useCreateSensorType();

const handleCreate = async () => {
  await createSensorType({ sensorTypeData: { name: "Temperature" } });
};
```

A successful creation revalidates `["sensorTypes"]`.

## Related

- [Data Model: SensorType](/docs/architecture/data-model#sensortype)
- [Guides: Sensors & IoT Data](/docs/guides/sensors-and-iot)
