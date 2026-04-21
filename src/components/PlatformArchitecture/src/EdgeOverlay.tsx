import React, {
  useCallback, useEffect, useId, useLayoutEffect, useRef, useState,
  type FC,
} from 'react';
import type { Edge, FlowKind } from './types';
import { kindVar } from './theme';
import { computePaths, type RoutedEdge } from './router';

export const EdgeOverlay: FC<{
  nodeRefs: React.MutableRefObject<Record<string, HTMLDivElement | null>>;
  edges: Edge[];
  containerRef: React.RefObject<HTMLDivElement | null>;
  hoveredNode: string | null;
}> = ({ nodeRefs, edges, containerRef, hoveredNode }) => {
  const idPrefix = useId().replace(/[^a-zA-Z0-9_-]/g, 'm');
  const markerId = (k: FlowKind) => `${idPrefix}-arr-${k}`;

  const [paths, setPaths] = useState<RoutedEdge[]>([]);
  const [size, setSize] = useState({ w: 0, h: 0 });

  const recalc = useCallback(() => {
    const c = containerRef.current;
    if (!c) return;
    const cr = c.getBoundingClientRect();
    setSize({ w: cr.width, h: cr.height });
    setPaths(computePaths(edges, nodeRefs.current, cr));
  }, [edges, nodeRefs, containerRef]);

  useLayoutEffect(() => { recalc(); }, [recalc]);

  useEffect(() => {
    recalc();
    const ro = new ResizeObserver(() => recalc());
    if (containerRef.current) ro.observe(containerRef.current);
    Object.values(nodeRefs.current).forEach(n => { if (n) ro.observe(n); });
    const mo = new MutationObserver(() => recalc());
    if (containerRef.current) {
      mo.observe(containerRef.current, { subtree: true, childList: true });
    }
    const onW = () => recalc();
    window.addEventListener('resize', onW);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener('resize', onW);
    };
  }, [recalc, containerRef, nodeRefs]);

  const isRel = (p: Edge) =>
    hoveredNode ? (p.from === hoveredNode || p.to === hoveredNode) : false;
  const anyHover = !!hoveredNode;

  return (
    <svg
      width={size.w} height={size.h}
      style={{ position: 'absolute', inset: 0, pointerEvents: 'none', zIndex: 1, overflow: 'visible' }}
    >
      <defs>
        {(['open', 'map', 'unstruct', 'core'] as FlowKind[]).map(k => (
          <React.Fragment key={k}>
            <marker id={markerId(k)} viewBox="0 0 10 10" refX="9" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 0 0 L 10 5 L 0 10 z" fill={kindVar(k)} />
            </marker>
            <marker id={`${markerId(k)}-s`} viewBox="0 0 10 10" refX="1" refY="5"
              markerWidth="5" markerHeight="5" orient="auto">
              <path d="M 10 0 L 0 5 L 10 10 z" fill={kindVar(k)} />
            </marker>
          </React.Fragment>
        ))}
      </defs>
      {paths.map(p => {
        const rel = isRel(p);
        const stroke = kindVar(p.kind);
        const opacity = anyHover ? (rel ? 1 : 0.18) : (p.kind === 'core' ? 0.7 : 0.92);
        const width = rel ? 2.4 : 1.6;
        const bidir = p.bidir !== false;
        return (
          <path
            key={p.id} d={p.d} fill="none"
            stroke={stroke} strokeWidth={width}
            strokeDasharray={p.style === 'dashed' ? '5 4' : undefined}
            opacity={opacity}
            markerEnd={`url(#${markerId(p.kind)})`}
            markerStart={bidir ? `url(#${markerId(p.kind)}-s)` : undefined}
            style={{ transition: 'opacity .15s, stroke-width .15s' }}
          />
        );
      })}
    </svg>
  );
};
