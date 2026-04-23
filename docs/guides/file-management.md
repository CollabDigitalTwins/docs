---
sidebar_position: 5
---

# File Management

CDT stores all binary assets in [MinIO](https://min.io/), a high-performance open-source object storage server compatible with the S3 API. Metadata and relational attributes are stored in PostgreSQL and queried through the platform's API.

## Upload

### Drag and Drop

The quickest way to add files is to drag and drop them directly onto the map viewer or BIM viewer. The platform:

1. Detects the file type
2. Routes it to the appropriate processing pipeline
3. Stores the binary in MinIO
4. Creates a metadata record in the database linked to the target Building

### File Panel Upload

In the BIM viewer, use the **File** tab → **Upload** button to select one or more files from your device. This gives you more control over placement and metadata before the file is added to the scene.

## Supported File Types

| Category | Formats |
|---|---|
| **BIM models** | IFC |
| **3D geometry** | glTF, GLB, FBX, OBJ, Collada |
| **Point clouds** | LAS, LAZ, COPC, BIN |
| **CAD drawings** | DXF |
| **GIS data** | GeoJSON |
| **Documents** | PDF |
| **Media** | JPG, PNG, MP4, MP3, and other common video/audio formats |

## IFC Processing Pipeline

When you upload an IFC file, the server intercepts it before storage and runs an optimization pipeline:

1. Parses the raw IFC STEP file
2. Converts geometry and metadata to **Fragments 2.0** binary format (`.frag`) using FlatBuffers encoding
3. Stores both the original IFC and the `.frag` version in MinIO
4. Streams the `.frag` file to the client at load time

This approach drastically reduces RAM overhead and loading time compared to parsing IFC directly in the browser — important for multi-gigabyte federated models.

## Versioning

MinIO versioning is enabled on all buckets. Every time you re-upload a file with the same name, the previous version is preserved. You can:

- View the version history for any file
- Restore an older version
- Download any historical version

This supports ISO 19650-style information management workflows where traceability of changes is required.

## Metadata

Every file record in the database stores:

| Field | Description |
|---|---|
| Name | Display name |
| Format | File type |
| Author | User who uploaded the file |
| Created / Updated | Timestamps |
| GlobalId | Linked IFC GlobalId (for BIM files) |
| Location | Longitude/latitude or XYZ coordinates |
| CRS | Coordinate reference system |
| Building | Parent Building record |
| Organization | Access control scope |

GlobalId linkage means sensor data, BCF topics, IDS results, and media can all be associated with the same physical asset across different file types.

## Permissions

File visibility and editability follow the Organization's role assignments. A file uploaded by one team member within an Organization is accessible to all members with Viewer permissions or higher. Files can be marked as private (visible only to the uploader) or shared at the Organization level.

## Storage Infrastructure

The MinIO instance runs on a Canadian server (Fullhost VPS in Vancouver and Toronto) to ensure data sovereignty. All data storage and processing remain within Canadian territorial boundaries. Network security restricts database and storage access to the platform's web server IP only.
