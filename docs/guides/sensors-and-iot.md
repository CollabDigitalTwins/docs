---
sidebar_position: 6
title: Sensors & IoT Data
description: Connect telemetry to buildings and BIM elements, and visualize live data in the viewers and on dashboards.
---

# Sensors & IoT Data

CDT is designed to move beyond static models toward a true digital twin: a physical environment and a digital representation connected by a live data feedback loop. Sensor and IoT integration is how that loop is realized.

## Goal

Understand how CDT links telemetry to Buildings and BIM elements and visualizes live data in the viewers and on dashboards.

## Prerequisites

- A CDT account.

## What you can connect

CDT is built to ingest telemetry from:

- **Building Automation Systems (BAS)**: HVAC, lighting controls, energy meters
- **Environmental sensors**: temperature, humidity, CO₂, air quality
- **Occupancy sensors**: presence detection, people counting
- **Smart meters**: electricity, gas, water consumption
- **Weather stations**: outdoor temperature, solar radiation, wind

Once connected, telemetry is linked to specific building elements (an `IfcSpace` for a room sensor, an `IfcSystem` for an HVAC network) using the element's `GlobalId`.

## Connecting a data source

When you add a sensor, the **Data URL** field is fetched verbatim (no prefix is added), so paste the full URL you want polled. For example, the `sensors-api` synthetic service exposes URLs like `https://sensors-api-tau.vercel.app/api/sensor/temperature`.

**Data Format** controls how the response is parsed:

- **Csv**: header-less `time,value` rows.
- **Json**: auto-detects the response shape and reads OGC SensorThings data:
  - an STA Datastream (`?format=sta`)
  - a compact `dataArray` (`?format=dataarray`)
  - a single `reading` (`?format=reading`)

Recommended: use `?format=sta` when the source supports it. It's the only windowed format that carries a unit (from `unitOfMeasurement.symbol`). `dataarray` also returns history but no unit, and `reading` returns only the current value with no history.

When the source provides a unit, it's shown next to the value in the chart.

The chart polls the Data URL at the sensor's **Update Frequency** (floored at 1 second), so both the history and the current value stay live without a page refresh.

## Visualize sensor data

### In the BIM Viewer

When sensor data is linked to a model element, the properties panel shows the current reading next to the element's IFC attributes. You can colour elements by sensor value, for example rooms by current temperature to identify hot or cold zones.

### On the Map

Sensor stations with geographic coordinates appear as markers on the map viewer. Click a marker to open a popover with the current reading and a mini time-series chart.

### Dashboards

The platform supports chart-based dashboards for portfolio-level analysis: energy consumption across all buildings in a Site, indoor air quality trends over a week, occupancy patterns by floor.

### Timezone, time ranges, and the expanded view

Every sensor card and chart renders times in a **display timezone**. By default this is derived from the current building's location (falling back to a sensor's coordinates, then to your browser's timezone), so readings show in the local time of where the sensor sits. The zone is a session preference: it is not persisted and resets on reload.

Open a sensor's **expanded view** with the expand tool on the card's action row (available in the sidebar and the map popup). The expanded dialog adds:

- **Time-range presets**: All, Last day, Last hour, plus a **Custom** range you set by dragging the navigator brush under the chart.
- A **timezone selector** that changes the display zone for every sensor time across the app (charts and the "Created" timestamps).
- A **metadata panel** that, when the source is an OGC SensorThings Datastream, lists the observation type, observed property and its definition link, the unit and unit definition, the phenomenon-time interval, the observation count, and the generator properties.

Hovering the chart shows a tooltip with both the reading's **value** and its **time** in the selected zone.

## Architecture in brief

| Layer | Notes |
|-------|-------|
| **Time-Series Database (TSDB)** | High-frequency readings live separate from PostgreSQL: optimized for high write throughput, range queries, and retention policies. |
| **Real-time updates** | Frontend polls at a configurable interval and uses SWR (stale-while-revalidate) caching, so the UI always shows the latest value without hammering the database. |
| **Linkage** | Sensors carry a `GlobalId` reference into the linked IFC element, so the same data appears in BIM, map, and dashboard contexts. |

## Example: campus energy & occupancy monitoring

The platform's sensor integration was first developed for a university digital-campus deployment that connected real-time data to a federated BIM model of 50+ buildings:

- **Energy consumption monitoring**: electricity kWh/ft² per building, updated live.
- **Building occupancy**: sensor estimates visualized on floor plans.
- **Parking availability**: real-time parking lot status across campus.

This work established the data model and visualization patterns now used in CDT's sensor integration layer.

## Roadmap

- Full IoT device management UI (register, configure, and monitor devices from the platform).
- Alert rules and threshold notifications.
- Integration with national environmental datasets (CIFFC wildfire monitoring, Environment Canada weather).
- Export of time-series data to CSV or API for external analysis.

For tracked status, see the [Changelog](../changelog.md) and [GitHub roadmap](https://github.com/CollabDigitalTwins/core/milestones).

## Related

- [Concepts → Multi-Viewer Architecture](../concepts/multi-viewer-architecture.mdx)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Hooks → Sensors](../hooks/sensors.md)
