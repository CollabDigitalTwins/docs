import type { FlowKind, Theme } from './types';

/* ── THEME TOKENS ──────────────────────────────────────────────
   Bind to the docs sovereign palette (--hp-* from custom.css).
   Dark / light switches automatically with html[data-theme].
   Only flow-kind colors (c-open etc.) stay per-mode.
   ────────────────────────────────────────────────────────────── */
const SHARED_VARS: Record<string, string> = {
  '--bg': 'var(--hp-surface)',
  '--bg-2': 'var(--hp-low)',
  '--panel': 'var(--hp-mid)',
  '--panel-2': 'var(--hp-high)',
  '--stroke': 'var(--hp-outline-variant)',
  '--stroke-2': 'var(--hp-outline)',
  '--text': 'var(--hp-on-surface)',
  '--text-dim': 'var(--hp-on-surface-variant)',
  '--text-dim-2': 'var(--hp-outline)',
  '--primary': 'var(--hp-primary-container)',
  '--primary-soft': 'color-mix(in srgb, var(--hp-primary-container) 14%, transparent)',
  '--primary-line': 'color-mix(in srgb, var(--hp-primary-container) 55%, transparent)',
  '--chip': 'color-mix(in srgb, var(--hp-on-surface) 3%, transparent)',
  '--grid': 'color-mix(in srgb, var(--hp-on-surface) 4%, transparent)',
  '--c-open-soft': 'color-mix(in srgb, var(--c-open) 14%, transparent)',
  '--c-map-soft': 'color-mix(in srgb, var(--c-map) 14%, transparent)',
  '--c-unstruct-soft': 'color-mix(in srgb, var(--c-unstruct) 14%, transparent)',
  '--c-core-soft': 'color-mix(in srgb, var(--hp-on-surface) 5%, transparent)',
};

export const THEMES: Record<Theme, Record<string, string>> = {
  dark: {
    ...SHARED_VARS,
    '--c-open': '#EF9161',
    '--c-map': '#7FC4C4',
    '--c-unstruct': '#B79CE0',
    '--c-core': '#8A8680',
    '--logo-bg': '#fff',
  },
  light: {
    ...SHARED_VARS,
    '--c-open': '#EF9161',
    '--c-map': '#5AA0A0',
    '--c-unstruct': '#8C6EC8',
    '--c-core': '#7A756F',
    '--logo-bg': '#F5ECE0',
  },
};

export const kindVar = (k: FlowKind) => `var(--c-${k})`;
export const kindSoft = (k: FlowKind) => `var(--c-${k}-soft)`;
export const kindName = (k: FlowKind): string =>
  ({ open: 'Open', map: 'Map', unstruct: 'Files', core: 'Core' }[k]);
