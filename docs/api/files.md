---
title: /api/files
description: File upload, retrieval, update, and deletion — including building, site, and user attachments.
category: api
status: draft
last_updated: 2026-04-23
---

# /api/files

Manages `DbFile` records and their MinIO object references. Files can be attached to buildings, sites, or users.

## Endpoints

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/api/files` | List all files |
| `GET` | `/api/files/[id]` | Get a single file |
| `GET` | `/api/files/building/[buildingId]` | List files attached to a building |
| `GET` | `/api/files/site/[siteId]` | List files attached to a site |
| `PUT` | `/api/files/[id]` | Update file metadata |
| `POST` | `/api/files/building/[buildingId]/upload` | Upload a file to a building |
| `POST` | `/api/files/site/[siteId]/upload` | Upload a file to a site |
| `POST` | `/api/files/user/[userId]/upload` | Upload a file to a user (avatar, etc.) |
| `DELETE` | `/api/files/[id]` | Delete a file |

---

## GET `/api/files`

Returns all files for the authenticated user's organization.

### Authentication

Requires permission: `{ action: "read", subject: "File" }`

### Response

```json
[
  {
    "id": 1,
    "name": "floor-plan.ifc",
    "type": "ifc",
    "assetId": "org-name/buildings/1/floor-plan.ifc",
    "mimeType": "application/ifc",
    "sizeBytes": 2048000,
    "uploadedAt": "2025-01-15T10:00:00Z",
    "fileOrganizationId": 1
  }
]
```

---

## GET `/api/files/building/[buildingId]`

Returns files attached to a specific building. Optionally filtered by `tag` query parameter.

### Query Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `tag` | `string` | No | Filter files by tag (e.g. `"ifc"`, `"point-cloud"`) |

---

## PUT `/api/files/[id]`

Updates file metadata (name, description, tag, position, visibility). Does not replace the MinIO object.

### Request body

```json
{
  "name": "updated-name.ifc",
  "description": "Revised floor plan",
  "isVisible": true
}
```

---

## POST `/api/files/building/[buildingId]/upload`

Uploads a file and attaches it to a building. The MinIO upload is handled client-side via a presigned URL; this route creates the `DbFile` metadata record.

### Request body

```json
{
  "fileData": {
    "name": "floor-plan.ifc",
    "assetId": "org/buildings/1/floor-plan.ifc",
    "type": "ifc",
    "mimeType": "application/ifc",
    "sizeBytes": 2048000
  }
}
```

---

## DELETE `/api/files/[id]`

Deletes the `DbFile` record. MinIO object deletion is handled separately.

### Notes

<!-- TODO: Confirm whether the MinIO object is deleted server-side when the record is deleted, or whether that is handled by a separate cleanup job. -->

---

## Related

- [Hooks — Files](../hooks/files.md)
- [Data Model — DbFile](../architecture/data-model.md#dbfile)
- [Components — File Details](../components/file-details.md)
- [Deployment — MinIO](../deployment/minio.md)
