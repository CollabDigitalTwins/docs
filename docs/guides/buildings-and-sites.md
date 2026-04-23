---
sidebar_position: 4
---

# Managing Buildings & Sites

CDT organizes all assets in a two-level spatial hierarchy: **Sites** contain **Buildings**, and Buildings contain files and sub-assets. This structure maps directly to how real-world facilities are managed — a campus, military base, or district is a Site; the individual facilities within it are Buildings.

## Sites

A Site is the top-level geospatial container. It defines:

- **Coordinate reference system (CRS)** — the projection used by all assets within the site (e.g., UTM Zone 17N, MTM, or WGS 84)
- **Boundary** — the geographic extent of the site on the map
- **Ownership** — which Organization the site belongs to, and which roles can access it

Sites can represent anything from a single city block to a military installation to a provincial infrastructure portfolio.

### Creating a Site

1. Open the map viewer and navigate to your location
2. Click **New Site** in the left panel
3. Set the name, description, and CRS
4. Draw the site boundary on the map or enter coordinates manually
5. Assign the site to an Organization

## Buildings

A Building represents an individual facility within a Site. Its database record is mapped to the [buildingSMART Data Dictionary (bSDD)](https://www.buildingsmart.org/users/services/buildingsmart-data-dictionary/) for standardized classification.

Each Building acts as a container for:

- **BIM models** — IFC files for design, as-built, or renovation
- **Point clouds** — reality capture data
- **CAD drawings** — DXF floor plans or site drawings
- **Documents** — PDFs, reports, specifications
- **Sensor feeds** — linked IoT data streams
- **Media** — photos, videos, audio attached to specific locations

### Creating a Building

1. Select the parent Site on the map
2. Click **Add Building**
3. Enter the building name, typology (from bSDD), and construction year
4. Place the building on the map using its footprint or a single coordinate point
5. Upload or link files as needed

### Building Metadata

The platform stores the following attributes for each Building:

| Field | Description |
|---|---|
| Name | Human-readable identifier |
| bSDD classification | Standardized building type |
| Construction year | Used for portfolio filtering and retrofit planning |
| Coordinate | Longitude / latitude of the building origin |
| CRS | Coordinate reference system for local Cartesian files |
| Organization | Access control scope |

## File Types and Storage

Files attached to Buildings are split into two storage layers:

- **Binary payloads** — stored in MinIO (S3-compatible object storage), versioned
- **Metadata** — stored in PostgreSQL, indexed for fast querying

The platform distinguishes between:

- **Georeferenced files** — defined by longitude/latitude, placed on the map automatically
- **Local Cartesian files** — defined by XYZ coordinates relative to the building origin, displayed in the BIM viewer

Both types support version history, provenance tracking (author, timestamp), and permission-based access.

## Role-Based Access

Access to Sites and Buildings is controlled by the Organization's role assignments. Typical roles:

| Role | Permissions |
|---|---|
| **Viewer** | Read-only access to files and metadata |
| **Contributor** | Upload files, add comments and media |
| **Manager** | Edit building records, manage members |
| **Admin** | Full control including deletion and CRS settings |

Roles are enforced at both the API level (Next.js server-side validation) and the UI level (features hidden or disabled based on permissions).

## Filtering and Search

From the map view, Buildings can be filtered by:

- bSDD typology (office, residential, industrial, etc.)
- Construction year range
- Site
- Organization

This supports portfolio-level workflows such as identifying all pre-1980 residential buildings across a site for a retrofit assessment.
