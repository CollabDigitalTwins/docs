---
title: UserDetails
description: Displays and edits user account information including name, email, role, avatar, and timestamps.
---

# UserDetails

The detail panel for a user account, used in admin panels to view existing users or create new ones. It follows the [detail panel contract](./overview.md#shared-conventions) but has no tabs: every prop is optional, and `saveChanges` creates the user when `id < 0` and patches the existing record otherwise.

```tsx
import UserDetails, { UserDetailsRef } from '@collabdt/core/core/components/viewers/Data/userDetails/UserDetails';

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

await detailsRef.current?.saveChanges();
```

| Prop | Type | Description |
|------|------|-------------|
| `selectedUser` | `Partial<User>` | The user to display or edit. A negative `id` indicates a new user. |
| `setSelectedUser` | `(user: User) => void` | Updates the selected user in parent state. |
| `users` | `User[]` | Undocumented. |
| `hideTitle` | `boolean` | Hides the "User Details" heading when true. |
| `onDelete` | `() => void` | Undocumented. |
| `onCreated` | `() => void` | Called after a new user is successfully created. |

## Behaviour

When `selectedUser.id` is negative the component renders a creation form with name, email, role and password fields. Passwords must be 12 to 65 characters with an uppercase letter, a lowercase letter, a digit and a special character; inline feedback shows strength as the user types. Roles come from `useOrganizationRoles` for the current session's organization.

In edit mode, clicking the avatar opens a file picker; the image uploads to MinIO through a presigned URL and is associated with the user. The submit button shows a spinner while a request is in flight, and validation errors and API failures surface through `toast.error`.

`AddUser` is a modal wrapper around this panel for quick user creation, and `UserMoreOptions` provides bulk import and export actions.

Role updates and avatar changes require `update` on the `Role` subject; see [Shared conventions](./overview.md#shared-conventions).

## Related

- [Settings Components](./settings.md) — `UsersSettingsPanel`, where this panel is reached
- [useCreateUser / useUserRole](../hooks/users.md)
- [User data model](../architecture/data-model.mdx#user)
