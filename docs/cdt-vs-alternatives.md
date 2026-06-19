---
sidebar_position: 98
title: CDT vs Alternatives
description: When to choose CDT over commercial digital twin platforms — and when one of them is the better fit.
---

# CDT vs Alternatives

CDT is one of several platforms in the digital twin space. This page describes how it compares to common alternatives and where each one fits best, so you can make an informed choice rather than discover the trade-offs after committing.

## At a glance

| | **CDT** | **Digital Twin Britain** | **Virtual Singapore** | **ArcGIS / Esri** | **Autodesk Tandem** |
|---|---|---|---|---|---|
| **Source** | Open source | Government-led | Government-led | Commercial | Commercial |
| **Data ownership** | You own it; open formats | Government-owned | Government-owned | Vendor + customer | Vendor + customer |
| **Deployment** | Self-host or managed | Centralized | Centralized | Hosted or on-prem | Hosted |
| **Standards** | IFC, GeoJSON, LAS, BCF, IDS | Mixed | Mixed | OGC + Esri formats | IFC import |
| **BIM viewer** | That Open Engine (open) | Limited | Limited | Limited | Native |
| **Map viewer** | MapLibre + open data | Yes | Yes | ArcGIS | None |
| **Point clouds** | Potree (open) | No | Yes | Limited | Limited |
| **Plugin system** | Yes — runtime extension | No | No | Esri SDKs | Limited |
| **Cost** | Free; pay for hosting | N/A | N/A | License fees | Subscription |

## When to choose CDT

CDT is the better choice when **any** of these are true:

- **You need open-source software.** The codebase is public and forkable. There is no vendor that can pull access or change pricing.
- **Data sovereignty matters.** You can self-host on infrastructure you control, in the jurisdiction you require. The hosted offering runs in Canada.
- **You want to combine BIM, GIS, and point clouds in one viewport.** Most platforms specialize in one or two; CDT integrates all three with a shared coordinate system.
- **You want to extend the platform.** The [plugin system](./plugins/overview.md) lets you ship new tools, viewers, and capabilities without forking the codebase.
- **Your data is in open standards already.** IFC, GeoJSON, LAS, BCF, and IDS are first-class. Proprietary formats are not.
- **You need to integrate Canadian open data.** The federated catalogue covers federal, provincial, and municipal portals out of the box.

## When an alternative is the better fit

CDT is **not** the right choice when:

- **You need a BIM authoring environment.** CDT is a federation and visualization layer. Use Revit, Archicad, or Tekla for authoring, then bring the IFC into CDT.
- **You need a desktop GIS.** Use QGIS or ArcGIS Pro for editing and analysis, then publish results to CDT for collaboration and consumption.
- **You require a fully managed centralized service** of the kind Esri or Autodesk provide, with vendor support contracts and 24/7 SLAs. CDT Hosted is a step in that direction but is smaller in scope.
- **You depend on a specific vendor ecosystem.** If you have heavy investment in ArcGIS extensions or Autodesk Construction Cloud, integrating CDT is possible but is not the path of least resistance.

## Common evaluation questions

**Does CDT replace Revit or ArcGIS?** No. It complements them. Authoring stays in those tools; CDT consumes their outputs and adds federation, web access, and collaboration.

**Can I migrate off CDT later?** Yes. All data is in open formats — IFC, GeoJSON, LAS — and can be exported in bulk. There is no proprietary lock-in.

**Does CDT support [feature X from a commercial product]?** Often, but not always. Check the relevant guide and the [GitHub roadmap](https://github.com/CollabDigitalTwins/core/milestones). If a feature is missing and broadly useful, file an issue. If it is narrow, consider a [plugin](./plugins/overview.md).

**Is CDT production-ready?** Yes for federation, visualization, and collaboration use cases. Some advanced features (full IoT device management, alert rules, runtime plugin loading) are still on the roadmap — see the [Changelog](./changelog.md) for what is shipped.

## Get help deciding

If you want a recommendation tailored to your situation, reach out via [collabdt.org/home#contact](https://collabdt.org/home#contact). We will be honest about whether CDT is the right tool for your problem.

## Related

- [Introduction](./introduction.md)
- [Concepts → What is a Digital Twin?](./concepts/digital-twins.mdx)
- [Plugins overview](./plugins/overview.md)
