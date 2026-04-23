---
title: /api/comments
description: CRUD operations for geospatial comments across all viewers.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/comments

Manages `Comment` records — geospatial annotations that can be pinned to a map coordinate, a 3D BIM position, or a building.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/comments` | List all comments |
| `GET` | `/api/comments/[id]` | Get a single comment |
| `GET` | `/api/comments/building/[buildingId]` | List comments for a building |
| `GET` | `/api/comments/author/[authorId]` | List comments by author |
| `POST` | `/api/comments/create` | Create a comment |
| `PUT` | `/api/comments/[id]` | Update a comment |
| `DELETE` | `/api/comments/[id]` | Delete a comment |

---

## GET `/api/comments`

Returns all comments for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "Comment" }`

### Response

```json
[
  {
    "id": 1,
    "text": "Check this structural issue",
    "viewer": "bim",
    "visible": true,
    "authorId": 3,
    "organizationId": 1,
    "buildingId": 5,
    "x": 12.3,
    "y": 0.5,
    "z": 4.1,
    "createdAt": "2025-03-01T09:00:00Z"
  }
]
```

---

## POST `/api/comments/create`

Creates a new comment. Position fields depend on the viewer context.

### Request body

For a map comment:
```json
{
  "commentData": {
    "text": "Flooding reported here",
    "viewer": "map",
    "visible": true,
    "longitude": -75.690,
    "latitude": 45.421,
    "organizationId": 1
  }
}
```

For a BIM comment (3D position):
```json
{
  "commentData": {
    "text": "Crack in column",
    "viewer": "bim",
    "visible": true,
    "x": 12.3, "y": 0.5, "z": 4.1,
    "buildingId": 5,
    "organizationId": 1
  }
}
```

---

## PUT `/api/comments/[id]`

Partial update. Changing `buildingId` or `authorId` revalidates all affected SWR cache keys.

---

## DELETE `/api/comments/[id]`

Deletes the comment. Replies (`replyToId` references) are not automatically deleted.

### Notes

<!-- TODO: Confirm cascade behaviour when a parent comment is deleted — are replies also deleted, or do they become orphaned? -->

---

## Related

- [Hooks — Comments](../hooks/comments.md)
- [Data Model — Comment](../architecture/data-model.md#comment)
- [Guides — Collaboration](../guides/collaboration.md)
