---
title: UserDetails
description: Displays and edits user account information including name, email, role, avatar, and timestamps.
category: components
status: draft
last_updated: 2025-01-13
---

# UserDetails

Displays detailed user information in a read-only or editable form. Used in admin panels to view existing users or create new ones. Supports avatar upload, role selection, and password entry for new users.

## Usage

```tsx
import UserDetails, { UserDetailsRef } from '@/core/components/viewers/Data/userDetails/UserDetails';

const detailsRef = useRef<UserDetailsRef>(null);

<UserDetails
  ref={detailsRef}
  selectedUser={user}
  setSelectedUser={setUser}
  editing={isEditing}
  setEditing={setIsEditing}
  setActiveChanges={setHasChanges}
  onCreated={() => refetchUsers()}
/>

// Save programmatically
await detailsRef.current?.saveChanges();
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selectedUser` | `Partial<User>` | No | — | The user to display or edit. A negative `id` indicates a new user. |
| `setSelectedUser` | `(user: User) => void` | No | — | Callback to update the selected user in parent state. |
| `editing` | `boolean` | No | `false` | Enables edit mode for fields. |
| `setEditing` | `(editing: boolean) => void` | No | — | Callback to toggle edit mode externally. |
| `setActiveChanges` | `(hasChanges: boolean) => void` | No | — | Notifies parent when unsaved changes exist. |
| `users` | `User[]` | No | — | <!-- description --> |
| `hideTitle` | `boolean` | No | — | Hides the "User Details" heading when true. |
| `onDelete` | `() => void` | No | — | <!-- description --> |
| `onCreated` | `() => void` | No | — | Called after a new user is successfully created. |

## Ref Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `saveChanges` | `() => Promise<void>` | Validates and persists edits. Creates the user if `id < 0`, otherwise patches the existing user. |

## Behaviour

- **New user mode**: When `selectedUser.id` is negative, the component renders a creation form with name, email, role, and password fields.
- **Password validation**: Requires 12–65 characters with uppercase, lowercase, digit, and special character. Inline feedback shows strength.
- **Role selection**: Populated from `useOrganizationRoles` based on the current session's organization.
- **Avatar upload**: In edit mode, clicking the avatar opens a file picker. The image uploads to MinIO via a presigned URL and associates with the user.
- **Loading states**: The submit button shows a spinner while the request is in flight.
- **Error states**: Validation errors and API failures surface via `toast.error`.


## Permissions

```tsx
{ability.can("update", "Role") && <UserDetails editing={true} ... />}
```

Role updates and avatar changes require the `update` action on the `Role` subject.

## Related

- [AddUser](/docs/components/AddUser) — modal wrapper for quick user creation
- [UserMoreOptions](/docs/components/UserMoreOptions) — bulk import/export actions
- [useCreateUser](/docs/hooks/users) — mutation hook for creating users
- [useUserRole](/docs/hooks/users) — fetches a user's current role
- [User data model](/docs/data-model/user)
