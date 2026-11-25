---
title: Building a plugin with AI
description: A skill and a short prompt for generating a CDT plugin with an AI coding assistant.
sidebar_position: 8
---

# Building a plugin with AI

A CDT plugin suits an AI coding assistant well: it is small, the interface is narrow, and the build rejects most of the ways it can go wrong. What a model cannot infer from the plugin folder are the platform's constraints, such as the eight capability names and the fixed import list. Without them it invents plausible APIs that do not exist.

## Install the skill

The plugin-authoring skill holds those constraints, the steps from scaffold to a rendering plugin, and how to verify it. An assistant that supports skills loads it by itself whenever a task matches, including follow-up work in a fresh session.

<a href="/resources/plugins/cdt-plugin-authoring/SKILL.md" download="SKILL.md" className="button button--primary">⬇ Download the skill (SKILL.md)</a>

For Claude Code, save it as `.claude/skills/cdt-plugin-authoring/SKILL.md` in your project, or under `~/.claude/skills/` to have it everywhere, then ask for a plugin in plain words or run `/cdt-plugin-authoring <what you want>`. In the Claude apps, upload it as a custom skill. Other assistants can use the same text as a rules file or a system prompt.

## Or use a prompt

Without skills, paste this and fill in the angle brackets:

```text
Write a CDT platform plugin.

What it should do:
  <describe the behaviour>

Where it should appear:
  <e.g. a BIM toolbar tool, plus a sidebar tab listing the results>

Follow the rules in https://docs.collabdt.org/resources/plugins/cdt-plugin-authoring/SKILL.md
before writing any code. Scaffold with npx create-cdt-plugin using explicit flags, then run
npm install and npm run build, and fix anything the import guard reports without editing the
tsup config.
```

If the assistant cannot fetch URLs, paste the skill's text instead, along with [Capabilities](./all-capabilities.md) and [SDK modules](./sdk-modules.md).

## Review before mounting

A plugin runs with the same access as CDT itself, with no sandbox, as [Security](./overview.md#security) explains. The usual reason to trust a plugin is having read it, so review generated code before mounting it anywhere that holds real data.
