---
title: /api/users
description: User management — listing, creating, updating, deleting, and role assignment.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/users

Manages `User` records within an organization. Includes password operations and role assignment.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/users` | List all users |
| `GET` | `/api/users/[id]` | Get a single user |
| `GET` | `/api/users/[id]/role` | Get the user's role |
| `POST` | `/api/users/create` | Create a user |
| `PUT` | `/api/users/[id]` | Update a user |
| `PUT` | `/api/users/[id]/role` | Assign a role to a user |
| `DELETE` | `/api/users/[id]` | Delete a user |
| `POST` | `/api/users/[id]/verify-password` | Verify a user's current password |
| `POST` | `/api/users/[id]/change-password` | Change a user's password |

---

## GET `/api/users`

Returns all users in the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "User" }`

### Response

```json
[
  {
    "id": 1,
    "name": "Jane Doe",
    "email": "jane@example.com",
    "roleId": 2,
    "organizationId": 1
  }
]
```

Note: `password` is never returned.

---

## POST `/api/users/create`

Creates a new user in the organization.

### Request body

```json
{
  "userData": {
    "name": "Jane Doe",
    "email": "jane@example.com",
    "password": "...",
    "roleId": 2,
    "organizationId": 1
  }
}
```

Passwords are hashed server-side before storage.

---

## PUT `/api/users/[id]/role`

Assigns a different role to a user.

### Request body

```json
{ "roleId": 3 }
```

---

## POST `/api/users/[id]/verify-password`

Verifies whether the provided password matches the stored hash. Used by `AccountSettingsPanel` before allowing a password change.

### Request body

```json
{ "password": "current-password" }
```

### Response

```json
{ "valid": true }
```

---

## POST `/api/users/[id]/change-password`

Changes a user's password after verifying the old one.

### Request body

```json
{
  "oldPassword": "current-password",
  "newPassword": "new-password"
}
```

### Notes

- Passwords must be 12–65 characters. Validation is enforced client-side in `SignUp` and `ForgotPassword`, but should also be enforced server-side.
- The `password` field is never returned in any GET response.

---

## Related

- [Hooks — Users](../hooks/users.md)
- [Data Model — User / Role](../architecture/data-model.md#user)
- [Authorization](../authorization/authorization_roles_permissions.md)
- [Components — Settings](../components/settings.md)
