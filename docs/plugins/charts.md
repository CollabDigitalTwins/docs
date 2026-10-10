---
title: Charts
description: Draw charts in a plugin with the platform's own Recharts and chart styling, from @collabdt/core/plugins-sdk/charts.
sidebar_position: 10
---

# Charts

`@collabdt/core/plugins-sdk/charts` gives a plugin the charts the rest of the CDT platform draws: the shadcn chart wrappers, styled to match the app in light and dark mode, and the Recharts primitives they wrap. Import them from there rather than installing `recharts`, so the plugin shares the platform's single copy instead of bundling its own.

```tsx
import {
  Bar, BarChart, CartesianGrid, ChartContainer, ChartLegend, ChartLegendContent,
  ChartTooltip, ChartTooltipContent, XAxis, YAxis,
} from '@collabdt/core/plugins-sdk/charts'
import type { ChartConfig } from '@collabdt/core/plugins-sdk/charts'

const config: ChartConfig = {
  office:  { label: 'Office',  color: '#4f9d69' },
  meeting: { label: 'Meeting', color: '#e0a03a' },
}

export function BookedHours({ data }: { data: Array<{ day: string, office: number, meeting: number }> }) {
  return (
    <ChartContainer config={config} style={{ height: 260 }}>
      <BarChart data={data} accessibilityLayer>
        <CartesianGrid vertical={false} />
        <XAxis dataKey="day" tickLine={false} axisLine={false} />
        <YAxis tickLine={false} axisLine={false} width={32} />
        <ChartTooltip content={<ChartTooltipContent />} />
        <ChartLegend content={<ChartLegendContent />} />
        <Bar dataKey="office" stackId="uses" fill="var(--color-office)" />
        <Bar dataKey="meeting" stackId="uses" fill="var(--color-meeting)" radius={[4, 4, 0, 0]} />
      </BarChart>
    </ChartContainer>
  )
}
```

## What it exports

| Kind | Exports |
|---|---|
| Wrappers | `ChartContainer`, `ChartTooltip`, `ChartTooltipContent`, `ChartLegend`, `ChartLegendContent`, and the `ChartConfig` type |
| Charts | `AreaChart`, `BarChart`, `LineChart`, `PieChart` |
| Series and parts | `Area`, `Bar`, `Line`, `Pie`, `Cell`, `CartesianGrid`, `XAxis`, `YAxis`, `ResponsiveContainer` |

That is the whole list. Anything else from Recharts is not available to a plugin.

## How the wrappers fit together

- **`ChartContainer` takes a `config`**, keyed by data key, giving each series a `label` and either a `color` or, when a series needs its own step on the dark surface, a `theme: { light, dark }`. It sets `--color-<key>` on itself, which is what `fill="var(--color-office)"` reads, and it is where the tooltip and legend find their labels.
- **Give `ChartContainer` a height.** It is responsive and fills its width; without a height or a class that sets one, it falls back to a 16:9 box.
- **`ChartTooltip` and `ChartLegend` take their content as an element**, `content={<ChartTooltipContent />}`, as in Recharts.
- **`ChartLegendContent` wraps** onto further lines when the series do not fit, and truncates a long label, showing it in full on hover.

## Loaded on first use

The module is lazy. The platform does not load Recharts with the page: it fetches it the first time a plugin imports `@collabdt/core/plugins-sdk/charts`, so a deployment where no plugin draws a chart never downloads it. Nothing changes in the plugin's code; the import is an ordinary static one.

## Types

The Recharts components are typed loosely, as components taking any props, so that a plugin can typecheck without installing Recharts. The compiler therefore does not catch a misspelt prop; check the [Recharts documentation](https://recharts.org/en-US/api) for each component's props. The prop types are in `@collabdt/plugin-kit/types/charts`, and `ChartConfig` comes from the module itself.

On a CDT platform version that does not publish this module, a plugin fails at the import, see [What a plugin can import](./mounting-a-plugin.md#what-a-plugin-can-import).
