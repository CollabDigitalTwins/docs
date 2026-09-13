---
sidebar_position: 3
title: Point Clouds
description: Upload a LAS, LAZ or E57 scan, convert it to a streaming octree, and place it alongside your IFC models.
---

# Point Clouds

Point clouds render in the **BIM viewer**, in the same scene as your IFC models. A scan and a model share one camera, one clipping set, and one measurement tool.

You need access to a building, a scan in **LAS**, **LAZ** or **E57**, and a reachable conversion service (`POINTCLOUD_API_URL` — self-hosters see [Deployment → Services](../deployment/services.md)).

## Upload a scan

1. Open the **BIM viewer** and select the building.
2. In the sidebar's **File** tab, find the **Point Clouds** section and use the **+** button.
3. Pick your file. Two progress bars follow in turn: **Uploading** sends the file to object storage, then **Converting** builds the Potree octree the viewer streams.
4. When conversion finishes the row becomes viewable, with no page reload.

A scan is only renderable once conversion succeeds; until then the row is listed but offers no **view** action. Two recovery actions appear when something goes wrong:

| Icon | When it appears | What it does |
|------|-----------------|--------------|
| Refresh | The file uploaded but conversion did not finish | Re-runs the conversion |
| Upload | The upload itself died, leaving a row with no object behind it | Removes the row and lets you re-pick the file |

## Place a cloud against a model

Choose **Move** on the cloud's row, then drag the pivot or type exact offsets and rotations in the placement panel. The placement is saved to the file record, so it survives a reload.

## Tune how points draw

Sidebar → **Settings** → the point cloud block. Every control applies to the whole scene except opacity, which is per cloud.

| Control | What it does |
|---------|--------------|
| **Point budget** | How many points may be on screen at once. The main performance lever |
| **Point size** | Base size in world units |
| **Max size** | Upper bound in pixels, so near points do not become blobs |
| **Size type** | `fixed`, `attenuated` (shrinks with distance) or `adaptive` |
| **Shape** | `square`, `circle` or `paraboloid` |
| **Opacity** | Per cloud. **Ghost** on the file row is the same value |
| **Show octree boxes** | Draws the streaming node boxes: a diagnostic, not a display mode |

Colour comes from the scan itself. Elevation, intensity and classification colour modes are not currently exposed.

## Navigate

Sidebar → **Settings** → **Camera Settings**.

- **Orbit** — left-drag to orbit, right-drag to pan, scroll to zoom.
- **Walk** — first person. Move with **WASD** or the arrow keys; **Q** and **E** move down and up. Set a **move speed**, and **lock elevation at** a height in metres to hold a constant eye level. Walk mode needs a perspective projection and is unavailable under orthographic.

## Measure and section

Measurement and clipping operate on cloud geometry as well as model geometry, so you can measure from a scanned surface to a modelled element and section through both at once.

## Supported formats

| Format | Notes |
|--------|-------|
| **LAS** | Standard uncompressed format. Read directly |
| **LAZ** | Compressed LAS. Read directly, and the smaller upload |
| **E57** | Common scanner exchange format. Transcoded to LAZ server-side before conversion |

Every format is converted server-side into a Potree octree, and the viewer streams that octree rather than the original file. Conversion time scales with point count, so a large scan takes a while; the progress bar reports the converter's own percentage.

## Troubleshooting

**The scan uploaded but never appears in the Point Clouds section.** The file record needs a `point-cloud-file` type or a recognised extension. If neither is set it lands in the generic **Files** list instead.

**Conversion finishes but nothing renders.** Check that the conversion service can reach object storage, and that the octree's `metadata.json` was written.

See [Troubleshooting → Viewers](../getting-started/troubleshooting.mdx#viewers) for more.

## Related

- [Concepts → Point Clouds](../concepts/point-clouds.mdx)
- [BIM Viewer](./bim-viewer.md)
- [File Management](./file-management.md)
