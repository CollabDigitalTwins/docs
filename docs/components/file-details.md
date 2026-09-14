---
title: File Components
description: FileDetails, the detail panel for a file record, and FilePreview, the format-aware preview it renders.
---

# File Components

Two components make up the files data page's detail view: `FileDetails`, the panel shown when a file row is opened, and `FilePreview`, the format-aware preview embedded inside it. See [Data Pages](../architecture/data-pages.mdx) for how they are reached.

## FilePreview

A preview card for an uploaded file that picks its renderer from the file extension, case-insensitively. Clicking the card opens a fullscreen dialog (90vh by 95vw) with the expanded view.

```tsx
import FilePreview from '@collabdt/core/core/components/viewers/Data/files/FilePreview';
import { Dialog } from '@collabdt/core/core/components/ui';

<Dialog>
  <FilePreview 
    file={{ metadata: fileRecord }} 
    showTrigger={true}
    disableDialogFor3D={false}
  />
</Dialog>
```

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `file` | `{ metadata: DbFile }` | Yes | — | File object whose metadata carries url, extension and name |
| `showTrigger` | `boolean` | No | `true` | Whether to render the clickable preview card trigger |
| `disableDialogFor3D` | `boolean` | No | `false` | When true, 3D and BIM files render inline with no dialog |

| Format | Handling |
|--------|----------|
| MP4 | Native `<video>` element |
| JPG, JPEG, PNG, WEBP, GIF | Native `<img>` element |
| PDF, PPT/PPTX, XLS/XLSX/XLSM/XLSB/CSV, DOC/DOCX | Placeholder icon in the card, Office Online viewer in the dialog |
| GLTF, GLB, FBX, OBJ, COLLADA, IFC, FRAG | `SimpleBimViewer` |
| Anything else | A file icon and "No preview available" |

## FileDetails

The detail panel for a single file. It displays the file's metadata, embeds a `FilePreview`, and with the right permission allows editing the file's name, description, tag, position, and building attachment. Like every other detail panel it is a `forwardRef` exposing `saveChanges`, so `DataMenu`'s header Save button can drive it. See [Data Pages](../architecture/data-pages.mdx#the-panel-contract).

```tsx
import { FileDetails, type FileDetailsRef } from '@collabdt/core/core/components/viewers/Data/files/FileDetails';

const detailsRef = React.useRef<FileDetailsRef>(null);

<FileDetails
  ref={detailsRef}
  selectedFile={fileRow}
  buildings={buildings}
  editing={isEditing}
  setEditing={setIsEditing}
  setActiveChanges={setHasChanges}
/>

await detailsRef.current?.saveChanges();
```

Every prop is optional. Beyond the common `editing`, `setEditing` and `setActiveChanges` described in [Shared conventions](./overview.md#shared-conventions), it takes `selectedFile` (`FileRow`), the row to display, whose underlying database record is `selectedFile.metadata`, and `buildings` (`Building[]`), the buildings offered when reattaching the file. `saveChanges` persists through `useFile(id).updateFile`.

### Behaviour

- **Display model**: renders a `FileRow`, not a `DbFile`. Name, upload date, uploader, type, size
  and position are already formatted; `metadata` holds the original record.
- **Preview**: embeds `FilePreview`, so format handling is inherited rather than reimplemented.
- **Reattaching**: typing in the building field runs `fuzzySearchBuildings` over the `buildings`
  prop and updates the file's building attachment on save.
- **Jump to building**: following an attached building switches `currentViewer` to
  `ViewerNames.buildings` and sets the view to `detail`, navigating the user to that building's
  page without a route change.
- **Saving**: calls `updateFile`, which revalidates the relevant SWR keys so the table and any
  building's attached-files tab refresh.

Every editable control is disabled without `update` on `File`:

```tsx
<Input disabled={!ability.can('update', 'File')} />
```

## Related

- [Data Pages](../architecture/data-pages.mdx) — how the files page is assembled
- [DataMenu](./data-menu.md) — the shell that renders this panel
- [useFile](../hooks/files.md) — hook for file operations
- [DbFile](../architecture/data-model.mdx#dbfile) — file metadata type definition
