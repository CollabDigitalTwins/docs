---
title: FilePreview
description: Renders a preview of uploaded files with format-specific display handling and fullscreen dialog support.
category: components
status: draft
last_updated: 2025-01-13
---

# FilePreview

Displays a preview card for uploaded files, automatically selecting the appropriate renderer based on file extension. Supports images, videos, PDFs, Office documents, 3D models (GLTF/GLB/FBX/OBJ), and BIM files (IFC/FRAG). Clicking the preview opens a fullscreen dialog with an expanded view.

## Usage

```tsx
import FilePreview from '@/core/components/viewers/Data/files/FilePreview';
import { Dialog } from '@/core/components/ui/';

<Dialog>
  <FilePreview 
    file={{ metadata: fileRecord }} 
    showTrigger={true}
    disableDialogFor3D={false}
  />
</Dialog>
```

## Props

| Prop | Type | Required | Default | Description |
|------|------|----------|---------|-------------|
| `file` | `{ metadata: DbFile }` | Yes | — | File object containing metadata with url, extension, and name |
| `showTrigger` | `boolean` | No | `true` | Whether to render the clickable preview card trigger |
| `disableDialogFor3D` | `boolean` | No | `false` | When true, 3D/BIM files render inline without dialog functionality |

## Behaviour

- **Format detection**: Determines preview type from `file.metadata.extension` (case-insensitive)
- **Supported formats**:
  - Video: MP4 (native `<video>` element)
  - Images: JPG, JPEG, PNG, WEBP, GIF (native `<img>` element)
  - Documents: PDF, PPT/PPTX, XLS/XLSX/XLSM/XLSB/CSV, DOC/DOCX (placeholder icons in card, Office Online viewer in dialog)
  - 3D: GLTF, GLB, FBX, OBJ, COLLADA, IFC, FRAG (SimpleBimViewer component)
- **Dialog behavior**: Clicking the card opens a fullscreen dialog (90vh × 95vw) with the appropriate viewer
- **3D exception**: When `disableDialogFor3D` is true, 3D/BIM files render directly in the card without dialog interaction
- **Fallback**: Unknown file types display a generic "No preview available" message with a file icon

## Design Decisions

<!-- TODO: Why was this component built this way? Note any tradeoffs, constraints, or alternatives considered. -->

## Related

- [SimpleBimViewer](/docs/components/viewers/bim/SimpleBimViewer) — 3D/BIM file renderer used for IFC and model previews
- [useFile](/docs/hooks/files) — Hook for file operations
- [DbFile](/docs/data-model/file) — File metadata type definition
- [FileDetails](/docs/components/viewers/Data/files/FileDetails) — Parent component that displays file metadata alongside preview