/**
 * PlatformArchitectureMobile.tsx
 * Compact, vertically-stacked version of the platform diagram for small screens.
 *
 * Uses the same DEFAULT_LAYERS / DEFAULT_EDGES data source so it stays in sync
 * with the desktop diagram. Drops the SVG edge overlay (which relies on absolute
 * geometry that breaks at narrow widths) and the module grid — each node collapses
 * to: kind bar + icon + title + tech chips. Edges are reduced to a single
 * flow-colored connector pip between layers so the reader still sees the path
 * without horizontal scrolling.
 */

import {
  useEffect, useMemo, useState,
  type CSSProperties, type FC,
} from 'react';
import type {
  PlatformArchitectureProps, Theme, FlowKind, Node as NodeT, Layer as LayerT,
} from './src/types';
import { THEMES, kindVar, kindSoft, kindName } from './src/theme';
import { DEFAULT_LAYERS, DEFAULT_EDGES } from './src/data';
import { LogoChip } from './src/LogoChip';

const MobileNodeCard: FC<{ node: NodeT }> = ({ node }) => {
  const chips: { n: string; Logo?: FC<{ s?: number; fg?: string }> }[] =
    node.tech
      ?? node.header
      ?? node.modules?.flatMap(m => m.items)
      ?? [];

  return (
    <div style={{
      position: 'relative',
      background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
      border: '1px solid var(--stroke)',
      borderRadius: 9,
      padding: '10px 12px 10px 14px',
      boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
    }}>
      <div style={{
        position: 'absolute',
        left: -1, top: -1, bottom: -1,
        width: 4,
        borderTopLeftRadius: 9,
        borderBottomLeftRadius: 9,
        background: kindVar(node.kind),
        opacity: 0.95,
      }} />

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: chips.length ? 6 : 0 }}>
        {node.Icon && (
          <span style={{
            display: 'inline-flex',
            width: 22, height: 22,
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--stroke)',
            borderRadius: 5,
            background: kindSoft(node.kind),
            color: kindVar(node.kind),
            flexShrink: 0,
          }}>
            <node.Icon s={13} />
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 12.5, fontWeight: 600, letterSpacing: '-0.01em', lineHeight: 1.25 }}>
            {node.title}
          </div>
          {node.subtitle && (
            <div style={{
              fontSize: 10.5,
              color: 'var(--text-dim)',
              lineHeight: 1.3,
              marginTop: 2,
              overflow: 'hidden',
              textOverflow: 'ellipsis',
            }}>
              {node.subtitle}
            </div>
          )}
        </div>
        <span style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 8, letterSpacing: '0.1em',
          color: kindVar(node.kind),
          background: kindSoft(node.kind),
          padding: '2px 5px',
          borderRadius: 3,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
          flexShrink: 0,
        }}>
          {kindName(node.kind)}
        </span>
      </div>

      {chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {chips.map(c => <LogoChip key={c.n} Logo={c.Logo} label={c.n} size={12} />)}
        </div>
      )}
    </div>
  );
};

const LayerConnectors: FC<{ kinds: FlowKind[] }> = ({ kinds }) => {
  if (!kinds.length) return null;
  return (
    <div style={{
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      gap: 4,
      padding: '6px 0',
    }}>
      {kinds.map((k, i) => (
        <span key={`${k}-${i}`} style={{
          display: 'inline-block',
          width: 2,
          height: 18,
          background: kindVar(k),
          borderRadius: 1,
          opacity: 0.85,
        }} />
      ))}
    </div>
  );
};

const PlatformArchitectureMobile: FC<PlatformArchitectureProps> = ({
  theme: themeProp,
  layers = DEFAULT_LAYERS,
  edges = DEFAULT_EDGES,
  className,
  style,
}) => {
  const [detectedTheme, setDetectedTheme] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () => setDetectedTheme(
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    );
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, {
      attributes: true,
      attributeFilter: ['data-theme'],
    });
    return () => mo.disconnect();
  }, []);
  const theme: Theme = themeProp ?? detectedTheme;
  const themeVars = THEMES[theme] as CSSProperties;

  const [filters, setFilters] = useState<Record<FlowKind, boolean>>({
    open: true, map: true, unstruct: true, core: true,
  });

  const connectorsBetween = useMemo(() => {
    const byLayer: Record<string, FlowKind[]> = {};
    const nodeToLayerIdx = new Map<string, number>();
    layers.forEach((L, i) => L.nodes.forEach(n => nodeToLayerIdx.set(n.id, i)));

    for (const e of edges) {
      if (!filters[e.kind]) continue;
      const fi = nodeToLayerIdx.get(e.from);
      const ti = nodeToLayerIdx.get(e.to);
      if (fi == null || ti == null) continue;
      const lo = Math.min(fi, ti);
      const hi = Math.max(fi, ti);
      for (let g = lo; g < hi; g++) {
        const key = String(g);
        (byLayer[key] ||= []);
        if (!byLayer[key].includes(e.kind)) byLayer[key].push(e.kind);
      }
    }
    return byLayer;
  }, [layers, edges, filters]);

  const FilterChip: FC<{ k: FlowKind; label: string }> = ({ k, label }) => (
    <button
      onClick={() => setFilters(s => ({ ...s, [k]: !s[k] }))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 6,
        padding: '4px 8px', borderRadius: 999,
        background: filters[k] ? 'var(--chip)' : 'transparent',
        border: '1px solid ' + (filters[k] ? 'var(--stroke-2)' : 'var(--stroke)'),
        color: filters[k] ? 'var(--text)' : 'var(--text-dim-2)',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 10.5, whiteSpace: 'nowrap',
      }}
    >
      <span style={{
        width: 10, height: 2, borderRadius: 1,
        background: kindVar(k),
        opacity: filters[k] ? 1 : 0.3,
      }} />
      {label}
    </button>
  );

  return (
    <div
      className={className}
      style={{
        ...(themeVars as any),
        color: 'var(--text)',
        fontFamily: 'Geist, system-ui, sans-serif',
        ...style,
      }}
    >
      <div style={{
        border: '1px dashed var(--stroke-2)',
        borderRadius: 8,
        background: 'var(--chip)',
        padding: '8px 10px',
        marginBottom: 12,
        display: 'flex',
        flexWrap: 'wrap',
        gap: 6,
        alignItems: 'center',
      }}>
        <span style={{
          fontFamily: 'Geist Mono,monospace',
          fontSize: 9, letterSpacing: '0.14em',
          color: 'var(--text-dim)',
          marginRight: 4,
        }}>
          FLOWS
        </span>
        <FilterChip k="open" label="Open" />
        <FilterChip k="map" label="Map" />
        <FilterChip k="unstruct" label="Files" />
        <FilterChip k="core" label="Core" />
      </div>

      <div style={{
        border: '1px solid var(--stroke)',
        borderRadius: 12,
        background: 'var(--bg-2)',
        padding: '14px 12px',
      }}>
        {layers.map((lay: LayerT, idx) => (
          <div key={lay.id}>
            <div style={{ marginBottom: 8 }}>
              <div style={{
                fontFamily: 'Geist Mono,monospace',
                fontSize: 9, letterSpacing: '0.16em',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
              }}>
                {lay.label}
              </div>
              {lay.note && (
                <div style={{
                  fontSize: 10.5,
                  color: 'var(--text-dim-2)',
                  marginTop: 2,
                  lineHeight: 1.35,
                }}>
                  {lay.note}
                </div>
              )}
            </div>

            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr',
              gap: 8,
            }}>
              {lay.nodes.map(n => <MobileNodeCard key={n.id} node={n} />)}
            </div>

            {idx < layers.length - 1 && (
              <LayerConnectors kinds={connectorsBetween[String(idx)] ?? []} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformArchitectureMobile;
