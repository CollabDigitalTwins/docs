---
title: Settings Components
description: Account, organization, and user management panels available in the Settings viewer.
category: components
status: draft
last_updated: 2026-04-23
---

# Settings Components

The settings viewer (`ViewerNames.settings`) contains three panels accessible from a sidebar. Each panel is a self-contained component in `src/core/components/settings/src/`.

Source: `src/core/components/settings/`

## Panels

| Component | Tab key | Description |
|-----------|---------|-------------|
| `AccountSettingsPanel` | `account` | View and edit the current user's profile |
| `OrganizationSettingsPanel` | `organization` | View and edit organization branding and configuration |
| `UsersSettingsPanel` | `users` | Manage organization users and roles |

---

## `AccountSettingsPanel`

Displays the current user's profile fields (name, email, etc.) with an edit mode. Also shows the user's role and supports avatar upload.

### Behaviour

- Reads `session.user.id` via NextAuth `useSession`.
- Fetches the full `User` record via `useUser(id)` and the role via `useUserRole(id)`.
- In edit mode, only changed fields are sent to `updateUser`.
- Filtered fields not shown in the UI: `id`, `imageFileId`, `image`, `password`, `emailVerified`, `createdAt`, `updatedAt`, `organizationId`, `accounts`, `organization`.
- Avatar upload uses `useUploadFileToUser`.
- Password change is handled by a nested `ChangePassword` sub-component.

### Permissions

Reads `ability` from `usePermissions()`. Editing is only available when `ability.can("update", "User")`.

---

## `OrganizationSettingsPanel`

Displays and edits the current user's organization record. Supports branding, map defaults, language configuration, and logo/favicon upload.

### Behaviour

- Fetches the organization via `useOrganization(userOrganizationId)`.
- Tracks `editingValues` as a partial `Organization` diff — only changed fields are sent to `updateOrganization`.
- Logo and favicon are uploaded to a public MinIO bucket via `uploadOrganizationLogoToPublicBucket`.
- `countrySubdivisionsData` from `MapContext` is used to populate the subdivision dropdown.

### Permissions

Requires `ability.can("update", "Organization")`. The panel renders in read-only mode for users without this permission.

---

## `UsersSettingsPanel`

Renders the `DataMenu` component scoped to `ViewerNames.users`. This reuses the standard data table/management UI rather than implementing a separate list.

```tsx
export default function UsersSettingsPanel() {
  return (
    <DataMenu currentViewer={ViewerNames.users} height="h-full" hideTitle hideFrame />
  )
}
```

### Permissions

Visibility and actions within `DataMenu` are gated by the user's CASL permissions for the `User` subject.

---

## Layout structure

```
SettingsContent
  ├── SettingsSidebar        — tab navigation (account / organization / users)
  ├── AccountSettingsPanel
  ├── OrganizationSettingsPanel
  └── UsersSettingsPanel
```

`SettingsTabKey` type: `'account' | 'users' | 'organization'`

## Key Files

| File | Role |
|------|------|
| `src/core/components/settings/src/AccountSettingsPanel.tsx` | Account panel |
| `src/core/components/settings/src/OrganizationSettingsPanel.tsx` | Organization panel |
| `src/core/components/settings/src/UsersSettingsPanel.tsx` | Users panel (wraps DataMenu) |
| `src/core/components/settings/src/SettingsSidebar.tsx` | Tab navigation |
| `src/core/components/settings/src/types.ts` | `SettingsTabKey` type |
| `src/core/components/settings/src/ChangePassword.tsx` | Password change sub-component |

## Permissions

| Panel | Required permission |
|-------|---------------------|
| Account | `read User` (always visible); `update User` to edit |
| Organization | `read Organization`; `update Organization` to edit |
| Users | Controlled by `DataMenu` / `read User` |

## Related

- [Hooks — Users](../hooks/users.md)
- [Hooks — Organizations](../hooks/organizations.md)
- [API — Users](../api/users.md)
- [API — Organizations](../api/organizations.md)
- [Authorization](../authorization/authorization_roles_permissions.md)
