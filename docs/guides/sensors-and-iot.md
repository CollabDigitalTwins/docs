---
sidebar_position: 6
title: Sensors & IoT Data
description: Connect telemetry to buildings and BIM elements, and visualize live data in the viewers and on dashboards.
---

# Sensors & IoT Data

CDT is designed to move beyond static models toward a true digital twin — a physical environment and a digital representation connected by a live data feedback loop. Sensor and IoT integration is how that loop is realized.

## Goal

Register a sensor against a Building or BIM element, link it to a data stream, and view its values in CDT.

## Prerequisites

- A CDT account with **User** or **Admin** role to register sensors.
- A live data stream you can read from — an MQTT topic, an HTTP endpoint, or a CSV import.
- Optionally, an IFC element's `GlobalId` you want the sensor pinned to.

## What you can connect

CDT is built to ingest telemetry from:

- **Building Automation Systems (BAS)** — HVAC, lighting controls, energy meters
- **Environmental sensors** — temperature, humidity, CO₂, air quality
- **Occupancy sensors** — presence detection, people counting
- **Smart meters** — electricity, gas, water consumption
- **Weather stations** — outdoor temperature, solar radiation, wind

Once registered, telemetry is linked to specific building elements (an `IfcSpace` for a room sensor, an `IfcSystem` for an HVAC network) using the element's `GlobalId`.

## Define a Sensor Type

**Goal:** create a reusable sensor category before registering individual sensors.

1. Open **Settings → Sensor types**.
2. Click **New sensor type**.
3. Fill in:
   - **Name** (for example, *Indoor Temperature*).
   - **Unit** (for example, `°C`).
   - **Value type** — number, integer, or boolean.
   - **Default colour ramp** for visualization.
4. Save.

**Result:** the sensor type is now selectable when registering individual sensors.

## Register a Sensor

**Goal:** create a sensor record and link it to a data source.

1. Open **Settings → Sensors → Add sensor**.
2. Fill in:
   - **Sensor type** — pick from the list you defined above.
   - **GlobalId** — the IFC element this sensor is associated with (or leave blank if it is map-anchored).
   - **Data stream identifier** — device ID, API endpoint, or MQTT topic.
   - **Location** — inherit from the linked element, or set explicitly as XYZ / lat-lon.
3. Save.

**Result:** the sensor appears in the Sensors list. Once data flows in, it is visible in the relevant viewer.

## Visualize sensor data

### In the BIM Viewer

When sensor data is linked to a model element, the properties panel shows the current reading next to the element's IFC attributes. You can colour elements by sensor value — for example, rooms by current temperature to identify hot or cold zones.

### On the Map

Sensor stations with geographic coordinates appear as markers on the map viewer. Click a marker to open a popover with the current reading and a mini time-series chart.

### Dashboards

The platform supports chart-based dashboards for portfolio-level analysis: energy consumption across all buildings in a Site, indoor air quality trends over a week, occupancy patterns by floor.

## Architecture in brief

| Layer | Notes |
|-------|-------|
| **Time-Series Database (TSDB)** | High-frequency readings live separate from PostgreSQL — optimized for high write throughput, range queries, and retention policies. |
| **Real-time updates** | Frontend polls at a configurable interval and uses SWR (stale-while-revalidate) caching, so the UI always shows the latest value without hammering the database. |
| **Linkage** | Sensors carry a `GlobalId` reference into the linked IFC element, so the same data appears in BIM, map, and dashboard contexts. |

## Example: Carleton Digital Campus

The platform's sensor integration was first developed for the Carleton University Digital Campus project, which connected real-time data to a federated BIM model of 50+ buildings:

- **Energy consumption monitoring** — electricity kWh/ft² per building, updated live.
- **Building occupancy** — sensor estimates visualized on floor plans.
- **Parking availability** — real-time parking lot status across campus.

This work established the data model and visualization patterns now used in CDT's sensor integration layer.

## Roadmap

- Full IoT device management UI (register, configure, and monitor devices from the platform).
- Alert rules and threshold notifications.
- Integration with national environmental datasets (CIFFC wildfire monitoring, Environment Canada weather).
- Export of time-series data to CSV or API for external analysis.

For tracked status, see the [Changelog](../changelog.md) and [GitHub roadmap](https://github.com/collabdt/core/milestones).

## Related

- [Concepts → Multi-Viewer Architecture](../concepts/multi-viewer-architecture.mdx)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Hooks → Sensors](../hooks/sensors.md)
