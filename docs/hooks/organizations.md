---
title: useOrganization hooks
description: Hooks for fetching and updating organization data and roles.
---

# useOrganization hooks

Hooks for fetching organization details, looking up organizations by name, and retrieving organization roles.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useOrganization` | Fetches a single organization by ID and provides an update mutation |
| `useOrganizationByName` | Fetches a single organization by its name |
| `useOrganizationRoles` | Fetches all roles associated with an organization |

## `useOrganization(id)`

Fetches an organization by `id` (`string | null`), and provides an update mutation.

| Field | Type | Description |
|-------|------|-------------|
| `organization` | `Organization \| null` | The fetched organization, or `null` if not loaded |
| `updateOrganization` | `(arg: Partial<Organization>) => Promise<Organization>` | Mutation trigger |

```tsx
const { organization, isLoading, updateOrganization, isMutating } = useOrganization(orgId);

if (isLoading) return <Skeleton />;

const handleRename = async () => {
  await updateOrganization({ name: "New Name" });
};
```

A successful update invalidates `["organization", id]` and, if the name changed, `["organizationByName", name]`.

## `useOrganizationByName(name)`

Fetches an organization by `name` (`string | null`), as `organization: Organization | null`. Read-only, with no mutation.

```tsx
const { organization, isLoading } = useOrganizationByName("acme-corp");

if (isLoading) return <Spinner />;
if (!organization) return <NotFound />;
```

## `useOrganizationRoles(orgId)`

Fetches all roles defined for an organization (`string | null`), as `organizationRoles: Role[]`.

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

## Related

- [Data Model: Organization](/docs/architecture/data-model#organization)
- [Hooks Provider](/docs/hooks/overview)
