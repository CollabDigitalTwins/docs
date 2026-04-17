---
title: useOrganization hooks
description: Hooks for fetching and updating organization data and roles.
category: hooks
status: draft
last_updated: 2025-01-14
---

# useOrganization hooks

Hooks for fetching organization details, looking up organizations by name, and retrieving organization roles. Built on SWR for caching and revalidation. These hooks are created via a factory function (`createOrganizationHooks`) that accepts an API adapter, then re-exported as standalone hooks via the core hooks provider.

## Hooks

| Hook | Description |
|------|-------------|
| `useOrganization` | Fetches a single organization by ID and provides an update mutation. |
| `useOrganizationByName` | Fetches a single organization by its name. |
| `useOrganizationRoles` | Fetches all roles associated with an organization. |

---

## `useOrganization`

Fetches organization data by ID. Also exposes a mutation function to update the organization, with automatic cache invalidation on success.

### Signature

```ts
function useOrganization(id: string | null): UseOrganizationReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `string \| null` | Yes | Organization ID. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `organization` | `Organization \| null` | The fetched organization, or `null` if not loaded. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |
| `updateOrganization` | `(arg: Partial<Organization>) => Promise<Organization>` | Mutation trigger to update the organization. |
| `isMutating` | `boolean` | Whether an update mutation is in progress. |
| `updateError` | `Error \| undefined` | Error from the most recent update attempt. |
| `updatedData` | `Organization \| undefined` | Data returned from the most recent successful update. |

### Example

```tsx
const { organization, isLoading, updateOrganization, isMutating } = useOrganization(orgId);

if (isLoading) return <Skeleton />;

const handleRename = async () => {
  await updateOrganization({ name: "New Name" });
};
```

### Notes

<!-- TODO: Caching behaviour, revalidation triggers, or non-obvious SWR config. -->

On successful update, the hook invalidates both the `["organization", id]` cache key and, if the name changed, the `["organizationByName", name]` key.

---

## `useOrganizationByName`

Fetches organization data by name. Read-only — no mutation capability.

### Signature

```ts
function useOrganizationByName(name: string | null): UseOrganizationByNameReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `name` | `string \| null` | Yes | Organization name. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `organization` | `Organization \| null` | The fetched organization, or `null` if not loaded. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |

### Example

```tsx
const { organization, isLoading } = useOrganizationByName("acme-corp");

if (isLoading) return <Spinner />;
if (!organization) return <NotFound />;
```

---

## `useOrganizationRoles`

Fetches all roles defined for an organization.

### Signature

```ts
function useOrganizationRoles(orgId: string | null): UseOrganizationRolesReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `orgId` | `string \| null` | Yes | Organization ID. Pass `null` to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `organizationRoles` | `Role[]` | Array of roles for the organization. Empty array if not loaded. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |

### Example

```tsx
const { organizationRoles, isLoading } = useOrganizationRoles(orgId);

if (isLoading) return <Skeleton />;

return (
  <ul>
    {organizationRoles.map((role) => (
      <li key={role.id}>{role.name}</li>
    ))}
  </ul>
);
```

---

## Related

- [API: Organizations](/docs/api/organizations)
- [Data Model: Organization](/docs/data-model/organization)
- [Data Model: Role](/docs/data-model/role)
- [Hooks Provider](/docs/hooks/provider)