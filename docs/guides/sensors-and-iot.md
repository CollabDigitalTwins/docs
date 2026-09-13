---
sidebar_position: 6
title: Sensors & IoT Data
description: Connect telemetry to buildings and BIM elements, and visualize live data in the viewers and on dashboards.
---

# Sensors & IoT Data

Sensor integration is what turns a static model into a digital twin: a physical environment and its digital representation connected by a live data feedback loop.

## What you can connect

CDT ingests telemetry from building automation systems (HVAC, lighting controls, energy meters), environmental sensors (temperature, humidity, CO₂, air quality), occupancy sensors, smart meters, and weather stations.

Telemetry is linked to specific building elements by `GlobalId`: an `IfcSpace` for a room sensor, an `IfcSystem` for an HVAC network.

## Connect a data source

The **Data URL** field is fetched verbatim with no prefix added, so paste the full URL you want polled. The `sensors-api` synthetic service, for example, exposes `https://sensors-api-tau.vercel.app/api/sensor/temperature`.

**Data Format** controls how the response is parsed:

- **Csv** — header-less `time,value` rows.
- **Json** — auto-detects the response shape and reads OGC SensorThings data: an STA Datastream (`?format=sta`), a compact `dataArray` (`?format=dataarray`), or a single `reading` (`?format=reading`).

Use `?format=sta` when the source supports it. It is the only windowed format that carries a unit, from `unitOfMeasurement.symbol`; `dataarray` returns history but no unit, and `reading` returns only the current value with no history. When a unit is available it appears next to the value in the chart.

The chart polls at the sensor's **Update Frequency** (floored at 1 second), so history and current value stay live without a page refresh.

## Where sensor data appears

**In the BIM viewer**, the properties panel shows the current reading next to the element's IFC attributes, and you can colour elements by sensor value to find hot or cold zones.

**On the map**, sensor stations with coordinates appear as markers. Click one for a popover with the current reading and a mini time-series chart.

**Dashboards** support portfolio-level analysis: energy consumption across a Site, air quality trends over a week, occupancy by floor.

### Timezone and time ranges

Cards and charts render times in a **display timezone**, derived from the current building's location, then a sensor's coordinates, then your browser. It is a session preference and resets on reload.

Open a sensor's **expanded view** with the expand tool on the card's action row, available in the sidebar and the map popup. It adds:

- **Time-range presets** — All, Last day, Last hour, plus a **Custom** range set by dragging the navigator brush under the chart. Presets apply to the comparison charts too, each with its own brush.
- **A timezone selector** that changes the display zone for every sensor time across the app.
- **A metadata panel** that, for an OGC SensorThings Datastream, lists the observation type, observed property and its definition link, unit and unit definition, phenomenon-time interval, observation count, and generator properties.

Hovering the chart shows a tooltip with the reading's value and its time in the selected zone.

### Value colours, the legend, and marker halos

Each **sensor type** carries a value range (`minValue`, `maxValue`) and a three-stop colour ramp (`minColour`, `midColour`, `maxColour`). One value-to-colour mapping drives everything, so the same colour always means the same reading:

- **The chart fill** is a gradient stretched over the type's range rather than the plot box, so a colour partway up the area corresponds to an actual value. Readings beyond the range clamp to the end colours.
- **Marker halos** — focus a sensor and every sensor of that type gets a halo coloured by its own current reading, so you can scan the model or map for highs and lows without opening any of them.
- **The focused sensor** gets a thicker ring rather than a different colour, since colour is carrying the value.
- **The legend** sits bottom-left in both viewers, in the same card stack as the layers card, showing the active type, the focused sensor's reading, the ramp as a bar, the range's low/middle/high values, and a caret marking where the current reading falls.
- **Sidebar rows** ring each sensor's icon in the colour of its current reading, with the reading printed under the name. Every listed sensor gets one, so the panel doubles as a status list. Colours resolve per type, so a reading reads high or low against its own type's range and is not comparable across types.

A type with no colours configured, or with `minValue` equal to `maxValue`, has nothing meaningful to map: no halos are drawn and the chart stays plain. The legend still opens so you can pick another type, showing a "no colour range configured" note in place of the ramp.

#### Showing and hiding the legend

Switching a sensor type on in the sidebar is also how you choose what the legend explains. The card, the marker halos and the map's building colours all appear immediately, without clicking a sensor first, and switching the type off releases them.

The legend exists only while it has something to explain, so turning off its sensor type or tag makes the card disappear along with the markers. Its count badge counts only the sensors currently visible in that viewer.

You can also control it directly: the **X** on the card hides it, and the **palette button** in the sensors sidebar toolbar shows it again. Both are remembered per viewer for the session, so hiding it on the map leaves the BIM viewer alone.

#### Changing the active type

The type name in the legend header is a dropdown listing every sensor type placed in the current viewer. Picking one retargets the legend, the marker halos and the map's building colours together, switching that type on if it was hidden.

Changing type clears the focused sensor, since it belongs to a different type. The card shows the ramp alone, with no caret and no reading, until you click a sensor of the new type.

### Colouring buildings by sensor type

On the map, the active sensor type also tints the 3D building footprints. Each building takes the **average of the latest readings** of its sensors of that type, on the same ramp as everything else, so a row of buildings can be compared at a glance.

The average includes every sensor attached to the building regardless of where it was placed, so BIM-placed and map-placed sensors both count. Buildings with no sensors of that type keep their default colour, and hovering or clicking still highlights them over the sensor colour. Turn the type off and every footprint returns to default, and the map stops polling those feeds.

Sensor **clusters** follow the same rule: a bubble is coloured by the mean of the readings it hides, so zooming out never changes what a colour means. Clusters fall back to count-based colours when no type is active.

#### Building sensor badges

Every building contributing to the colouring gets a circular badge at its centre showing how many sensors of that type it has, filled with the same average colour as its footprint. The badge is a readout, not a button: clicking it clicks the building underneath.

#### Sensor readings in the building popover

While a type is active, clicking a building shows its readings in place of the address, building type and storey count. The card always shows the headline without expanding anything: the average that produced the footprint colour next to a swatch of it, how many of the building's sensors are reporting, and when the most recent reading arrived.

Expanding the details adds the individual sensors, each by name with its current value, colour-coded. Clicking a row focuses that sensor everywhere. The list caps at ten rows and scrolls past that, so a large array does not push the tool row off the card.

The usual building details return when no sensor type is active.

### Comparing sensors of the same type

The expanded view has a scope control beside the time-range presets, scoping both charts below it at once: **This sensor** (the single-sensor area chart), **All of type**, or **By tag**, which narrows to one tag so you can compare a floor, a zone, or an equipment group.

With more than one sensor in scope you get two charts:

- **Over time**, a multi-line chart. The focused sensor is the only coloured line, its siblings recessive grey hairlines. That colour is the focused sensor's own current reading on the ramp, so the line matches its bar, its halo and the legend caret. Identity comes from the sensor list beside the chart rather than from colour, which stays readable whether a type has three sensors or thirty. Hovering a name lifts that line; clicking a line or name focuses that sensor everywhere. One tooltip lists every sensor's value at the moment under the pointer, and a navigator brush sets a custom window.
- **Current values**, a horizontal bar chart sorted high to low, one bar per sensor showing its last reading inside the selected range. Each bar carries the same ramp colour as that sensor's halo in the viewer, so a bar matches a marker in the scene. Clicking a bar focuses that sensor.

Focus is shared, so clicking a line, a bar, a sidebar row or a marker moves the highlight in all of them at once.

## Architecture in brief

| Layer | Notes |
|-------|-------|
| **Time-Series Database (TSDB)** | High-frequency readings live separate from PostgreSQL, optimized for write throughput, range queries, and retention policies |
| **Real-time updates** | The frontend polls at a configurable interval with SWR caching, so the UI shows the latest value without hammering the database |
| **Linkage** | Sensors carry a `GlobalId` reference into the linked IFC element, so the same data appears in BIM, map, and dashboard contexts |

## Example: campus energy and occupancy monitoring

Sensor integration was first developed for a university digital-campus deployment connecting real-time data to a federated BIM model of 50+ buildings: electricity kWh/ft² per building updated live, occupancy estimates visualized on floor plans, and real-time parking availability across campus. That work established the data model and visualization patterns CDT uses today.

## Roadmap

- Full IoT device management UI (register, configure, and monitor devices).
- Alert rules and threshold notifications.
- Integration with national environmental datasets (CIFFC wildfire monitoring, Environment Canada weather).
- Export of time-series data to CSV or API.

For tracked status, see the [Changelog](../changelog.md) and [GitHub roadmap](https://github.com/CollabDigitalTwins/core/milestones).

## Related

- [Concepts → Multi-Viewer Architecture](../concepts/multi-viewer-architecture.mdx)
- [BIM Viewer](./bim-viewer.md)
- [Map Viewer](./map-viewer.md)
- [Hooks → Sensors](../hooks/sensors.md)
