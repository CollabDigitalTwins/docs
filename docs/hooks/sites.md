---
title: useSite hooks
description: Hooks for fetching, creating, updating, and deleting sites.
---

# useSite hooks

Hooks for site data. Sites represent physical locations that can contain multiple buildings.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useSites` | Fetches all sites |
| `useSite` | Fetches a single site by ID and provides an update function |
| `useCreateSite` | Creates a new site |
| `useDeleteSite` | Deletes a site by ID |

## `useSites()`

Fetches all sites as `sites: Site[]`.

```tsx
const { sites, isLoading, isError } = useSites();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <SiteList sites={sites} />;
```

## `useSite(siteId)`

Fetches a single site by `siteId` (`string`), and provides an update mutation.

| Field | Type | Description |
|-------|------|-------------|
| `site` | `Site \| null` | The fetched site, or null if not loaded |
| `updateSite` | `(arg: SiteUpdateInput) => Promise<Site>` | Mutation trigger |

```tsx
const { site, isLoading, updateSite, isMutating } = useSite(siteId);

const handleUpdate = async () => {
  await updateSite({ name: "Updated Site Name" });
};

const handleBuildingAssociation = async () => {
  await updateSite({
    siteBuildings: {
      connect: [{ id: 123 }],
      disconnect: [{ id: 456 }],
    },
  });
};
```

A successful update revalidates the individual site cache, the sites list, and the buildings list, since buildings may be associated with the site.

## `useCreateSite()`

Creates a site. Returns `createSite: (arg: Partial<Site>) => Promise<Site>`.

```tsx
const { createSite, isMutating, createError } = useCreateSite();

const handleSubmit = async (data: Partial<Site>) => {
  await createSite(data);
};
```

A successful creation revalidates the sites list.

## `useDeleteSite(siteId?)`

Deletes a site. The optional `siteId` (`number | string`) only seeds the SWR mutation key; the ID to delete is passed to the trigger.

Returns `deleteSite: (id: string | number) => Promise<void>`, plus `deletedData: unknown`.

```tsx
const { deleteSite, isMutating } = useDeleteSite();

const handleDelete = async (siteId: number) => {
  await deleteSite(siteId);
};
```

Deletion revalidates both the sites list and the buildings list, since buildings may have been associated with the deleted site.

## Related

- [Data Model: Site](/docs/architecture/data-model#site)
- [Hooks: Buildings](/docs/hooks/buildings)
