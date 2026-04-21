import { useLayoutEffect, useRef, type CSSProperties, type FC } from 'react';
import type { Node, NodeHighlight } from './types';
import { kindVar, kindSoft, kindName } from './theme';
import { LogoChip } from './LogoChip';

export const NodeCard: FC<{
  node: Node;
  state: NodeHighlight;
  onHover: (id: string) => void;
  onLeave: () => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  interactive: boolean;
}> = ({ node, state, onHover, onLeave, registerRef, interactive }) => {
  const ref = useRef<HTMLDivElement>(null);
  useLayoutEffect(() => { registerRef(node.id, ref.current); });

  const hlStyle: CSSProperties =
    state === 'focus'
      ? { borderColor: 'var(--primary)', boxShadow: '0 0 0 1px var(--primary), 0 10px 30px -10px rgba(239,145,97,0.35)' }
      : state === 'dim' ? { opacity: 0.35 }
      : state === 'rel' ? { borderColor: 'var(--stroke-2)' }
      : {};

  return (
    <div
      ref={ref}
      data-node-id={node.id}
      data-hl={state}
      onMouseEnter={interactive ? () => onHover(node.id) : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
        border: '1px solid var(--stroke)',
        borderRadius: 10,
        padding: '14px 16px 12px',
        minWidth: node.wide ? 560 : 200,
        flex: node.wide ? '1 1 100%' : '1 1 0',
        boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 8px 24px -14px rgba(0,0,0,0.4)',
        transition: 'transform .18s, box-shadow .18s, border-color .18s, opacity .18s',
        ...hlStyle,
      }}
    >
      {/* Coloured accent bar on the left edge */}
      <div style={{
        position: 'absolute',
        left: -1, top: -1, bottom: -1,
        width: 5,
        borderTopLeftRadius: 10,
        borderBottomLeftRadius: 10,
        background: kindVar(node.kind),
        opacity: 0.95,
      }} />

      {/* Header: icon + title + kind-name badge */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
        {node.Icon && (
          <span style={{
            display: 'inline-flex',
            width: 26, height: 26,
            alignItems: 'center', justifyContent: 'center',
            border: '1px solid var(--stroke)',
            borderRadius: 6,
            background: kindSoft(node.kind),
            color: kindVar(node.kind),
          }}>
            <node.Icon s={16} />
          </span>
        )}
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em' }}>
            {node.title}
          </div>
          {node.subtitle && (
            <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.35, marginTop: 2 }}>
              {node.subtitle}
            </div>
          )}
        </div>
        <span style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 9, letterSpacing: '0.12em',
          color: kindVar(node.kind),
          background: kindSoft(node.kind),
          padding: '3px 6px',
          borderRadius: 4,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {kindName(node.kind)}
        </span>
      </div>

      {/* Optional header chip row */}
      {node.header && (
        <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginTop: 8, marginBottom: 4 }}>
          {node.header.map(h => <LogoChip key={h.n} Logo={h.Logo} label={h.n} size={16} />)}
        </div>
      )}

      {/* Module grid */}
      {node.modules && (
        <div style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${node.modules.length}, minmax(0,1fr))`,
          gap: 8, marginTop: 10,
        }}>
          {node.modules.map(m => (
            <div key={m.name} style={{
              padding: '10px 10px 8px',
              background: 'var(--chip)',
              border: '1px solid var(--stroke)',
              borderRadius: 7,
            }}>
              <div style={{
                fontFamily: 'Geist Mono,monospace',
                fontSize: 9, letterSpacing: '0.1em',
                color: 'var(--text-dim)',
                textTransform: 'uppercase',
                marginBottom: 6,
              }}>
                {m.name}
              </div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
                {m.items.map(i => <LogoChip key={i.n} Logo={i.Logo} label={i.n} size={16} />)}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Tech chip row (when no modules) */}
      {node.tech && !node.modules && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
          {node.tech.map(t => <LogoChip key={t.n} Logo={t.Logo} label={t.n} size={12} />)}
        </div>
      )}
    </div>
  );
};
