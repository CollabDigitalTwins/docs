---
title: User hooks
description: Hooks for fetching, creating, updating, and deleting users, plus role and password management.
category: hooks
status: draft
last_updated: 2025-01-14
---

# User hooks

These hooks manage user data throughout the application, including user CRUD operations, role assignments, and password verification/changes. Built on SWR for data fetching with automatic caching and revalidation, and useSWRMutation for mutations. Password-related hooks use React state directly rather than SWR.

## Hooks

| Hook | Description |
|------|-------------|
| `useUsers` | Fetches all users |
| `useUser` | Fetches a single user by ID, with update and delete mutations |
| `useCreateUser` | Creates a new user |
| `useUserRole` | Fetches and updates a user's role |
| `useVerifyPassword` | Verifies a user's current password |
| `useChangePassword` | Changes a user's password |

---

## `useUsers`

Fetches all users from the API.

### Signature

```ts
function useUsers(): UseUsersReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `users` | `User[]` | Array of users, defaults to empty array |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |

### Example

```tsx
const { users, isLoading, isError } = useUsers();

if (isLoading) return <Skeleton />;
if (isError) return <ErrorMessage />;

return <UserTable users={users} />;
```


---

## `useUser`

Fetches a single user by ID. Also provides `updateUser` and `deleteUser` mutations.

### Signature

```ts
function useUser(userId: string): UseUserReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | Yes | The user's unique identifier |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `user` | `User \| null` | The fetched user, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateUser` | `(arg: Partial<User>) => Promise<User>` | Triggers user update mutation |
| `isMutating` | `boolean` | True while update is in progress |
| `updateError` | `Error \| undefined` | Error from update mutation |
| `updatedData` | `User \| undefined` | Response data from successful update |
| `deleteUser` | `() => Promise<void>` | Triggers user deletion |
| `isDeleting` | `boolean` | True while delete is in progress |
| `deleteError` | `Error \| undefined` | Error from delete mutation |

### Example

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

### Notes

On successful update, revalidates both the individual user cache and the users list. On delete, clears the individual user cache without revalidation and revalidates the users list.

---

## `useCreateUser`

Creates a new user.

### Signature

```ts
function useCreateUser(): UseCreateUserReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `createUser` | `(arg: { userData: Partial<User> }) => Promise<User>` | Triggers user creation |
| `isMutating` | `boolean` | True while creation is in progress |
| `createError` | `Error \| undefined` | Error from create mutation |
| `createdData` | `User \| undefined` | The newly created user |

### Example

```tsx
const { createUser, isMutating, createError } = useCreateUser();

const handleSubmit = async (formData: Partial<User>) => {
  const newUser = await createUser({ userData: formData });
  router.push(`/users/${newUser.id}`);
};
```

### Notes

On success, revalidates the users list cache.

---

## `useUserRole`

Fetches a user's role and provides a mutation to update it.

### Signature

```ts
function useUserRole(userId: string): UseUserRoleReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | Yes | The user's unique identifier |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `userRole` | `Role \| null` | The user's current role, or null if not loaded |
| `isLoading` | `boolean` | SWR loading state |
| `isError` | `Error \| undefined` | SWR error state |
| `updateUserRole` | `(arg: { roleId: number }) => Promise<Role>` | Triggers role update |
| `isMutating` | `boolean` | True while update is in progress |
| `updatedData` | `Role \| undefined` | Response data from successful update |
| `updateError` | `Error \| undefined` | Error from update mutation |

### Example

```tsx
const { userRole, updateUserRole, isMutating } = useUserRole(userId);

const handleRoleChange = async (roleId: number) => {
  await updateUserRole({ roleId });
};
```

### Notes

On success, revalidates the user role cache, individual user cache, and users list.

---

## `useVerifyPassword`

Verifies a user's current password. Uses React state instead of SWR.

### Signature

```ts
function useVerifyPassword(userId: string): UseVerifyPasswordReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | Yes | The user's unique identifier |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `verifyPassword` | `(password: string) => Promise<boolean>` | Verifies the password, returns true if valid |
| `isLoading` | `boolean` | True while verification is in progress |
| `error` | `Error \| null` | Error from verification attempt |
| `isValid` | `boolean \| null` | Result of last verification, null if not yet verified |

### Example

```tsx
const { verifyPassword, isLoading, isValid } = useVerifyPassword(userId);

const handleVerify = async () => {
  const valid = await verifyPassword(currentPassword);
  if (valid) {
    setStep("newPassword");
  }
};
```

---

## `useChangePassword`

Changes a user's password. Uses React state instead of SWR.

### Signature

```ts
function useChangePassword(userId: string): UseChangePasswordReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `string` | Yes | The user's unique identifier |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `changePassword` | `(oldPassword: string, newPassword: string) => Promise<void>` | Changes the user's password |
| `isLoading` | `boolean` | True while change is in progress |
| `error` | `Error \| null` | Error from change attempt |
| `success` | `boolean` | True if password was changed successfully |

### Example

```tsx
const { changePassword, isLoading, error, success } = useChangePassword(userId);

const handleSubmit = async () => {
  await changePassword(oldPassword, newPassword);
};

if (success) {
  return <SuccessMessage>Password updated</SuccessMessage>;
}
```

---

## Related

- [Data model: User](/docs/data-model/user)
- [Data model: Role](/docs/data-model/role)
- [Hook provider](/docs/hooks/provider)
