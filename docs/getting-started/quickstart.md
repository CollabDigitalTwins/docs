Get up and running with Canada's Digital Twin in under 10 minutes.

## Quick Setup

If you haven't already, follow the [Installation Guide](./installation.md) to set up your environment.

Once the development server is running, navigate to `http://localhost:3000` to access the CDT platform.

## Interface Overview

### Map Viewer

The platform opens to the Map Viewer by default, where you can:

- **Navigate the map** — Pan, zoom, and explore geospatial data across Canada
- **Search locations** — Use the search bar in the top left to find geocoded locations
- **View building footprints** — Zoom in and click on building footprints to see details
- **Add datasets** — Click the database icon in the bottom toolbar to open the Datasets panel
  - Browse federal, provincial, and municipal open data layers
  - Toggle layers on/off to overlay geospatial data on the map

### 3D Viewers

Access different viewers from the left sidebar:

- **BIM Viewer** — Load and interact with IFC BIM models
- **Point Cloud Viewer** — Visualize point cloud data in 3D

### Data Management

Browse and manage spatial data:

- **Buildings** — View building data stored in the platform database
  - Click any building to see detailed information and associated files
  - Add buildings directly to the map
- **Sites** — View site information and associated buildings
- **Files** — Access all files stored on the platform

### Tools & Features

Bottom toolbar includes:

- **Datasets** — Toggle map layers from open data portals
- **Compare Buildings** — Select multiple buildings to compare their properties
- **Share** — Copy link or generate QR code for current map position
- **Measure** — Calculate distances and areas on the map

### Settings & Preferences

Access from the left sidebar:

- **Language** — Switch between English and French (i18n support)
- **Support** — Get help or provide feedback
- **Account** — Manage settings or logout

## Next Steps

- Explore the [Architecture Overview](../concepts/architecture.md) to understand how components work together
- Read the [API Reference](../api/overview.md) for backend integration
- Check out [Component Guides](../guides/components.md) for frontend development
- [Contribute](https://github.com/collabdt/core?tab=contributing-ov-file#contributing-to-collab-digital-twins) to the project

**Need Help?** Join our community on [GitHub Discussions](https://github.com/collabdt/core/discussions) or reach out via our [contact form](https://collabdt.org/home#contact).