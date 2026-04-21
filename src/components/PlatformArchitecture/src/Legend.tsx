import { useState, type Dispatch, type FC, type SetStateAction } from 'react';
import type { FlowKind } from './types';
import { kindVar } from './theme';

export const Legend: FC<{
  filters: Record<FlowKind, boolean>;
  setFilters: Dispatch<SetStateAction<Record<FlowKind, boolean>>>;
}> = ({ filters, setFilters }) => {
  const [open, setOpen] = useState(true);

  const Chip = ({ k, label }: { k: FlowKind; label: string }) => (
    <button
      onClick={() => setFilters(s => ({ ...s, [k]: !s[k] }))}
      style={{
        display: 'inline-flex', alignItems: 'center', gap: 8,
        padding: '6px 10px', borderRadius: 999,
        background: filters[k] ? 'var(--chip)' : 'transparent',
        border: '1px solid ' + (filters[k] ? 'var(--stroke-2)' : 'var(--stroke)'),
        color: filters[k] ? 'var(--text)' : 'var(--text-dim-2)',
        cursor: 'pointer', fontFamily: 'inherit', fontSize: 12, whiteSpace: 'nowrap',
      }}
    >
      <svg width="20" height="8">
        <line x1="1" y1="4" x2="19" y2="4"
          stroke={kindVar(k)} strokeWidth={2}
          opacity={filters[k] ? 1 : 0.3} />
      </svg>
      <span>{label}</span>
    </button>
  );

  return (
    <div style={{
      border: '1px dashed var(--stroke-2)',
      borderRadius: 10,
      background: 'var(--chip)',
      marginBottom: 16,
      overflow: 'hidden',
    }}>
      <button
        onClick={() => setOpen(o => !o)}
        aria-expanded={open}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
          width: '100%', padding: '10px 14px',
          background: 'transparent', border: 'none',
          color: 'var(--text)',
          cursor: 'pointer', fontFamily: 'inherit', textAlign: 'left',
        }}
      >
        <span style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{
            fontFamily: 'Geist Mono,monospace',
            fontSize: 10, letterSpacing: '0.14em',
            color: 'var(--text-dim)',
          }}>
            LEGEND
          </span>
          <span style={{ fontSize: 11, color: 'var(--text-dim-2)' }}>
            {open ? 'Click a flow to filter the diagram' : 'Filter flows'}
          </span>
        </span>
        <svg width="12" height="12" viewBox="0 0 12 12" aria-hidden
          style={{
            transform: open ? 'rotate(180deg)' : 'rotate(0deg)',
            transition: 'transform .15s',
            color: 'var(--text-dim)',
          }}
        >
          <path d="M2 4 L6 8 L10 4" stroke="currentColor" strokeWidth="1.6"
            fill="none" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {open && (
        <div style={{
          padding: '10px 14px 14px',
          borderTop: '1px solid var(--stroke)',
          display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 8,
        }}>
          <Chip k="open" label="Open Data" />
          <Chip k="map" label="Map Data" />
          <Chip k="unstruct" label="Unstructured" />
          <Chip k="core" label="Core / Primary" />
        </div>
      )}
    </div>
  );
};
