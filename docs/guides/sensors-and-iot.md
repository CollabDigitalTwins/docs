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

- **Time-range presets**: All, Last day, Last hour, plus a **Custom** range you set by dragging the navigator brush under the chart. The presets apply to the comparison charts too, each of which has its own brush.
- A **timezone selector** that changes the display zone for every sensor time across the app (charts and the "Created" timestamps).
- A **metadata panel** that, when the source is an OGC SensorThings Datastream, lists the observation type, observed property and its definition link, the unit and unit definition, the phenomenon-time interval, the observation count, and the generator properties.

Hovering the chart shows a tooltip with both the reading's **value** and its **time** in the selected zone.

### Value colours, the legend, and marker halos

Each **sensor type** carries a value range (`minValue`, `maxValue`) and a three-stop colour ramp (`minColour`, `midColour`, `maxColour`). Those settings drive a single value-to-colour mapping used everywhere a value is shown, so the same colour always means the same reading:

- **The chart fill** is a gradient stretched over the type's range, not just over the plot box. A colour partway up the area corresponds to an actual value, and readings beyond the configured range clamp to the end colours.
- **Marker halos.** Focus a sensor (click its marker, or its row in the sidebar) and every sensor of that same type gets a halo coloured by its own current reading. Scanning the model or map then shows which sensors of that type are running high and which are low, without opening any of them.
- **The focused sensor** is marked by a *thicker* ring rather than a different colour, since colour is carrying the value.
- **The legend** appears bottom-left in the BIM and map viewers, in the same card stack as the layers card. It shows the active sensor type, the focused sensor's current reading, the colour ramp as a bar, the low/middle/high values of the range, and a caret marking where the current reading falls on the ramp.
- **Sidebar rows.** In the sensors sidebar, each row's icon is ringed in the colour of that sensor's current reading, and the reading itself is printed under the name. Every listed sensor gets one, not just the focused type, so the panel doubles as an at-a-glance status list. Colours are resolved per type, so a reading always reads high or low against its own type's range and is not comparable across different types.

If a sensor type has no colours configured, or its `minValue` and `maxValue` are equal, there is nothing meaningful to map: no halos are drawn and the chart keeps its plain appearance. The legend card still opens so you can pick another type, but it shows a "no colour range configured" note in place of the ramp.

#### Showing and hiding the legend

Switching a sensor type on in the sidebar is also how you choose what the legend explains: the card, the marker halos and the map's building colours all appear straight away, without having to click a sensor first. Switching it off releases them again.

The legend exists only while it has something to explain. Turn off the sensor type or tag it belongs to and the card disappears with the markers; turn it back on and it returns. Its count badge counts only the sensors currently visible in that viewer.

You can also control it directly:

- The **X** on the card hides it.
- The **palette button** in the sensors sidebar toolbar, beside the filter button, shows and hides it again.

Both are remembered per viewer for the session, so hiding it on the map leaves it alone in the BIM viewer.

#### Changing the active type

The type name in the legend header is a dropdown listing every sensor type placed in the current viewer. Picking one retargets the legend, the marker halos and the map's building colours together, and switches that type on if it was hidden.

Changing the type clears the focused sensor, since it belongs to a different type: the card shows the ramp alone, with no caret and no reading, until you click a sensor of the new type.

### Colouring buildings by sensor type

On the map, the active sensor type also tints the 3D building footprints, whether you reached it by focusing a sensor or by picking it in the legend dropdown. Each building is coloured by the **average of the latest readings** of its sensors of that type, using the same ramp as everything else, so a row of buildings can be compared at a glance.

The average includes every sensor attached to the building regardless of where it was placed, so a BIM-placed sensor and a map-placed sensor on the same building both count. Buildings with no sensors of that type keep their default colour, and hovering or clicking a building still highlights it over the sensor colour.

Turn the type off and every footprint returns to its default colour, and the map stops polling those feeds.

Sensor **clusters** follow the same rule: a cluster bubble is coloured by the mean of the readings it hides, so zooming out never changes what a colour means. Clusters fall back to the usual count-based colours when no type is active.

#### Building sensor badges

Every building contributing to the colouring gets a **circular badge at its centre** showing how many sensors of that type it has, filled with the same average colour as its footprint. The badge is a readout, not a button: clicking it clicks the building underneath.

#### Sensor readings in the building popover

While a type is active, clicking a building shows its readings **in place of** the address, building type and storey count.

The card itself always shows the headline, without expanding anything:

- the average that produced the footprint colour, next to a swatch of it;
- how many of the building's sensors are currently reporting, and when the most recent reading arrived.

Expanding the details adds the individual sensors, each by name with its current value, colour-coded. Clicking a row focuses that sensor everywhere. The list caps at ten rows and scrolls past that, so a building with a large array does not push the tool row off the card.

The usual building details come back when no sensor type is active, and the popover's tool row is unchanged either way.

### Comparing sensors of the same type

The expanded view has a scope control beside the time-range presets. It scopes both charts below it at once:

- **This sensor** shows the single-sensor area chart described above.
- **All of type** shows every sensor of the same type in the same viewer.
- **By tag** narrows that set to one tag, so you can compare only the sensors on a floor, a zone, or an equipment group.

When more than one sensor is in scope you get two charts:

- **Over time**, a multi-line chart. The focused sensor is the only coloured line; its siblings are recessive grey hairlines. That one colour is the focused sensor's own current reading on the ramp, so the line matches its bar, its halo and the legend caret rather than always being the ramp's top colour. Identity comes from the sensor list beside the chart rather than from colour, which keeps it readable whether a type has three sensors or thirty. Hovering a name lifts that line, and clicking a line or a name focuses that sensor everywhere: the legend, the marker halos, and both charts follow. One tooltip lists every sensor's value at the moment under the pointer. A navigator brush under the chart sets a custom window.
- **Current values**, a horizontal bar chart sorted from high to low, one bar per sensor, showing each sensor's last reading inside the selected time range. Each bar is filled with the same ramp colour as that sensor's halo in the viewer, so a bar can be matched to a marker in the scene. Clicking a bar focuses that sensor.

Focus is shared, so clicking a line, a bar, a sidebar row or a marker moves the highlight in all of them at once.

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
