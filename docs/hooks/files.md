---
title: useFile hooks
description: SWR hooks for fetching, uploading, updating, and deleting file attachments.
---

# useFile hooks

Hooks for file attachments on buildings, sites, and users.

See [Shared conventions](./overview.md#shared-conventions) for the loading, error, and mutation fields every hook returns.

| Hook | Description |
|------|-------------|
| `useFiles` | Fetches all files |
| `useFile` | Fetches a single file by ID, with update mutation |
| `useUpdateFile` | The update mutation on its own |
| `useFilesByBuildingId` | Fetches files attached to a building, optionally filtered by tag |
| `useFilesBySiteId` | Fetches files attached to a site, optionally filtered by tag |
| `useUploadFileToBuilding` | Uploads a file and attaches it to a building |
| `useUploadFileToSite` | Uploads a file and attaches it to a site |
| `useUploadFileToUser` | Uploads a file and attaches it to a user |
| `useDeleteFile` | Deletes a file and revalidates related caches |
| `useDownloadFile` | Client-side download with blob handling and fallback |

## `useFiles()`

Fetches all files as `files: DbFile[]`.

```tsx
const { files, isLoading } = useFiles();

if (isLoading) return <Skeleton />;
return <FileList files={files} />;
```

## `useFile(id)`

Fetches a single file by `id` (`number | null`), and provides an update mutation.

| Field | Type | Description |
|-------|------|-------------|
| `file` | `DbFile \| null` | The fetched file, or null if not loaded |
| `updateFile` | `(arg: Partial<DbFile>) => Promise<DbFile>` | Mutation trigger |

```tsx
const { file, updateFile, isMutating } = useFile(fileId);

const handleRename = async (newName: string) => {
  await updateFile({ name: newName });
};
```

A successful update revalidates the file cache, the files list, and any associated building or site file list, based on the file's `attachedFilesBuildingId` or `attachedFilesSiteId`.

`useUpdateFile()` is also exported standalone, for updating a file you have not fetched with `useFile`.

## `useFilesByBuildingId(buildingId, tag?)` and `useFilesBySiteId(siteId, tag?)`

Fetch the files attached to a building or a site as `files: DbFile[]`. The optional `tag` (`string`) filters the result.

```tsx
const { files, isLoading } = useFilesByBuildingId(building.id, "floorplan");
const { files: siteFiles } = useFilesBySiteId(site.id);
```

## Upload hooks

`useUploadFileToBuilding(buildingId)`, `useUploadFileToSite(siteId)`, and `useUploadFileToUser(userId)` share one shape. Each takes the parent's numeric ID and returns:

| Field | Type | Description |
|-------|------|-------------|
| `uploadFile` | `(arg: { fileData: Partial<DbFile> }) => Promise<DbFile>` | Upload trigger |
| `uploadError` | `Error \| undefined` | Error from the upload |
| `uploadedData` | `DbFile \| undefined` | The uploaded file |

```tsx
const { uploadFile, isMutating } = useUploadFileToBuilding(building.id);

const handleUpload = async (fileData: Partial<DbFile>) => {
  await uploadFile({ fileData });
};
```

They differ only in which caches they revalidate on success:

| Hook | Revalidates |
|------|-------------|
| `useUploadFileToBuilding` | `filesByBuilding`, `files`, parent `building` |
| `useUploadFileToSite` | `filesBySite`, `files`, parent `site` |
| `useUploadFileToUser` | `files`, parent `user` |

## `useDeleteFile(buildingId?, siteId?)`

Deletes a file. Both parameters are optional `number`s used only to pick which caches to revalidate.

Returns `deleteFile: (fileId: number) => Promise<void>`, plus `deletedData: unknown`.

```tsx
const { deleteFile, isMutating } = useDeleteFile(building.id);

const handleDelete = async (fileId: number) => {
  await deleteFile(fileId);
};
```

Revalidates `files` and the specific `file` key, plus `filesByBuilding`/`building` or `filesBySite`/`site` when the matching ID was supplied.

## `useDownloadFile()`

Downloads a file client-side, handling presigned URLs and blobs.

| Field | Type | Description |
|-------|------|-------------|
| `downloadFile` | `(file: DbFile, fileName?: string) => Promise<void>` | Download trigger |
| `isDownloading` | `boolean` | Whether a download is in progress |
| `downloadError` | `Error \| null` | Error from the download attempt |

```tsx
const { downloadFile, isDownloading } = useDownloadFile();

<Button onClick={() => downloadFile(file)} disabled={isDownloading}>
  Download
</Button>
```

It attempts a blob download via fetch for presigned URLs and falls back to `window.open` if CORS or fetch fails. The filename resolves from `file.name`, `file.originalFile.name`, or `file.metadata.name`.

## Related

- [Data model: DbFile](/docs/architecture/data-model#dbfile)
- [Guides: File Management](/docs/guides/file-management)
