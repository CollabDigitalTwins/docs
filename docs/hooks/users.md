---
title: useUser hooks
description: Hooks for fetching, creating, updating, and deleting users, plus role and password management.
---

# useUser hooks

Hooks for user records, role assignment, and password management. The two password hooks use React state rather than SWR, so they return `error: Error | null` instead of `isError`.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields the other hooks return.

| Hook | Description |
|------|-------------|
| `useUsers` | Fetches all users |
| `useUser` | Fetches a single user by ID, with update and delete mutations |
| `useCreateUser` | Creates a new user |
| `useUserRole` | Fetches and updates a user's role |
| `useVerifyPassword` | Verifies a user's current password |
| `useChangePassword` | Changes a user's password |

## `useUsers()`

Fetches all users as `users: User[]`.

```tsx
const { users, isLoading, isError } = useUsers();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <UserTable users={users} />;
```

## `useUser(userId)`

Fetches a single user by `userId` (`string`), with update and delete mutations.

| Field | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | The fetched user, or null if not loaded |
| `updateUser` | `(arg: Partial<User>) => Promise<User>` | Update trigger |
| `deleteUser` | `() => Promise<void>` | Delete trigger |
| `isDeleting` | `boolean` | Whether a delete is in progress |
| `deleteError` | `Error \| undefined` | Error from the delete mutation |

```tsx
const { user, isLoading, updateUser, deleteUser } = useUser(userId);

const handleSave = async (changes: Partial<User>) => {
  await updateUser(changes);
};

const handleDelete = async () => {
  await deleteUser();
  router.push("/users");
};
```

A successful update revalidates both the individual user cache and the users list. A delete clears the individual cache without revalidating it, then revalidates the list.

## `useCreateUser()`

Creates a user. Returns `createUser: (arg: { userData: Partial<User> }) => Promise<User>`, and revalidates the users list on success.

```tsx
const { createUser, isMutating, createError } = useCreateUser();

const handleSubmit = async (formData: Partial<User>) => {
  const newUser = await createUser({ userData: formData });
  router.push(`/users/${newUser.id}`);
};
```

## `useUserRole(userId)`

Fetches a user's role (`userRole: Role | null`) and provides `updateUserRole: (arg: { roleId: number }) => Promise<Role>`.

```tsx
const { userRole, updateUserRole, isMutating } = useUserRole(userId);

const handleRoleChange = async (roleId: number) => {
  await updateUserRole({ roleId });
};
```

A successful update revalidates the user role cache, the individual user cache, and the users list.

## `useVerifyPassword(userId)`

Verifies a user's current password.

| Field | Type | Description |
|-------|------|-------------|
| `verifyPassword` | `(password: string) => Promise<boolean>` | Returns true if the password is valid |
| `isLoading` | `boolean` | Whether verification is in progress |
| `error` | `Error \| null` | Error from the verification attempt |
| `isValid` | `boolean \| null` | Result of the last verification, null if not yet verified |

```tsx
const { verifyPassword, isLoading, isValid } = useVerifyPassword(userId);

const handleVerify = async () => {
  const valid = await verifyPassword(currentPassword);
  if (valid) {
    setStep("newPassword");
  }
};
```

## `useChangePassword(userId)`

Changes a user's password.

| Field | Type | Description |
|-------|------|-------------|
| `changePassword` | `(oldPassword: string, newPassword: string) => Promise<void>` | Changes the password |
| `isLoading` | `boolean` | Whether the change is in progress |
| `error` | `Error \| null` | Error from the change attempt |
| `success` | `boolean` | True once the password has been changed |

```tsx
const { changePassword, isLoading, error, success } = useChangePassword(userId);

const handleSubmit = async () => {
  await changePassword(oldPassword, newPassword);
};

if (success) {
  return <SuccessMessage>Password updated</SuccessMessage>;
}
```

## Related

- [Data model: User](/docs/architecture/data-model#user)
- [Authorization: Managing roles](/docs/authorization/managing-roles)
