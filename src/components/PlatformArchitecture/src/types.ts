import type { CSSProperties, FC } from 'react';

export type FlowKind = 'open' | 'map' | 'unstruct' | 'core';
export type Theme = 'dark' | 'light';

export interface TechChip {
  n: string;
  Logo?: FC<{ s?: number; fg?: string }>;
}

export interface Module {
  name: string;
  items: TechChip[];
}

export interface Node {
  id: string;
  title: string;
  subtitle?: string;
  kind: FlowKind;
  wide?: boolean;
  Icon?: FC<{ s?: number; fg?: string }>;
  header?: TechChip[];
  modules?: Module[];
  tech?: TechChip[];
}

export interface Layer {
  id: string;
  label: string;
  note?: string;
  nodes: Node[];
}

export interface Edge {
  from: string;
  to: string;
  kind: FlowKind;
  style?: 'solid' | 'dashed';
  bidir?: boolean;
  /** Fractional position of the L's horizontal segment along the corridor.
   *  0 = at source edge, 0.5 = middle (default), 1 = at target edge. */
  corner?: number;
  /** Draw a straight vertical through the gap between these two node ids. */
  srcXBetween?: [string, string];
}

export interface PlatformArchitectureProps {
  /** Override detected theme. If omitted, follows html[data-theme]. */
  theme?: Theme;
  layers?: Layer[];
  edges?: Edge[];
  /** Hide the legend sidebar — render just the diagram. */
  bare?: boolean;
  /** Preview mode: hide chrome, disable hover, non-interactive. */
  preview?: boolean;
  className?: string;
  style?: CSSProperties;
}

export type NodeHighlight = 'focus' | 'rel' | 'dim' | undefined;
