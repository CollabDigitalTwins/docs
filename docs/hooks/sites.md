---
title: Site hooks
description: Hooks for fetching, creating, updating, and deleting sites.
category: hooks
status: draft
last_updated: 2025-01-14
---

# Site hooks

Hooks for managing site data within the CDT platform. Sites represent physical locations that can contain multiple buildings. These hooks use SWR for data fetching with automatic caching and revalidation, and SWR Mutation for create, update, and delete operations. The hooks are created via a factory pattern (`createSiteHooks`) that accepts an API adapter, enabling dependency injection for testing.

## Hooks

| Hook | Description |
|------|-------------|
| `useSites` | Fetches all sites |
| `useSite` | Fetches a single site by ID and provides an update function |
| `useCreateSite` | Creates a new site |
| `useDeleteSite` | Deletes a site by ID |

---

## `useSites`

Fetches all sites from the API adapter.

### Signature

```ts
function useSites(): {
  sites: Site[];
  isLoading: boolean;
  isError: Error | undefined;
}
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `sites` | `Site[]` | Array of sites, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { sites, isLoading, isError } = useSites();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <SiteList sites={sites} />;
```

---

## `useSite`

Fetches a single site by ID and provides a mutation function to update it.

### Signature

```ts
function useSite(siteId: string): {
  site: Site | null;
  isLoading: boolean;
  isError: Error | undefined;
  updateSite: (arg: SiteUpdateInput) => Promise<Site>;
  isMutating: boolean;
  updateError: Error | undefined;
  updatedData: Site | undefined;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `string` | Yes | The ID of the site to fetch |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `site` | `Site \| null` | The fetched site, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateSite` | `(arg: SiteUpdateInput) => Promise<Site>` | Mutation trigger to update the site |
| `isMutating` | `boolean` | Whether an update is in progress |
| `updateError` | `Error \| undefined` | Error from the update mutation |
| `updatedData` | `Site \| undefined` | The site data returned after update |

### Example

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

### Notes

On successful update, the hook revalidates the individual site cache, the sites list, and the buildings list (since buildings may be associated with the site).

---

## `useCreateSite`

Creates a new site.

### Signature

```ts
function useCreateSite(): {
  createSite: (arg: Partial<Site>) => Promise<Site>;
  isMutating: boolean;
  createError: Error | undefined;
  createdData: Site | undefined;
}
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createSite` | `(arg: Partial<Site>) => Promise<Site>` | Mutation trigger to create a site |
| `isMutating` | `boolean` | Whether creation is in progress |
| `createError` | `Error \| undefined` | Error from the create mutation |
| `createdData` | `Site \| undefined` | The site data returned after creation |

### Example

```tsx
const { createSite, isMutating, createError } = useCreateSite();

const handleSubmit = async (data: Partial<Site>) => {
  await createSite(data);
};
```

### Notes

On successful creation, the hook revalidates the sites list cache.

---

## `useDeleteSite`

Deletes a site by ID.

### Signature

```ts
function useDeleteSite(siteId?: number | string): {
  deleteSite: (id: string | number) => Promise<void>;
  isMutating: boolean;
  deleteError: Error | undefined;
  deletedData: unknown;
}
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `number \| string` | No | Optional site ID for the SWR mutation key |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `deleteSite` | `(id: string \| number) => Promise<void>` | Function to delete a site by ID |
| `isMutating` | `boolean` | Whether deletion is in progress |
| `deleteError` | `Error \| undefined` | Error from the delete mutation |
| `deletedData` | `unknown` | Data returned from the delete operation |

### Example

```tsx
const { deleteSite, isMutating } = useDeleteSite();

const handleDelete = async (siteId: number) => {
  await deleteSite(siteId);
};
```

### Notes

After deletion, the hook revalidates both the sites list and buildings list (since buildings may have been associated with the deleted site).

---

## Related

- [Data Model: Site](/docs/data-model/site)
- [Hooks: Buildings](/docs/hooks/buildings)
