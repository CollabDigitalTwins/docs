import type { FC } from 'react';
import type { Layer, NodeHighlight } from './types';
import { NodeCard } from './NodeCard';

export const LayerRow: FC<{
  layer: Layer;
  nodeStates: Record<string, NodeHighlight>;
  onHover: (id: string) => void;
  onLeave: () => void;
  registerRef: (id: string, el: HTMLDivElement | null) => void;
  interactive: boolean;
}> = ({ layer, nodeStates, onHover, onLeave, registerRef, interactive }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: '140px 1fr',
    gap: 32,
    alignItems: 'stretch',
    position: 'relative',
  }}>
    <div style={{ padding: '28px 0', borderRight: '1px dashed var(--stroke)' }}>
      <div style={{
        fontFamily: 'Geist Mono,monospace',
        fontSize: 10, letterSpacing: '0.16em',
        color: 'var(--text-dim)',
        textTransform: 'uppercase',
      }}>
        {layer.label}
      </div>
      {layer.note && (
        <div style={{
          fontSize: 11,
          color: 'var(--text-dim-2)',
          marginTop: 6, lineHeight: 1.4,
          paddingRight: 12,
        }}>
          {layer.note}
        </div>
      )}
    </div>
    <div style={{ padding: '28px 0' }}>
      <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', alignItems: 'stretch' }}>
        {layer.nodes.map(n => (
          <NodeCard
            key={n.id}
            node={n}
            state={nodeStates[n.id]}
            onHover={onHover}
            onLeave={onLeave}
            registerRef={registerRef}
            interactive={interactive}
          />
        ))}
      </div>
    </div>
  </div>
);
