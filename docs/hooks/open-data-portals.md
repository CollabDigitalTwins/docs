---
title: useOpenDataPortals hooks
description: SWR-based hooks for fetching open data portal records with various filtering options.
category: hooks
status: draft
last_updated: 2025-01-14
---

# useOpenDataPortals hooks

These hooks provide read access to open data portal records, supporting queries by ID, municipality, country subdivision, dataset group, and name. All hooks use SWR for caching and revalidation, and are created via a factory function that accepts an `ApiAdapter` for dependency injection.

## Hooks

| Hook | Description |
|------|-------------|
| `useOpenDataPortals` | Fetches all open data portals |
| `useOpenDataPortalById` | Fetches a single portal by numeric ID |
| `useOpenDataPortalsByMunicipality` | Fetches portals filtered by municipality name |
| `useOpenDataPortalsByMunicipalityAndCountrySubdivision` | Fetches portals filtered by both municipality and country subdivision |
| `useOpenDataPortalsByCountrySubdivision` | Fetches portals filtered by country subdivision (province/territory) |
| `useOpenDataPortalsByGroup` | Fetches portals filtered by dataset group |
| `useOpenDataPortalsByName` | Fetches portals filtered by portal name |

---

## `useOpenDataPortals`

Fetches all open data portal records. Returns an empty array while loading or on error.

### Signature

```ts
function useOpenDataPortals(): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Array of portal records, defaults to `[]` |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { openDataPortals, isLoading } = useOpenDataPortals();

if (isLoading) return <Skeleton />;

return (
  <ul>
    {openDataPortals.map((portal) => (
      <li key={portal.id}>{portal.name}</li>
    ))}
  </ul>
);
```

---

## `useOpenDataPortalById`

Fetches a single open data portal by its numeric ID. Passes `null` as the SWR key when `id` is `null`, preventing the fetch.

### Signature

```ts
function useOpenDataPortalById(id: number | null): {
  openDataPortal: OpenDataPortal | null;
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | Portal ID to fetch, or `null` to skip |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortal` | `OpenDataPortal \| null` | Portal record or `null` if not found/loading |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { openDataPortal, isLoading } = useOpenDataPortalById(selectedPortalId);

if (!openDataPortal) return null;
```

---

## `useOpenDataPortalsByMunicipality`

Fetches portals filtered by municipality name. Skips the request when `municipality` is `null`.

### Signature

```ts
function useOpenDataPortalsByMunicipality(municipality: string | null): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `municipality` | `string \| null` | Yes | Municipality name to filter by, or `null` to skip |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Filtered portal records |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

---

## `useOpenDataPortalsByMunicipalityAndCountrySubdivision`

Fetches portals filtered by both municipality and country subdivision. Skips the request when either parameter is `null`.

### Signature

```ts
function useOpenDataPortalsByMunicipalityAndCountrySubdivision(
  municipality: string | null,
  countrySubdivision: string | null
): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `municipality` | `string \| null` | Yes | Municipality name to filter by |
| `countrySubdivision` | `string \| null` | Yes | Province/territory code to filter by |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Filtered portal records |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

---

## `useOpenDataPortalsByCountrySubdivision`

Fetches portals filtered by country subdivision (province/territory). Skips the request when `countrySubdivision` is `null`.

### Signature

```ts
function useOpenDataPortalsByCountrySubdivision(countrySubdivision: string | null): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `countrySubdivision` | `string \| null` | Yes | Province/territory code to filter by |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Filtered portal records |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

---

## `useOpenDataPortalsByGroup`

Fetches portals filtered by dataset group. Skips the request when `group` is `null`.

### Signature

```ts
function useOpenDataPortalsByGroup(group: DatasetGroup | null): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `group` | `DatasetGroup \| null` | Yes | Dataset group enum value to filter by |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Filtered portal records |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

---

## `useOpenDataPortalsByName`

Fetches portals filtered by portal name. Skips the request when `name` is `null`.

### Signature

```ts
function useOpenDataPortalsByName(name: string | null): {
  openDataPortals: OpenDataPortal[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string \| null` | Yes | Portal name to search for |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `openDataPortals` | `OpenDataPortal[]` | Filtered portal records |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

---

## Related

- [OpenDataPortal data model](/docs/data-model/open-data-portal)
- [DatasetGroup type](/docs/data-model/dataset-group)
