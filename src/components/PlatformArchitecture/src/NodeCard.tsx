import { useLayoutEffect, useRef, type CSSProperties, type FC } from 'react';
import type { Node, NodeHighlight } from './types';
import TabCard from '../../TabCard';
import { kindTabProps } from './theme';
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

  const hlStyle = (
    state === 'focus'
      ? { '--tc-border': 'var(--primary)', '--tc-surface': 'var(--panel-2)' }
      : state === 'dim' ? { opacity: 0.35 }
      : state === 'rel' ? { '--tc-border': 'var(--stroke-2)' }
      : {}
  ) as CSSProperties;

  return (
    <TabCard
      ref={ref}
      {...kindTabProps(node.kind)}
      size="sm"
      title={node.title}
      subtitle={node.subtitle}
      icon={node.Icon && <node.Icon s={16} />}
      data-node-id={node.id}
      data-hl={state}
      onMouseEnter={interactive ? () => onHover(node.id) : undefined}
      onMouseLeave={interactive ? onLeave : undefined}
      style={{
        minWidth: node.wide ? 560 : 200,
        flex: node.wide ? '1 1 100%' : '1 1 0',
        ...hlStyle,
      }}
    >
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
          gridTemplateColumns: `repeat(${node.modules.length}, auto)`,
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
    </TabCard>
  );
};
