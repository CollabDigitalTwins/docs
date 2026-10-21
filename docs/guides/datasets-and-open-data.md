---
sidebar_position: 7
title: Datasets & Open Data
description: Browse, overlay, and style federated open data from national, provincial/territorial, and municipal portals.
---

# Datasets & Open Data

CDT aggregates open data from national, provincial/territorial, and municipal sources into a single interface, with no GIS software required. Data fetches in real time from its original source, so you always see the most current version.

Canada publishes a great deal of open data, but it is fragmented across hundreds of portals running four different platforms: CKAN, Huwise, Socrata, and ArcGIS. CDT normalizes their APIs so you can stack layers from different jurisdictions without downloading anything.

Uploading requires the **User** or **Admin** role in your organization.

## Add a dataset to the map

1. Click the **Datasets** icon in the bottom toolbar.
2. Browse or search the catalogue by keyword, jurisdiction, or category.
3. Click a dataset to add it as a layer.
4. Click any feature to read its attributes.

Multiple layers can be active at once. CDT reprojects everything to WGS 84 with [Proj4js](https://proj4js.org/), so layers from different scales and sources stack correctly.

## Style a layer

Select the settings icon next to a layer in the layer panel to open its style settings. **Colour by** lists the dataset's attributes; identifiers and coordinates are left out. The CDT platform reads each attribute's values to decide what it holds, so the choices match the data:

| Attribute holds | Display options |
|-----------------|-----------------|
| Text or types (for example, sport: tennis, basketball) | **Categories**: each value gets its own colour from the map palette, and you can change any of them |
| Yes / no values | **Yes / no**: pick a colour for yes, no, and no data |
| Numbers or dates | **Colour ramp** between the lowest and highest value, or **Classes** split by quantile, equal interval, or natural breaks (Jenks), with a choice of colour ramps |
| Colours (hex, `rgb()`, or `r,g,b`) | **Colours in the data**: each feature is drawn in its own colour |

Point layers can also show a **Heatmap**, weighted by a numeric attribute if you pick one.

Select **More style** to set the layer's **Opacity**, **Border colour** and **Border width**, the **Point size** or **Line width**, and **Labels** from any attribute. Point layers start fully opaque. For classes, a legend shows the range each colour covers; for the other options, the colour list itself is the legend.

New layers start with the publisher's own styling when the source provides it (ArcGIS services do). Otherwise, if the features carry a colour attribute, those colours are used. If neither applies, the layer gets a single colour.

## Upload your own dataset or map service

1. Open the **Add media** feature in the map.
2. Drop a GeoJSON file onto the map, or paste a URL. The source type is detected from the URL, and you can change it:
   - **GeoJSON**: a link to a GeoJSON file.
   - **ArcGIS feature layer**: a FeatureServer or MapServer layer. Its features load live, by the area you are viewing.
   - **WMS** or **WMTS**: click **Load** to list the service's layers, pick one, then **Add to map**.
   - **ArcGIS map service** or **ArcGIS image service**: a whole MapServer or ImageServer, drawn as imagery.
   - **XYZ tiles**: a tile URL containing `{z}`, `{x}` and `{y}`.
3. Choose visibility: **Private** (only you) or **Organization** (all members).
4. The dataset is listed alongside official datasets. Uploaded GeoJSON is stored in MinIO. Everything else is fetched live from its source.

Map services are imagery, so their features are not individually clickable. You can still set their opacity, and WMS, WMTS and ArcGIS map services show the server's legend under the layer. While their tiles load, the layer's row shows the share already drawn.

The same flow takes geotagged photos, videos, audio, and pinned text annotations, which is useful for fieldwork, community engagement, and site documentation.

## Where the data comes from

Portals are organized by jurisdiction, plus **Organizational** datasets your own organization adds.

**National**

| Source | Content |
|--------|---------|
| Open Government (open.canada.ca) | Policy data, infrastructure, environment |
| Natural Resources Canada (NRCan) | Topography, geology, forestry, energy |
| Statistics Canada | Census, demographic, economic data |
| Geo.ca | National geospatial catalogue |
| CIFFC | Active wildfire perimeters and conditions |

**Country subdivision (provincial / territorial)**: British Columbia (Open BC), Quebec (Données ouvertes), Ontario, New Brunswick, Alberta, Saskatchewan, Yukon, Nunavut, and others.

**Municipal**: Ottawa, Toronto, Vancouver, Montreal, Calgary, Halifax, and more, providing parcel data, zoning, infrastructure, and transit.

**Community and global**: OpenStreetMap (building footprints, roads, points of interest) and partner affordable-housing databases.

## Supported formats

| Format | Protocol |
|--------|----------|
| **GeoJSON** | Direct HTTP fetch from open data portals |
| **CKAN DataStore** | Rows with a geometry column or latitude/longitude columns |
| **OGC WFS** | GetFeature as GeoJSON |
| **ArcGIS feature layers** | Queried by the visible area |
| **WMS** | OGC Web Map Service, tiled raster imagery, including time-enabled layers |
| **WMTS** | OGC Web Map Tile Service, pre-rendered Web Mercator tiles |
| **ArcGIS map and image services** | Cached tiles, or images exported for each tile |
| **XYZ tiles** | Any `{z}/{x}/{y}` tile URL |
| **Vector tiles** | Served from PostGIS via the Martin tile server |

## Large datasets

The CDT platform loads every feature a portal offers, not only the first page a server returns. Datasets up to 50,000 features load whole. Larger ones load by the area you are viewing when you are zoomed in, and whole when you zoom out, with points grouped into clusters. While a dataset loads, its row in the layer panel shows a progress ring and how much has arrived, then the number of features and their size. When you add a dataset, the CDT platform first checks that it can be loaded. If the check fails, for example because the publisher does not allow access or no longer serves the data, the dataset is not added, a short message says why, and it disappears from the catalogue for a day. If a dataset you added later fails for good or turns out to have nothing to draw, it is removed from the map with the same message. When the publisher simply could not be reached, the dataset is left out of the catalogue for an hour instead, and one already on the map stays there with a warning on its row. Loaded areas are kept in your browser for an hour, so panning back is instant. If a dataset passes 500,000 features, a notice says it was cut short.

A GeoJSON file larger than 50 MB is not loaded in the browser; publish it as vector tiles from its row in the catalogue instead. When a portal lists the same data as a live service and as a file, the service is used.

## Favourites

Click the star on a dataset to add it to your **Favourites** tab. Favourites are saved to your account, so they follow you across sessions and devices, and they appear in both the catalogue and the map sidebar.

## Real-time data

Some datasets update continuously. Wildfire perimeters from CIFFC, for example, refresh on a short interval so the map reflects current conditions. The platform uses SWR (stale-while-revalidate) to serve cached values instantly while refreshing in the background.

## Metadata transparency

Every dataset and feature exposes its full metadata in the UI. Clicking a feature shows all available attributes and, where available, the data source, update frequency, and licence. CDT does not modify or re-interpret source data.

## Related

- [Map Viewer](./map-viewer.md)
- [Concepts → GIS & Map Data](../concepts/gis-and-map-data.mdx)
- [Concepts → Open Data Portals](../concepts/open-data-portals.mdx)
