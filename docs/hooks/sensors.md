---
title: useSensor hooks
description: SWR-based hooks for fetching, creating, updating, and deleting sensor data.
---

# useSensor hooks

Hooks for sensor data, including filtering by building and by author.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useSensors` | Fetches all sensors |
| `useSensor` | Fetches a single sensor by ID, with update and delete mutations |
| `useSensorsByBuilding` | Fetches sensors filtered by building ID |
| `useSensorsByAuthor` | Fetches sensors filtered by author ID |
| `useCreateSensor` | Creates a new sensor |

## `useSensors()`

Fetches all sensors as `sensors: Sensor[]`.

```tsx
const { sensors, isLoading } = useSensors();

if (isLoading) return <Skeleton />;

return <SensorList sensors={sensors} />;
```

## `useSensor(id)`

Fetches a single sensor by `id` (`number | null`), with update and delete mutations.

| Field | Type | Description |
|-------|------|-------------|
| `sensor` | `Sensor \| null` | The fetched sensor, or `null` if not loaded |
| `updateSensor` | `(arg: Partial<Sensor>) => Promise<Sensor>` | Update trigger |
| `deleteSensor` | `() => Promise<Sensor>` | Delete trigger |
| `isDeleting` | `boolean` | Whether a delete is in progress |
| `deleteError` | `Error \| undefined` | Error from the delete mutation |

```tsx
const { sensor, isLoading, updateSensor, deleteSensor } = useSensor(sensorId);

const handleUpdate = async () => {
  await updateSensor({ name: "Updated Sensor" });
};

const handleDelete = async () => {
  await deleteSensor();
};
```

A successful update revalidates the individual sensor key, the all-sensors list, and the building- and author-specific lists, including the previous values when either changed.

A successful delete drops the sensor from its individual key without revalidating it, then revalidates the all-sensors list and any associated building and author lists.

## `useSensorsByBuilding(buildingId)`

Fetches sensors for a building (`number | null`) as `sensors: Sensor[]`.

```tsx
const { sensors, isLoading } = useSensorsByBuilding(selectedBuildingId);
```

## `useSensorsByAuthor(authorId)`

Fetches sensors by an author (`number | null`) as `sensors: Sensor[]`.

```tsx
const { sensors, isLoading } = useSensorsByAuthor(currentUserId);
```

## `useCreateSensor()`

Creates a sensor. Returns `createSensor: (arg: { sensorData: Partial<Sensor> }) => Promise<Sensor>`, and revalidates the all-sensors list plus any associated building and author lists on success.

```tsx
const { createSensor, isMutating } = useCreateSensor();

const handleCreate = async () => {
  await createSensor({
    sensorData: {
      name: "Temperature Sensor",
      buildingId: 42,
    },
  });
};
```

## Related

- [Sensor data model](/docs/architecture/data-model#sensor)
- [Sensor type hooks](/docs/hooks/sensor-types)
- [Sensors & IoT Data guide](/docs/guides/sensors-and-iot) — Data URL, data formats, and units
