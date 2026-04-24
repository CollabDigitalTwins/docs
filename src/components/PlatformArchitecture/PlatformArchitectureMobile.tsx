import {
  useEffect, useState,
  type CSSProperties, type FC,
} from 'react';
import type {
  PlatformArchitectureProps, Theme, Node as NodeT, Layer as LayerT,
} from './src/types';
import { THEMES, kindSoft, kindName, kindVar } from './src/theme';
import { DEFAULT_LAYERS } from './src/data';
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


const PlatformArchitectureMobile: FC<PlatformArchitectureProps> = ({
  theme: themeProp,
  layers = DEFAULT_LAYERS,
  bare: _bare = false,
  preview = false,
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

  return (
    <div
      className={className}
      style={{
        ...(themeVars as any),
        color: 'var(--text)',
        fontFamily: 'Geist, system-ui, sans-serif',
        pointerEvents: preview ? 'none' : undefined,
        ...style,
      }}
    >
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
              <div style={{ height: 12 }} />
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default PlatformArchitectureMobile;
