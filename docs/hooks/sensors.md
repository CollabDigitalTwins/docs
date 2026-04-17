---
title: Sensor hooks
description: SWR-based hooks for fetching, creating, updating, and deleting sensor data.
category: hooks
status: draft
last_updated: 2025-01-14
---

# Sensor hooks

These hooks manage sensor data throughout the application. They use SWR for data fetching with automatic caching and revalidation. The hooks are created via a factory pattern (`createSensorHooks`) that accepts an API adapter, allowing for different data sources. Components import hooks directly from `src/core/hooks/sensors/sensors.ts`.

## Hooks

| Hook | Description |
|------|-------------|
| `useSensors` | Fetches all sensors |
| `useSensor` | Fetches a single sensor by ID; includes update and delete mutations |
| `useSensorsByBuilding` | Fetches sensors filtered by building ID |
| `useSensorsByAuthor` | Fetches sensors filtered by author ID |
| `useCreateSensor` | Mutation hook for creating a new sensor |

---

## `useSensors`

Fetches all sensors from the API adapter. Returns an empty array while loading or if no sensors exist.

### Signature

```ts
function useSensors(): {
  sensors: Sensor[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensors` | `Sensor[]` | Array of all sensors, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { sensors, isLoading } = useSensors();

if (isLoading) return <Skeleton />;

return <SensorList sensors={sensors} />;
```

---

## `useSensor`

Fetches a single sensor by ID. Also provides `updateSensor` and `deleteSensor` mutation functions. Passing `null` disables the fetch.

### Signature

```ts
function useSensor(id: number | null): {
  sensor: Sensor | null;
  isLoading: boolean;
  isError: Error | undefined;
  updateSensor: (arg: Partial<Sensor>) => Promise<Sensor>;
  isMutating: boolean;
  updateError: Error | undefined;
  updatedData: Sensor | undefined;
  deleteSensor: () => Promise<Sensor>;
  isDeleting: boolean;
  deleteError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | Sensor ID to fetch, or `null` to disable fetching |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensor` | `Sensor \| null` | The fetched sensor, or `null` if loading/not found |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateSensor` | `(arg: Partial<Sensor>) => Promise<Sensor>` | Trigger function to update the sensor |
| `isMutating` | `boolean` | True while update mutation is in progress |
| `updateError` | `Error \| undefined` | Error from update mutation |
| `updatedData` | `Sensor \| undefined` | Returned data from successful update |
| `deleteSensor` | `() => Promise<Sensor>` | Trigger function to delete the sensor |
| `isDeleting` | `boolean` | True while delete mutation is in progress |
| `deleteError` | `Error \| undefined` | Error from delete mutation |

### Example

```tsx
const { sensor, isLoading, updateSensor, deleteSensor } = useSensor(sensorId);

const handleUpdate = async () => {
  await updateSensor({ name: "Updated Sensor" });
};

const handleDelete = async () => {
  await deleteSensor();
};
```

### Notes

On successful update, the hook revalidates:
- The individual sensor cache key
- The all-sensors list
- Building-specific and author-specific sensor lists (both previous and new values if changed)

On successful delete, the hook:
- Removes the sensor from its individual cache key without revalidation
- Revalidates the all-sensors list and any associated building/author lists

---

## `useSensorsByBuilding`

Fetches sensors filtered by building ID. Passing `null` disables the fetch.

### Signature

```ts
function useSensorsByBuilding(buildingId: number | null): {
  sensors: Sensor[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number \| null` | Yes | Building ID to filter by, or `null` to disable fetching |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensors` | `Sensor[]` | Array of sensors for the building, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { sensors, isLoading } = useSensorsByBuilding(selectedBuildingId);
```

---

## `useSensorsByAuthor`

Fetches sensors filtered by author ID. Passing `null` disables the fetch.

### Signature

```ts
function useSensorsByAuthor(authorId: number | null): {
  sensors: Sensor[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `authorId` | `number \| null` | Yes | Author ID to filter by, or `null` to disable fetching |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sensors` | `Sensor[]` | Array of sensors by the author, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { sensors, isLoading } = useSensorsByAuthor(currentUserId);
```

---

## `useCreateSensor`

Mutation hook for creating a new sensor. On success, revalidates the all-sensors list and any associated building/author lists.

### Signature

```ts
function useCreateSensor(): {
  createSensor: (arg: { sensorData: Partial<Sensor> }) => Promise<Sensor>;
  isMutating: boolean;
  createError: Error | undefined;
  createdData: Sensor | undefined;
}
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createSensor` | `(arg: { sensorData: Partial<Sensor> }) => Promise<Sensor>` | Trigger function to create a sensor |
| `isMutating` | `boolean` | True while creation is in progress |
| `createError` | `Error \| undefined` | Error from create mutation |
| `createdData` | `Sensor \| undefined` | The newly created sensor on success |

### Example

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

---

## Related

- [Sensor data model](/docs/data-model/sensor)
- [Building hooks](/docs/hooks/buildings)
