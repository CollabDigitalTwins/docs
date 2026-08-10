---
title: Installing and enabling plugins
description: How the extensions page works — who can make a plugin available, who chooses whether it runs, and how the two combine.
sidebar_position: 6
category: plugins
status: draft
last_updated: 2026-08-06
---

# Installing and enabling plugins

A plugin being present in CDT does not mean it runs. Two decisions sit between the code and your screen, and they belong to different people.

Both are made on the **Extensions** page in the sidebar.

## The two levels

| Level | The question it answers | Who decides |
|---|---|---|
| Organization | May this plugin be used here at all, and is it on by default? | An administrator |
| Personal | Do I want it running for me? | Each person |

The split is deliberate. A plugin runs with the same access as CDT itself, so admitting one is an administrative act. Choosing whether to *use* something already admitted is a personal one.

## What an administrator sees

Three switches per plugin:

- **Available here** — add the plugin to this organization, or remove it
- **On by default** — do people get it without asking
- **Let people choose** — may individuals override the default for themselves

Together these give four arrangements:

| Available | On by default | Let people choose | Result |
|---|---|---|---|
| Yes | Yes | Yes | On for everyone, anyone can opt out |
| Yes | Yes | No | Mandatory — everyone gets it, nobody can turn it off |
| Yes | No | Yes | Off by default, available to anyone who wants it |
| Yes | No | No | Effectively unavailable |
| No | — | — | Not available to anyone |

## What everyone else sees

One switch: **Run this for me**. If the administrator turned off *let people choose*, an explanation appears instead.

A **Viewer** account sees the list and nothing else — no switches, not even a personal one. The role is read-only throughout CDT, and that extends to which plugins run. The page says so explicitly rather than implying an administrator locked something.

## The rule that never bends

**A personal choice can never switch on a plugin the organization has not made available.**

A setting for a plugin that was never added is ignored, not honoured. This is what keeps the organization the gatekeeper of which code runs, and it holds regardless of what is stored against a user.

## Reading a plugin card

| Badge | Meaning |
|---|---|
| **Running** | Loaded and contributing right now |
| **Not running for you** | Available, switched off for you |
| **Failed to load** | Something went wrong; the reason is shown on the card |
| **Not added** | Present in this CDT, not yet added to your organization |

Each card also lists what the plugin **adds** — `map.tools`, `bim.tools` and so on — with an icon showing which part of CDT it touches.

### When a plugin fails

The card turns red and shows the actual error, plus a plain-language explanation. A common one:

> Plugin "sensor-heatmap" targets plugin host API 2, but this version of @collabdt/core provides 1

That means the plugin was built for a newer CDT. Nothing else is affected — the other plugins load normally. Either update CDT, or ask the author for a build targeting your version.

## Adding a plugin

Plugins that exist in your CDT but have not been added appear under **Found on this server**, visible only to someone who can install. Before adding, the card shows:

- where the plugin was found
- what access it is asking for
- a reminder that a plugin runs with the same access as CDT itself, so only add code you trust

Clicking **Add to organization** makes it available and turns it on. No database access needed.

## Settings

A plugin can declare settings in its manifest. An administrator sets them for the organization; individuals can override them for themselves where the plugin allows it. A personal value replaces the organization's for that setting, leaving the others alone.

## Where this is stored

Three tables:

- `PluginInstallation` — the organization's decisions
- `PluginUserSetting` — each person's own choice and overrides
- `PluginRecord` — a namespaced place for a plugin to keep its own data

Removing a plugin from an organization **does not delete what it stored.** An administrator turning something off to try it out should not irrecoverably destroy the data behind it; re-adding the plugin picks its records back up.

## Permissions

| | Admin | User | Viewer |
|---|---|---|---|
| See the extensions page | Yes | Yes | Yes |
| Add or remove a plugin | Yes | No | No |
| Change the default, or lock the choice | Yes | No | No |
| Turn a plugin on or off for themselves | Yes | Yes | **No** |

Hiding a control is presentation only. Every change is re-checked on the server, and the personal-settings endpoint takes your identity from your session rather than from the request — so a crafted request gets refused, not somebody else's settings.
