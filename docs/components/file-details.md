---
title: File Components
description: FileDetails, the detail panel for a file record, and FilePreview, the format-aware preview it renders.
category: components
status: draft
last_updated: 2026-09-13
---

# File Components

Two components make up the files data page's detail view: **`FileDetails`**, the panel shown when
a file row is opened, and **`FilePreview`**, the format-aware preview embedded inside it.

See [Data Pages](/docs/architecture/data-pages) for how they are reached.

---

## FilePreview

Displays a preview card for uploaded files, automatically selecting the appropriate renderer based on file extension. Supports images, videos, PDFs, Office documents, 3D models (GLTF/GLB/FBX/OBJ), and BIM files (IFC/FRAG). Clicking the preview opens a fullscreen dialog with an expanded view.

### Usage

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

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `file` | `{ metadata: DbFile }` | Yes | — | File object containing metadata with url, extension, and name |
| `showTrigger` | `boolean` | No | `true` | Whether to render the clickable preview card trigger |
| `disableDialogFor3D` | `boolean` | No | `false` | When true, 3D/BIM files render inline without dialog functionality |

### Behaviour

- **Format detection**: Determines preview type from `file.metadata.extension` (case-insensitive)
- **Supported formats**:
  - Video: MP4 (native `<video>` element)
  - Images: JPG, JPEG, PNG, WEBP, GIF (native `<img>` element)
  - Documents: PDF, PPT/PPTX, XLS/XLSX/XLSM/XLSB/CSV, DOC/DOCX (placeholder icons in card, Office Online viewer in dialog)
  - 3D: GLTF, GLB, FBX, OBJ, COLLADA, IFC, FRAG (SimpleBimViewer component)
- **Dialog behavior**: Clicking the card opens a fullscreen dialog (90vh × 95vw) with the appropriate viewer
- **3D exception**: When `disableDialogFor3D` is true, 3D/BIM files render directly in the card without dialog interaction
- **Fallback**: Unknown file types display a generic "No preview available" message with a file icon


---

## FileDetails

The detail panel for a single file, shown when a row is opened in the files data page. Displays
the file's metadata, embeds a `FilePreview`, and — with the right permission — allows editing the
file's name, description, tag, position, and building attachment.

Like every other detail panel, it is a `forwardRef` exposing `saveChanges`, so `DataMenu`'s header
Save button can drive it. See [Data Pages](/docs/architecture/data-pages#the-panel-contract).

### Usage

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

### Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `selectedFile` | `FileRow` | No | — | The file row to display. The underlying database record is `selectedFile.metadata`. |
| `buildings` | `Building[]` | No | — | Buildings offered when reattaching the file; searched with `fuzzySearchBuildings`. |
| `editing` | `boolean` | No | `false` | Whether the panel is in edit mode. |
| `setEditing` | `(editing: boolean) => void` | No | — | Callback to toggle edit mode. |
| `setActiveChanges` | `(active: boolean) => void` | No | — | Callback signalling unsaved changes exist. |

### Ref Methods

| Method | Signature | Description |
|--------|-----------|-------------|
| `saveChanges` | `() => Promise<void>` | Persists edits through `useFile(id).updateFile`. |

### Behaviour

- **Display model**: renders a `FileRow`, not a `DbFile`. Name, upload date, uploader, type, size
  and position are already formatted; `metadata` holds the original record.
- **Preview**: embeds `FilePreview`, so format handling is inherited rather than reimplemented.
- **Reattaching**: typing in the building field runs `fuzzySearchBuildings` over the `buildings`
  prop and updates the file's building attachment on save.
- **Jump to building**: following an attached building switches `currentViewer` to
  `ViewerNames.buildings` and sets the view to `detail` — navigating the user to that building's
  page without a route change.
- **Saving**: calls `updateFile`, which revalidates the relevant SWR keys so the table and any
  building's attached-files tab refresh.

### Permissions

Every editable control is disabled without `update` on `File`:

```tsx
<Input disabled={!ability.can('update', 'File')} />
```

## Related

- [Data Pages](/docs/architecture/data-pages) — how the files page is assembled
- [DataMenu](/docs/components/data-menu) — the shell that renders this panel
- [SimpleBimViewer](/docs/components/viewer) — 3D/BIM file renderer used for IFC and model previews
- [useFile](/docs/hooks/files) — Hook for file operations
- [DbFile](/docs/architecture/data-model#dbfile) — File metadata type definition
