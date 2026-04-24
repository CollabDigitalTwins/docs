/**
 * PlatformArchitecture.tsx
 * Collab Digital Twins — full-stack platform architecture diagram.
 *
 * Self-contained React + TypeScript component. Extend by editing the
 * LAYERS / EDGES constants in ./src/data.ts. Edges auto-route orthogonally
 * with rounded corners; hovering a node highlights its neighborhood.
 *
 * File layout under ./src:
 *   types.ts        — FlowKind, Theme, Node, Layer, Edge, …
 *   theme.ts        — THEMES + kindVar / kindSoft / kindName helpers
 *   kindIcons.tsx   — inline SVG node-kind glyphs
 *   techLogos.tsx   — bridge to HomepageFeatures/logos + local adapters
 *   data.ts         — DEFAULT_LAYERS + DEFAULT_EDGES
 *   router.ts       — orthogonal routing (pure function)
 *   LogoChip.tsx    — tech-chip pill
 *   NodeCard.tsx    — card for a single node
 *   LayerRow.tsx    — one layer (label column + node row)
 *   EdgeOverlay.tsx — SVG overlay that draws every edge
 *   Legend.tsx      — collapsible flow-filter legend
 */

import {
  useCallback, useEffect, useMemo, useRef, useState,
  type CSSProperties, type FC,
} from 'react';
import type {
  PlatformArchitectureProps, Theme, FlowKind, NodeHighlight,
} from './src/types';
import { THEMES } from './src/theme';
import { DEFAULT_LAYERS, DEFAULT_EDGES } from './src/data';
import { LayerRow } from './src/LayerRow';
import { EdgeOverlay } from './src/EdgeOverlay';
import { Legend } from './src/Legend';
import PlatformArchitectureMobile from './PlatformArchitectureMobile';

export type {
  FlowKind, Theme, TechChip, Module, Node, Layer, Edge,
  PlatformArchitectureProps,
} from './src/types';
export { DEFAULT_LAYERS, DEFAULT_EDGES } from './src/data';

const MOBILE_BREAKPOINT = 768;

function useIsMobile(): boolean {
  const [isMobile, setIsMobile] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT}px)`);
    const sync = () => setIsMobile(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);
  return isMobile;
}

const PlatformArchitectureDesktop: FC<PlatformArchitectureProps> = ({
  theme: themeProp,
  layers = DEFAULT_LAYERS,
  edges = DEFAULT_EDGES,
  bare = false,
  preview = false,
  className,
  style,
}) => {
  // Auto-sync with Docusaurus color mode (html[data-theme])
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

  const nodeRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const diagramRef = useRef<HTMLDivElement>(null);
  const registerRef = useCallback((id: string, el: HTMLDivElement | null) => {
    nodeRefs.current[id] = el;
  }, []);

  const [hovered, setHovered] = useState<string | null>(null);
  const [filters, setFilters] = useState<Record<FlowKind, boolean>>({
    open: true, map: true, unstruct: true, core: true,
  });

  const nodeStates = useMemo<Record<string, NodeHighlight>>(() => {
    if (!hovered) return {};
    const rel = new Set([hovered]);
    for (const e of edges) {
      if (e.from === hovered) rel.add(e.to);
      if (e.to === hovered) rel.add(e.from);
    }
    const map: Record<string, NodeHighlight> = {};
    for (const L of layers) for (const n of L.nodes) {
      map[n.id] = n.id === hovered ? 'focus' : rel.has(n.id) ? 'rel' : 'dim';
    }
    return map;
  }, [hovered, layers, edges]);

  const filteredEdges = useMemo(
    () => edges.filter(e => filters[e.kind]),
    [edges, filters],
  );

  const themeVars = THEMES[theme] as CSSProperties;
  const showChrome = !bare && !preview;

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
      <section style={{ padding: 0, maxWidth: 1440, margin: '0 auto' }}>
        {showChrome && <Legend filters={filters} setFilters={setFilters} />}
        <div
          ref={diagramRef}
          onMouseLeave={preview ? undefined : () => setHovered(null)}
          style={{
            position: 'relative',
            border: '1px solid var(--stroke)',
            borderRadius: 14,
            background:
              'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
              'repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
              'var(--bg-2)',
            padding: '28px 36px 36px',
            overflow: 'hidden',
            pointerEvents: preview ? 'none' : undefined,
          }}
        >
          <div style={{ position: 'relative', zIndex: 2 }}>
            {layers.map((lay, idx) => (
              <div key={lay.id} style={{ padding: '12px 0' }}>
                <LayerRow
                  layer={lay}
                  nodeStates={nodeStates}
                  onHover={setHovered}
                  onLeave={() => setHovered(null)}
                  registerRef={registerRef}
                  interactive={!preview}
                />
                {idx < layers.length - 1 && (
                  <div style={{
                    height: 1,
                    background: 'linear-gradient(90deg, transparent, var(--stroke) 15%, var(--stroke) 85%, transparent)',
                    margin: '20px 0',
                  }} />
                )}
              </div>
            ))}
          </div>
          <EdgeOverlay
            nodeRefs={nodeRefs}
            edges={filteredEdges}
            containerRef={diagramRef}
            hoveredNode={hovered}
          />
        </div>
      </section>
    </div>
  );
};

const PlatformArchitecture: FC<PlatformArchitectureProps> = (props) => {
  const isMobile = useIsMobile();
  if (isMobile) {
    return <PlatformArchitectureMobile {...props} />;
  }
  return <PlatformArchitectureDesktop {...props} />;
};

export default PlatformArchitecture;
