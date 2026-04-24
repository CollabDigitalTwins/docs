import { useEffect, useState, type CSSProperties, type FC } from 'react';
import type { Theme, FlowKind } from '../PlatformArchitecture/src/types';
import { THEMES, kindVar, kindSoft, kindName } from '../PlatformArchitecture/src/theme';

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

/* ── Shared card — mirrors NodeCard exactly ────────────────── */
const Card: FC<{
  title: string;
  sub: string;
  kind: FlowKind;
  hub?: boolean;
  highlight?: boolean;
  chips?: string[];
  wide?: boolean;
}> = ({ title, sub, kind, hub, highlight, chips, wide }) => (
  <div style={{
    position: 'relative',
    background: hub
      ? `linear-gradient(180deg, color-mix(in srgb, ${kindVar(kind)} 12%, var(--panel)), var(--panel-2))`
      : highlight
      ? 'linear-gradient(180deg, var(--primary-soft), var(--panel-2))'
      : 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    border: `1px solid ${hub
      ? `color-mix(in srgb, ${kindVar(kind)} 60%, var(--stroke))`
      : highlight
      ? 'var(--primary-line)'
      : 'var(--stroke)'}`,
    borderRadius: 10,
    padding: chips ? '11px 13px 11px 16px' : '10px 13px 10px 16px',
    width: wide ? '100%' : undefined,
    boxShadow: hub
      ? `0 0 22px color-mix(in srgb, ${kindVar(kind)} 16%, transparent), 0 1px 0 rgba(255,255,255,0.02) inset`
      : '0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 12px -8px rgba(0,0,0,0.35)',
  }}>
    {/* left accent bar */}
    <div style={{
      position: 'absolute',
      left: -1, top: -1, bottom: -1, width: 4,
      borderTopLeftRadius: 10,
      borderBottomLeftRadius: 10,
      background: kindVar(kind),
      opacity: 0.95,
    }} />

    {/* HUB badge */}
    {hub && (
      <div style={{
        position: 'absolute',
        top: -9, left: '50%', transform: 'translateX(-50%)',
        background: kindVar(kind),
        color: 'var(--bg)',
        fontSize: 8.5, fontWeight: 800, letterSpacing: '1.5px',
        padding: '1px 7px', borderRadius: 3,
        whiteSpace: 'nowrap',
        fontFamily: 'Geist Mono, ui-monospace, monospace',
      }}>
        HUB
      </div>
    )}

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
          color: 'var(--text)', lineHeight: 1.3, marginBottom: 3,
          fontFamily: 'Geist Mono, ui-monospace, monospace',
        }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.45 }}>
          {sub}
        </div>
      </div>
      <span style={{
        fontFamily: 'Geist Mono, ui-monospace, monospace',
        fontSize: 8.5, letterSpacing: '0.12em',
        color: kindVar(kind),
        background: kindSoft(kind),
        padding: '2px 5px', borderRadius: 4,
        textTransform: 'uppercase',
        whiteSpace: 'nowrap', flexShrink: 0, marginTop: 1,
      }}>
        {kindName(kind)}
      </span>
    </div>

    {chips && chips.length > 0 && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
        {chips.map(c => (
          <span key={c} style={{
            display: 'inline-flex', alignItems: 'center', gap: 5,
            padding: '2px 7px 2px 5px',
            background: 'var(--chip)',
            border: '1px solid var(--stroke)',
            borderRadius: 5,
            fontSize: 10.5,
            fontFamily: 'Geist Mono, ui-monospace, monospace',
            color: 'var(--text)',
            whiteSpace: 'nowrap',
          }}>
            <span style={{ width: 5, height: 5, borderRadius: 2, background: 'var(--text-dim-2)', flexShrink: 0 }} />
            {c}
          </span>
        ))}
      </div>
    )}
  </div>
);

/* ── Zone wrapper box (dashed border rectangle) ──────────── */
const ZoneBox: FC<{
  label: string;
  kind: FlowKind;
  children: React.ReactNode;
  style?: CSSProperties;
}> = ({ label, kind, children, style }) => (
  <div style={{
    border: `1px dashed color-mix(in srgb, ${kindVar(kind)} 40%, var(--stroke))`,
    borderRadius: 10,
    padding: '12px 14px 14px',
    background: kindSoft(kind),
    ...style,
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 9, letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: kindVar(kind),
      marginBottom: 12,
    }}>
      {label}
    </div>
    {children}
  </div>
);

/* ── Vertical tick connector inside framework column ───────── */
const FTick: FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0' }}>
    <div style={{ width: 1, height: 10, background: 'var(--stroke)' }} />
    <svg width="8" height="6" viewBox="0 0 8 6">
      <path d="M0 0 L4 5 L8 0 z" fill="var(--stroke)" opacity="0.6" />
    </svg>
  </div>
);

/* ── Horizontal arrow (desktop between zones and Host) ─────── */
const HArrow: FC<{ label: string; direction: 'right' | 'left' }> = ({ label, direction }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: '0 4px',
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 8, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-dim-2)',
      textAlign: 'center', lineHeight: 1.5,
      whiteSpace: 'pre',
    }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%' }}>
      {direction === 'left' && (
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }}>
          <path d="M7 0 L0 6 L7 12 z" fill="var(--primary)" />
        </svg>
      )}
      <div style={{ flex: 1, height: 1.5, background: 'var(--primary-line)' }} />
      {direction === 'right' && (
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }}>
          <path d="M0 0 L7 6 L0 12 z" fill="var(--primary)" />
        </svg>
      )}
    </div>
  </div>
);

/* ── Mobile downward / upward arrow ─────────────────────────── */
const VArrow: FC<{ label: string; direction?: 'down' | 'up' }> = ({ label, direction = 'down' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '10px 0', gap: 5,
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--text-dim-2)',
    }}>
      {label}
    </div>
    {direction === 'up' && (
      <svg width="10" height="7" viewBox="0 0 10 7">
        <path d="M0 7 L5 1 L10 7 z" fill="var(--primary)" />
      </svg>
    )}
    <div style={{ width: 1, height: 12, background: 'var(--primary-line)' }} />
    {direction === 'down' && (
      <svg width="10" height="7" viewBox="0 0 10 7">
        <path d="M0 0 L5 6 L10 0 z" fill="var(--primary)" />
      </svg>
    )}
  </div>
);

/* ── Capability gating strip ─────────────────────────────────── */
const CAP_KEYS = [
  'map.tools', 'bim.tools', 'pointcloud.tools',
  'sidebar.items', 'viewer.panels', 'map.layers',
  'data.collections', 'data.columns', 'jobs', 'commands', 'widgets',
];

const CapStrip: FC = () => (
  <div style={{
    border: '1px solid var(--stroke)',
    borderRadius: 10,
    padding: '14px 18px',
    background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
    marginTop: 16,
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 10, letterSpacing: '0.16em',
      color: 'var(--text-dim)', textTransform: 'uppercase',
      marginBottom: 6,
    }}>
      Capability gating
    </div>
    <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.55, marginBottom: 10 }}>
      A plugin only gets the APIs it declares in its manifest. Attempting to call{' '}
      <code style={{
        fontFamily: 'Geist Mono, ui-monospace, monospace',
        fontSize: 11, color: kindVar('open'),
        background: kindSoft('open'), padding: '1px 5px', borderRadius: 4,
      }}>
        ctx.register()
      </code>{' '}
      with an undeclared capability throws at runtime.
    </div>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 9, letterSpacing: '0.12em',
      color: 'var(--text-dim-2)', textTransform: 'uppercase',
      marginBottom: 7,
    }}>
      All 11 capabilities
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {CAP_KEYS.map(c => (
        <span key={c} style={{
          display: 'inline-flex', alignItems: 'center', gap: 5,
          padding: '2px 7px 2px 5px',
          background: 'var(--chip)',
          border: '1px solid var(--stroke)',
          borderRadius: 5,
          fontSize: 10.5,
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          color: 'var(--text)',
          whiteSpace: 'nowrap',
        }}>
          <span style={{ width: 5, height: 5, borderRadius: 2, background: 'var(--text-dim-2)', flexShrink: 0 }} />
          {c}
        </span>
      ))}
    </div>
  </div>
);

/* ── Main component ─────────────────────────────────────────── */
const PluginZones: FC = () => {
  const [detectedTheme, setDetectedTheme] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () => setDetectedTheme(
      document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark'
    );
    sync();
    const mo = new MutationObserver(sync);
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => mo.disconnect();
  }, []);

  const isMobile = useIsMobile();
  const themeVars = THEMES[detectedTheme] as CSSProperties;

  return (
    <div style={{
      ...(themeVars as any),
      color: 'var(--text)',
      fontFamily: 'Geist, system-ui, sans-serif',
      marginBottom: 8,
    }}>
      <div style={{
        position: 'relative',
        border: '1px solid var(--stroke)',
        borderRadius: 14,
        background:
          'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'var(--bg-2)',
        padding: isMobile ? '20px 14px 20px' : '24px 24px 24px',
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.16em',
          color: 'var(--text-dim)', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          System structure — how the three zones relate
        </div>

        {isMobile ? (
          /* ── Mobile: stacked ───────────────────────────────── */
          <div>
            <ZoneBox label="You write this" kind="open">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Card kind="open" title="manifest.json"
                  sub="Declares your plugin's slug and capabilities. Validated before your code runs." />
                <Card kind="open" title="index.ts — activate(ctx)"
                  sub="Your entry point. Calls ctx.register() to contribute UI or behaviour." />
                <Card kind="open" title="Component files"
                  sub="React components passed into register(). Rendered by core UI at runtime." />
              </div>
            </ZoneBox>

            <VArrow label="writes into" />

            <ZoneBox label="The framework" kind="unstruct">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <Card kind="unstruct" title="sdk/types.ts"
                  sub="The public contract. Defines every type a plugin author touches." />
                <FTick />
                <Card kind="core" highlight title="host/host.ts"
                  sub="Validates manifests, builds contexts, calls activate(). Errors caught per-plugin." />
                <FTick />
                <div style={{ marginTop: 8 }}>
                  <Card kind="unstruct" title="PluginRegistry" hub
                    sub="In-memory map of capability → contributions. The only shared state between plugins and core UI." />
                </div>
              </div>
            </ZoneBox>

            <VArrow label="reads from" direction="up" />

            <ZoneBox label="Core app (unchanged)" kind="map">
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <Card kind="map" title="Toolbar"
                  sub="Renders every registered tool button."
                  chips={['map.tools', 'bim.tools', 'pointcloud.tools']} />
                <Card kind="map" title="Sidebar"
                  sub="Renders navigation items."
                  chips={['sidebar.items']} />
                <Card kind="map" title="Viewer"
                  sub="Renders floating overlay panels."
                  chips={['viewer.panels']} />
                <Card kind="map" title="+ more"
                  sub="Additional contribution points."
                  chips={['map.layers', 'data.collections', 'jobs', 'commands', 'widgets']} />
              </div>
            </ZoneBox>

            <CapStrip />
          </div>
        ) : (
          /* ── Desktop: cross layout ─────────────────────────── */
          <div>
            {/* Main three-column row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: '1fr 52px 200px 52px 1fr',
              alignItems: 'center',
              gap: 0,
            }}>
              {/* LEFT — plugin author zone */}
              <ZoneBox label="You write this" kind="open">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
                  <Card kind="open" title="manifest.json"
                    sub="Declares your plugin's slug and capabilities. Validated before your code runs." />
                  <Card kind="open" title="index.ts — activate(ctx)"
                    sub="Your entry point. Calls ctx.register() to contribute UI or behaviour." />
                  <Card kind="open" title="Component files"
                    sub="React components passed into register(). Rendered by core UI at runtime." />
                </div>
              </ZoneBox>

              {/* ARROW writes → */}
              <HArrow label={'writes\ninto'} direction="right" />

              {/* CENTER — framework (taller, no outer zone box — it IS the framework) */}
              <div style={{
                display: 'flex', flexDirection: 'column', gap: 0,
                /* push it up slightly so the arrows align with Host */
              }}>
                <div style={{
                  textAlign: 'center',
                  fontFamily: 'Geist Mono, ui-monospace, monospace',
                  fontSize: 9, letterSpacing: '0.16em',
                  textTransform: 'uppercase',
                  color: kindVar('unstruct'),
                  background: kindSoft('unstruct'),
                  borderRadius: 6, padding: '5px 0',
                  marginBottom: 12,
                }}>
                  The framework
                </div>
                <Card kind="unstruct" title="sdk/types.ts"
                  sub="The public contract. Defines every type a plugin author touches." />
                <FTick />
                <Card kind="core" highlight title="host/host.ts"
                  sub="Validates manifests, builds contexts, calls activate(). Errors caught per-plugin." />
                <FTick />
                <div style={{ marginTop: 10 }}>
                  <Card kind="unstruct" title="PluginRegistry" hub
                    sub="In-memory map of capability → contributions. The only shared state between plugins and core UI." />
                </div>
              </div>

              {/* ARROW ← reads from */}
              <HArrow label={'reads\nfrom'} direction="left" />

              {/* RIGHT — core app zone */}
              <ZoneBox label="Core app (unchanged)" kind="map">
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  <Card kind="map" title="Toolbar"
                    sub="Renders every registered tool button."
                    chips={['map.tools', 'bim.tools', 'pointcloud.tools']} />
                  <Card kind="map" title="Sidebar"
                    sub="Renders navigation items."
                    chips={['sidebar.items']} />
                  <Card kind="map" title="Viewer"
                    sub="Renders floating overlay panels."
                    chips={['viewer.panels']} />
                  <Card kind="map" title="+ more"
                    sub="Additional contribution points."
                    chips={['map.layers', 'data.collections', 'jobs', 'commands', 'widgets']} />
                </div>
              </ZoneBox>
            </div>

            {/* Capability gating strip — full width below */}
            <CapStrip />
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginZones;
