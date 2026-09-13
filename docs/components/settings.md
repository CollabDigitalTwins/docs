---
title: Settings Components
description: Account, organization, and user management panels available in the Settings viewer.
---

import BrowserOnly from '@docusaurus/BrowserOnly';

# Settings Components

The settings viewer (`ViewerNames.settings`) holds three panels reached from a sidebar. Each is a self-contained component in `@collabdt/core/components/settings/src/`.

| Component | Tab key | Description |
|-----------|---------|-------------|
| `AccountSettingsPanel` | `account` | View and edit the current user's profile |
| `OrganizationSettingsPanel` | `organization` | View and edit organization branding and configuration |
| `UsersSettingsPanel` | `users` | Manage organization users and roles |

`SettingsTabKey` is `'account' | 'users' | 'organization'`.

## `AccountSettingsPanel`

Shows the current user's profile fields with an edit mode, along with their role, and supports avatar upload.

It reads `session.user.id` from the NextAuth `useSession`, then fetches the full `User` record with `useUser(id)` and the role with `useUserRole(id)`. In edit mode only changed fields are sent to `updateUser`. Avatar upload goes through `useUploadFileToUser`, and password changes are handled by a nested `ChangePassword` sub-component.

These fields are filtered out of the UI: `id`, `imageFileId`, `image`, `password`, `emailVerified`, `createdAt`, `updatedAt`, `organizationId`, `accounts`, `organization`.

## `OrganizationSettingsPanel`

Displays and edits the current user's organization record, covering branding, map defaults, language configuration, and logo and favicon upload.

It fetches the organization with `useOrganization(userOrganizationId)` and tracks `editingValues` as a partial `Organization` diff, so only changed fields reach `updateOrganization`. Logo and favicon are uploaded to a public MinIO bucket through `uploadOrganizationLogoToPublicBucket`. The subdivision dropdown is populated from `countrySubdivisionsData` on `MapContext`.

Without `update` on `Organization` the panel renders read-only.

## `UsersSettingsPanel`

Renders `DataMenu` scoped to `ViewerNames.users`, reusing the standard data table and management UI instead of a separate list:

```tsx
export default function UsersSettingsPanel() {
  return (
    <DataMenu currentViewer={ViewerNames.users} height="h-full" hideFrame hideTitle />
  )
}
```

## Layout structure

<BrowserOnly>
  {() => {
    const HierarchyTree = require('@site/src/components/HierarchyTree').default;
    return (
      <HierarchyTree
        data={{
          label: 'SettingsContent',
          children: [
            { label: 'SettingsSidebar' },
            { label: 'AccountSettingsPanel' },
            { label: 'OrganizationSettingsPanel' },
            { label: 'UsersSettingsPanel' },
          ],
        }}
      />
    );
  }}
</BrowserOnly>

## Permissions

Each panel reads `ability` from `usePermissions()`; see [Shared conventions](./overview.md#shared-conventions).

| Panel | Required permission |
|-------|---------------------|
| Account | `read User` (always visible); `update User` to edit |
| Organization | `read Organization`; `update Organization` to edit |
| Users | Controlled by `DataMenu` / `read User`, gated on the `User` subject |

## Key files

| File | Role |
|------|------|
| `@collabdt/core/components/settings/src/AccountSettingsPanel.tsx` | Account panel |
| `@collabdt/core/components/settings/src/OrganizationSettingsPanel.tsx` | Organization panel |
| `@collabdt/core/components/settings/src/UsersSettingsPanel.tsx` | Users panel (wraps DataMenu) |
| `@collabdt/core/components/settings/src/SettingsSidebar.tsx` | Tab navigation |
| `@collabdt/core/components/settings/src/types.ts` | `SettingsTabKey` type |
| `@collabdt/core/components/settings/src/ChangePassword.tsx` | Password change sub-component |

## Related

- [Hooks — Users](../hooks/users.md)
- [Hooks — Organizations](../hooks/organizations.md)
- [Authorization](../authorization/authorization_roles_permissions.md)
