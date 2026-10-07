import {
  useEffect, useState,
  type CSSProperties, type FC,
} from 'react';
import type {
  PlatformArchitectureProps, Theme, Node as NodeT, Layer as LayerT,
} from './src/types';
import TabCard from '../TabCard';
import { THEMES, kindTabProps } from './src/theme';
import { DEFAULT_LAYERS } from './src/data';
import { LogoChip } from './src/LogoChip';

const MobileNodeCard: FC<{ node: NodeT }> = ({ node }) => {
  const chips: { n: string; Logo?: FC<{ s?: number; fg?: string }> }[] =
    node.tech
      ?? node.header
      ?? node.modules?.flatMap(m => m.items)
      ?? [];

  return (
    <TabCard
      {...kindTabProps(node.kind)}
      size="sm"
      title={node.title}
      subtitle={node.subtitle}
      icon={node.Icon && <node.Icon s={16} />}
    >
      {chips.length > 0 && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {chips.map(c => <LogoChip key={c.n} Logo={c.Logo} label={c.n} size={12} />)}
        </div>
      )}
    </TabCard>
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
              gap: 10,
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
