---
title: File hooks
description: SWR hooks for fetching, uploading, updating, and deleting file attachments.
category: hooks
status: draft
last_updated: 2025-01-13
---

# File hooks

These hooks manage file attachments for buildings, sites, and users. Files are fetched via SWR with array-based cache keys, and mutations trigger revalidation of related caches (parent entity, file lists). The hooks are created via a factory pattern (`createFileHooks`) that accepts an `ApiAdapter`, with convenience wrappers exported for direct import.

## Hooks

| Hook | Description |
|------|-------------|
| `useFiles` | Fetches all files. |
| `useFile` | Fetches a single file by ID, with update mutation. |
| `useFilesByBuildingId` | Fetches files attached to a building, optionally filtered by tag. |
| `useFilesBySiteId` | Fetches files attached to a site, optionally filtered by tag. |
| `useUploadFileToBuilding` | Uploads a file and attaches it to a building. |
| `useUploadFileToSite` | Uploads a file and attaches it to a site. |
| `useUploadFileToUser` | Uploads a file and attaches it to a user. |
| `useDeleteFile` | Deletes a file and revalidates related caches. |
| `useDownloadFile` | Client-side file download with blob handling and fallback. |

---

## `useFiles`

Fetches all files from the API.

### Signature

```ts
function useFiles(): { files: DbFile[]; isLoading: boolean; isError: Error | undefined }
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `files` | `DbFile[]` | Array of files, defaults to empty array. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |

### Example

```tsx
const { files, isLoading } = useFiles();

if (isLoading) return <Skeleton />;
return <FileList files={files} />;
```

---

## `useFile`

Fetches a single file by ID and provides an update mutation.

### Signature

```ts
function useFile(id: number | null): UseFileReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `id` | `number \| null` | Yes | File ID, or null to skip fetching. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `file` | `DbFile \| null` | The fetched file, or null if not found/loading. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |
| `updateFile` | `(arg: Partial<DbFile>) => Promise<DbFile>` | Trigger function to update the file. |
| `isMutating` | `boolean` | Whether an update is in progress. |
| `updateError` | `Error \| undefined` | Error from the update mutation. |
| `updatedData` | `DbFile \| undefined` | The updated file data after mutation. |

### Example

```tsx
const { file, updateFile, isMutating } = useFile(fileId);

const handleRename = async (newName: string) => {
  await updateFile({ name: newName });
};
```

### Notes

On successful update, revalidates the file cache, files list, and any associated building/site file lists based on the file's `attachedFilesBuildingId` or `attachedFilesSiteId`.

---

## `useFilesByBuildingId`

Fetches files attached to a specific building.

### Signature

```ts
function useFilesByBuildingId(buildingId: number, tag?: string): UseFilesReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number` | Yes | The building ID to fetch files for. |
| `tag` | `string` | No | Optional tag to filter files. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `files` | `DbFile[]` | Array of files attached to the building. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |

### Example

```tsx
const { files, isLoading } = useFilesByBuildingId(building.id, "floorplan");
```

---

## `useFilesBySiteId`

Fetches files attached to a specific site.

### Signature

```ts
function useFilesBySiteId(siteId: number, tag?: string): UseFilesReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `number` | Yes | The site ID to fetch files for. |
| `tag` | `string` | No | Optional tag to filter files. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `files` | `DbFile[]` | Array of files attached to the site. |
| `isLoading` | `boolean` | SWR loading state. |
| `isError` | `Error \| undefined` | SWR error state. |

### Example

```tsx
const { files } = useFilesBySiteId(site.id);
```

---

## `useUploadFileToBuilding`

Uploads a file and attaches it to a building.

### Signature

```ts
function useUploadFileToBuilding(buildingId: number): UseUploadReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number` | Yes | The building ID to attach the file to. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `uploadFile` | `(arg: { fileData: Partial<DbFile> }) => Promise<DbFile>` | Trigger function to upload. |
| `isMutating` | `boolean` | Whether upload is in progress. |
| `uploadError` | `Error \| undefined` | Error from the upload mutation. |
| `uploadedData` | `DbFile \| undefined` | The uploaded file data. |

### Example

```tsx
const { uploadFile, isMutating } = useUploadFileToBuilding(building.id);

const handleUpload = async (fileData: Partial<DbFile>) => {
  await uploadFile({ fileData });
};
```

### Notes

On success, revalidates `filesByBuilding`, `files`, and the parent `building` cache keys.

---

## `useUploadFileToSite`

Uploads a file and attaches it to a site.

### Signature

```ts
function useUploadFileToSite(siteId: number): UseUploadReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `siteId` | `number` | Yes | The site ID to attach the file to. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `uploadFile` | `(arg: { fileData: Partial<DbFile> }) => Promise<DbFile>` | Trigger function to upload. |
| `isMutating` | `boolean` | Whether upload is in progress. |
| `uploadError` | `Error \| undefined` | Error from the upload mutation. |
| `uploadedData` | `DbFile \| undefined` | The uploaded file data. |

### Example

```tsx
const { uploadFile } = useUploadFileToSite(site.id);
await uploadFile({ fileData: { name: "site-plan.pdf", ...metadata } });
```

### Notes

On success, revalidates `filesBySite`, `files`, and the parent `site` cache keys.

---

## `useUploadFileToUser`

Uploads a file and attaches it to a user.

### Signature

```ts
function useUploadFileToUser(userId: number): UseUploadReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `userId` | `number` | Yes | The user ID to attach the file to. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `uploadFile` | `(arg: { fileData: Partial<DbFile> }) => Promise<DbFile>` | Trigger function to upload. |
| `isMutating` | `boolean` | Whether upload is in progress. |
| `uploadError` | `Error \| undefined` | Error from the upload mutation. |
| `uploadedData` | `DbFile \| undefined` | The uploaded file data. |

### Example

```tsx
const { uploadFile } = useUploadFileToUser(user.id);
await uploadFile({ fileData: { name: "avatar.png" } });
```

### Notes

On success, revalidates `files` and the parent `user` cache keys.

---

## `useDeleteFile`

Deletes a file and revalidates related caches.

### Signature

```ts
function useDeleteFile(buildingId?: number, siteId?: number): UseDeleteReturn
```

### Parameters

| Param | Type | Required | Description |
|-------|------|----------|-------------|
| `buildingId` | `number` | No | Building ID for cache revalidation. |
| `siteId` | `number` | No | Site ID for cache revalidation. |

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `deleteFile` | `(fileId: number) => Promise<void>` | Function to delete a file by ID. |
| `isMutating` | `boolean` | Whether deletion is in progress. |
| `deleteError` | `Error \| undefined` | Error from the delete mutation. |
| `deletedData` | `unknown` | Response data from deletion. |

### Example

```tsx
const { deleteFile, isMutating } = useDeleteFile(building.id);

const handleDelete = async (fileId: number) => {
  await deleteFile(fileId);
};
```

### Notes

Revalidates `files`, the specific `file` key, and conditionally `filesByBuilding`/`building` or `filesBySite`/`site` based on provided IDs.

---

## `useDownloadFile`

Client-side hook for downloading files. Handles presigned URLs, blob downloads, and fallback to direct links.

### Signature

```ts
function useDownloadFile(): UseDownloadReturn
```

### Parameters

None.

### Returns

| Field | Type | Description |
|-------|------|-------------|
| `downloadFile` | `(file: any, fileName?: string) => Promise<void>` | Function to trigger download. |
| `isDownloading` | `boolean` | Whether download is in progress. |
| `downloadError` | `Error \| null` | Error from the download attempt. |

### Example

```tsx
const { downloadFile, isDownloading } = useDownloadFile();

<Button onClick={() => downloadFile(file)} disabled={isDownloading}>
  Download
</Button>
```

### Notes

Attempts blob download via fetch for presigned URLs, with automatic fallback to `window.open` if CORS or fetch fails. Resolves filename from `file.name`, `file.originalFile.name`, or `file.metadata.name`.

---

## Related

- [Data model: DbFile](/docs/data-model/file)
- [Hooks: useBuildings](/docs/hooks/buildings)
- [Hooks: useSites](/docs/hooks/sites)
