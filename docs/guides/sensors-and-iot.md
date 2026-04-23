---
sidebar_position: 6
---

# Sensors & IoT Data

CDT is designed to move beyond static models toward a true digital twin: a physical environment and a digital representation connected by a live data feedback loop. Sensor and IoT integration is how that feedback loop is realized.

## What Gets Connected

The platform is built to ingest telemetry from:

- **Building Automation Systems (BAS)** — HVAC, lighting controls, energy meters
- **Environmental sensors** — temperature, humidity, CO₂, air quality
- **Occupancy sensors** — presence detection, people counting
- **Smart meters** — electricity, gas, water consumption
- **Weather stations** — outdoor temperature, solar radiation, wind

Once connected, this data is linked to specific building elements (e.g., an `IfcSpace` for a room sensor, or an `IfcSystem` for an HVAC network) using the element's GlobalId.

## Architecture

### Time-Series Database

High-frequency sensor readings are stored in a dedicated **Time-Series Database (TSDB)**. This is separate from the main PostgreSQL database and optimized for:

- High write throughput (many readings per second from many devices)
- Efficient range queries ("give me all temperature readings from Building A between 08:00 and 18:00 on weekdays")
- Data retention policies

### Real-Time Streaming

The platform uses a **SWR (stale-while-revalidate) caching** strategy to serve the most recent sensor values to the UI without hammering the database on every page load. For near-real-time dashboards, the frontend polls at a configurable interval and updates the visualization when new data arrives.

### Linking Sensors to BIM Elements

Sensors are registered in the database with:

- A **GlobalId** reference to the IFC element they are associated with
- A **data stream identifier** (device ID, API endpoint, or MQTT topic)
- **Units** and value type
- **Location** — either inherited from the linked element or set explicitly as XYZ / lat-lon

This linkage allows you to click any element in the BIM viewer and see its live sensor readings alongside its IFC property sets.

## Visualization

### In the BIM Viewer

When sensor data is linked to a model element, the properties panel shows the current reading next to the element's IFC attributes. Elements can be colored by sensor value — for example, coloring rooms by current temperature to identify hot or cold zones.

### On the Map

Sensor stations with geographic coordinates appear as markers on the map viewer. Clicking a marker opens a popover with the current reading and a mini time-series chart.

### Dashboards

The platform supports chart-based dashboards for portfolio-level analysis: energy consumption across all buildings in a Site, indoor air quality trends over a week, occupancy patterns by floor.

## Example: Carleton Digital Campus

The platform's sensor integration was first developed for the Carleton University Digital Campus project, which connected real-time data to a federated BIM model of 50+ buildings. Applications included:

- **Energy consumption monitoring** — electricity kWh/ft² per building, updated live
- **Building occupancy** — occupancy estimates from sensor networks, visualized on floor plans
- **Parking availability** — real-time parking lot status across campus

This work established the data model and visualization patterns now used in CDT's sensor integration layer.

## Planned Capabilities

- Full IoT device management UI (register, configure, and monitor devices from the platform)
- Alert rules and threshold notifications
- Integration with national environmental datasets (e.g., CIFFC wildfire monitoring, Environment Canada weather)
- Export of time-series data to CSV or API for external analysis
