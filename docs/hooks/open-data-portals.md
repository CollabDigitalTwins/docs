---
title: useOpenDataPortals hooks
description: SWR-based hooks for fetching and creating open data portal records.
---

# useOpenDataPortals hooks

Read and create access to open data portal records, with queries by ID, municipality, country subdivision, dataset group, and name.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useOpenDataPortals` | Fetches all open data portals |
| `useOpenDataPortalById` | Fetches a single portal by numeric ID |
| `useCreateOpenDataPortal` | Creates a new open data portal record |
| `useOpenDataPortalsByMunicipality` | Filters by municipality name |
| `useOpenDataPortalsByMunicipalityAndCountrySubdivision` | Filters by both municipality and country subdivision |
| `useOpenDataPortalsByCountrySubdivision` | Filters by province or territory |
| `useOpenDataPortalsByGroup` | Filters by dataset group |
| `useOpenDataPortalsByName` | Filters by portal name |

## `useOpenDataPortals()`

Fetches all portal records as `openDataPortals: OpenDataPortal[]`.

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

## `useOpenDataPortalById(id)`

Fetches one portal by `id` (`number | null`) as `openDataPortal: OpenDataPortal | null`.

```tsx
const { openDataPortal, isLoading } = useOpenDataPortalById(selectedPortalId);

if (!openDataPortal) return null;
```

## The filter hooks

Five hooks share one shape: each takes its filter value, skips the request when any argument is `null`, and returns `openDataPortals: OpenDataPortal[]`.

| Hook | Parameters |
|------|------------|
| `useOpenDataPortalsByMunicipality` | `municipality: string \| null` |
| `useOpenDataPortalsByMunicipalityAndCountrySubdivision` | `municipality: string \| null`, `countrySubdivision: string \| null` |
| `useOpenDataPortalsByCountrySubdivision` | `countrySubdivision: string \| null` — province or territory code |
| `useOpenDataPortalsByGroup` | `group: DatasetGroup \| null` |
| `useOpenDataPortalsByName` | `name: string \| null` |

```tsx
const { openDataPortals, isLoading } = useOpenDataPortalsByCountrySubdivision("ON");
```

## `useCreateOpenDataPortal()`

Creates a portal. Returns `createOpenDataPortal: (data: Partial<OpenDataPortal>) => Promise<OpenDataPortal>`, and revalidates the portal list on success.

```tsx
const { createOpenDataPortal, isMutating } = useCreateOpenDataPortal();

async function handleCreate() {
  const portal = await createOpenDataPortal({
    name: "City of Ottawa Open Data",
    countrySubdivision: "ON",
    municipality: "Ottawa",
  });
}
```

## Related

- [OpenDataPortal data model](/docs/architecture/data-model#opendataportal)
- [Concepts: Open data portals](/docs/concepts/open-data-portals)
