---
title: useBuilding hooks
description: SWR-based hooks for fetching, creating, and updating building data.
category: hooks
status: draft
last_updated: 2025-01-13
---

# useBuilding hooks

Hooks for managing building entities in the CDT platform. Used throughout the application wherever building data is displayed or modified (building details panels, map overlays, building lists). All hooks use SWR for data fetching with automatic caching and revalidation, and SWR Mutation for create/update operations.

## Hooks

| Hook | Description |
|------|-------------|
| `useBuildings` | Fetches all buildings |
| `useBuilding` | Fetches a single building by ID, includes update mutation |
| `useBuildingsByOsm` | Fetches buildings matching an OpenStreetMap ID |
| `useBuildingOsmIds` | Fetches all OSM IDs that have associated buildings |
| `useCreateBuilding` | Creates a new building |

---

## `useBuildings`

Fetches the complete list of buildings. Returns an empty array while loading or on error.

### Signature

```ts
function useBuildings(): UseBuildingsReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `buildings` | `Building[]` | Array of buildings, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { buildings, isLoading } = useBuildings();

if (isLoading) return <Skeleton />;

return (
  <ul>
    {buildings.map((b) => (
      <li key={b.id}>{b.name}</li>
    ))}
  </ul>
);
```

### Notes


---

## `useBuilding`

Fetches a single building by ID. Also provides an `updateBuilding` mutation that revalidates related caches on success.

### Signature

```ts
function useBuilding(id: number | null): UseBuildingReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | Building ID. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `building` | `Building \| null` | The fetched building, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateBuilding` | `(arg: Partial<Building>) => Promise<Building>` | Mutation trigger to update the building |
| `isMutating` | `boolean` | Whether an update is in progress |
| `updateError` | `Error \| undefined` | Error from the most recent update attempt |
| `updatedData` | `Building \| undefined` | Response data from successful update |

### Example

```tsx
const { building, isLoading, updateBuilding, isMutating } = useBuilding(buildingId);

if (isLoading) return <Skeleton />;
if (!building) return <NotFound />;

const handleRename = async (name: string) => {
  await updateBuilding({ name });
};
```

On successful update, the hook revalidates `["building", id]`, `["buildings"]`, and `["filesByBuilding", id, ""]` cache keys.

---

## `useBuildingsByOsm`

Fetches all buildings associated with a given OpenStreetMap ID.

### Signature

```ts
function useBuildingsByOsm(osmId: number | null): UseBuildingsByOsmReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `osmId` | `number \| null` | Yes | OpenStreetMap building ID. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `buildings` | `Building[]` | Buildings matching the OSM ID, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { buildings, isLoading } = useBuildingsByOsm(selectedOsmId);
```

---

## `useBuildingOsmIds`

Fetches the list of all OSM IDs that have buildings in the system.

### Signature

```ts
function useBuildingOsmIds(): UseBuildingOsmIdsReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `osmIds` | `number[]` | Array of OSM IDs, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { osmIds, isLoading } = useBuildingOsmIds();

// Use to highlight buildings on map that exist in the database
```

---

## `useCreateBuilding`

Creates a new building. Revalidates the buildings list on success.

### Signature

```ts
function useCreateBuilding(): UseCreateBuildingReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createBuilding` | `(arg: { buildingData: Partial<Building>, organizationId: string }) => Promise<Building>` | Mutation trigger |
| `isMutating` | `boolean` | Whether creation is in progress |
| `createError` | `Error \| undefined` | Error from the most recent creation attempt |
| `createdData` | `Building \| undefined` | The newly created building on success |

### Example

```tsx
const { createBuilding, isMutating, createError } = useCreateBuilding();

const handleSubmit = async (formData: BuildingFormData) => {
  await createBuilding({
    buildingData: formData,
    organizationId: currentOrg.id,
  });
};
```

### Notes

On successful creation, the hook revalidates the `["buildings"]` cache key.

---

## Related

- [Data Model: Building](/docs/data-model/building)
- [Hooks: useFiles](/docs/hooks/files) (referenced in revalidation)
