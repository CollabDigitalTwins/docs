---
title: useBuilding hooks
description: SWR-based hooks for fetching, creating, and updating building data.
---

# useBuilding hooks

Hooks for building entities, used wherever building data is displayed or modified: detail panels, map overlays, and building lists.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useBuildings` | Fetches all buildings |
| `useBuilding` | Fetches a single building by ID, includes update mutation |
| `useBuildingsByOsm` | Fetches buildings matching an OpenStreetMap ID |
| `useBuildingOsmIds` | Fetches all OSM IDs that have associated buildings |
| `useCreateBuilding` | Creates a new building |

## `useBuildings()`

Fetches the complete list of buildings as `buildings: Building[]`.

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

## `useBuilding(id)`

Fetches a single building by `id` (`number | null`), and provides an update mutation.

| Field | Type | Description |
|-------|------|-------------|
| `building` | `Building \| null` | The fetched building, or null if not loaded |
| `updateBuilding` | `(arg: Partial<Building>) => Promise<Building>` | Mutation trigger |

```tsx
const { building, isLoading, updateBuilding, isMutating } = useBuilding(buildingId);

if (isLoading) return <Skeleton />;
if (!building) return <NotFound />;

const handleRename = async (name: string) => {
  await updateBuilding({ name });
};
```

A successful update revalidates `["building", id]`, `["buildings"]`, and `["filesByBuilding", id, ""]`.

## `useBuildingsByOsm(osmId)`

Fetches all buildings associated with an OpenStreetMap ID (`number | null`), as `buildings: Building[]`.

```tsx
const { buildings, isLoading } = useBuildingsByOsm(selectedOsmId);
```

## `useBuildingOsmIds()`

Fetches every OSM ID that has a building in the system, as `osmIds: number[]`. Use it to highlight map buildings that exist in the database.

## `useCreateBuilding()`

Creates a building. Returns `createBuilding`, with the signature:

```ts
(arg: { buildingData: Partial<Building>, organizationId: string }) => Promise<Building>
```

```tsx
const { createBuilding, isMutating, createError } = useCreateBuilding();

const handleSubmit = async (formData: BuildingFormData) => {
  await createBuilding({
    buildingData: formData,
    organizationId: currentOrg.id,
  });
};
```

A successful creation revalidates `["buildings"]`.

## Related

- [Data Model: Building](/docs/architecture/data-model#building)
- [Hooks: useFiles](/docs/hooks/files)
