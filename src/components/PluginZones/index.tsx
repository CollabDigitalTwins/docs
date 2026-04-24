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

/* ── Shared card — mirrors NodeCard ───────────────────────── */
const ZoneCard: FC<{
  title: string;
  sub: string;
  kind: FlowKind;
  accent?: boolean;
  chips?: string[];
}> = ({ title, sub, kind, accent, chips }) => (
  <div style={{
    position: 'relative',
    background: accent
      ? `linear-gradient(180deg, color-mix(in srgb, ${kindVar(kind)} 10%, var(--panel)), var(--panel-2))`
      : 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    border: `1px solid ${accent ? `color-mix(in srgb, ${kindVar(kind)} 55%, var(--stroke))` : 'var(--stroke)'}`,
    borderRadius: 10,
    padding: '11px 13px 11px 16px',
    boxShadow: accent
      ? `0 0 20px color-mix(in srgb, ${kindVar(kind)} 14%, transparent), 0 1px 0 rgba(255,255,255,0.02) inset`
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

    {/* HUB badge for the registry hub */}
    {accent && (
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

    {/* header row */}
    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600,
          letterSpacing: '-0.01em',
          color: 'var(--text)',
          lineHeight: 1.3,
          marginBottom: 3,
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
        whiteSpace: 'nowrap', flexShrink: 0,
        marginTop: 1,
      }}>
        {kindName(kind)}
      </span>
    </div>

    {/* capability chips */}
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

/* ── Zone column header — matches layer label style ─────────── */
const ZoneHeader: FC<{ label: string; kind: FlowKind }> = ({ label, kind }) => (
  <div style={{
    textAlign: 'center',
    fontFamily: 'Geist Mono, ui-monospace, monospace',
    fontSize: 9, letterSpacing: '0.16em',
    textTransform: 'uppercase',
    color: kindVar(kind),
    background: kindSoft(kind),
    borderRadius: 6, padding: '5px 0',
    marginBottom: 14,
  }}>
    {label}
  </div>
);

/* ── Horizontal arrow between zones ─────────────────────────── */
const HArrow: FC<{ label: string; direction: 'right' | 'left' }> = ({ label, direction }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 5, padding: '0 2px',
    paddingTop: 32, /* offset to clear zone headers */
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-dim-2)',
      textAlign: 'center', lineHeight: 1.4,
    }}>
      {label}
    </div>
    <div style={{ display: 'flex', alignItems: 'center', width: '100%', gap: 0 }}>
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

/* ── Framework connector tick between stacked boxes ─────────── */
const FTick: FC = () => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    margin: '2px 0',
  }}>
    <div style={{ width: 1, height: 10, background: 'var(--stroke)' }} />
    <svg width="8" height="6" viewBox="0 0 8 6">
      <path d="M0 0 L4 5 L8 0 z" fill="var(--stroke)" opacity="0.6" />
    </svg>
  </div>
);

/* ── Mobile vertical arrow between zones ────────────────────── */
const VArrow: FC<{ label: string; direction?: 'down' | 'up' }> = ({ label, direction = 'down' }) => (
  <div style={{
    display: 'flex', flexDirection: 'column', alignItems: 'center',
    padding: '10px 0', gap: 5,
  }}>
    <div style={{
      fontFamily: 'Geist Mono, ui-monospace, monospace',
      fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase',
      color: 'var(--text-dim-2)',
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

/* ── Divider between zones (mobile) ─────────────────────────── */
const ZoneDivider: FC = () => (
  <div style={{
    height: 1,
    background: 'linear-gradient(90deg, transparent, var(--stroke) 15%, var(--stroke) 85%, transparent)',
    margin: '4px 0 16px',
  }} />
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
        padding: isMobile ? '20px 16px' : '24px 28px 28px',
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 10, letterSpacing: '0.16em',
          color: 'var(--text-dim)',
          textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          System structure — how the three zones relate
        </div>

        {isMobile ? (
          /* ── Mobile: stacked zones ─────────────────────────── */
          <div>
            <ZoneHeader label="You write this" kind="open" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ZoneCard kind="open" title="manifest.json"
                sub="Declares your plugin's slug and which capabilities it needs. Validated before your code runs." />
              <ZoneCard kind="open" title="index.ts — activate(ctx)"
                sub="Your entry point. Calls ctx.register() to contribute UI or behaviour." />
              <ZoneCard kind="open" title="Component files"
                sub="React components passed into register(). Rendered by core UI at runtime." />
            </div>

            <VArrow label="writes into" />
            <ZoneDivider />

            <ZoneHeader label="The framework" kind="unstruct" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
              <ZoneCard kind="unstruct" title="sdk/types.ts"
                sub="The public contract. Defines every type a plugin author touches." />
              <FTick />
              <ZoneCard kind="unstruct" title="host/host.ts"
                sub="Validates manifests, builds contexts, calls activate(). Errors caught per-plugin." />
              <FTick />
              <div style={{ paddingTop: 10 }}>
                <ZoneCard kind="unstruct" title="PluginRegistry" accent
                  sub="In-memory map of capability → contributions. The only shared state between plugins and core UI." />
              </div>
            </div>

            <VArrow label="reads from" direction="up" />
            <ZoneDivider />

            <ZoneHeader label="Core app (unchanged)" kind="map" />
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <ZoneCard kind="map" title="Toolbar"    sub="Renders every registered tool button."
                chips={['map.tools', 'bim.tools', 'pointcloud.tools']} />
              <ZoneCard kind="map" title="Sidebar"    sub="Renders navigation items."
                chips={['sidebar.items']} />
              <ZoneCard kind="map" title="Viewer"     sub="Renders floating overlay panels."
                chips={['viewer.panels']} />
              <ZoneCard kind="map" title="+ more"     sub="Additional contribution points."
                chips={['map.layers', 'data.collections', 'jobs', 'commands', 'widgets']} />
            </div>
          </div>
        ) : (
          /* ── Desktop: three-column grid ────────────────────── */
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 60px 188px 60px 1fr',
            alignItems: 'start',
            gap: 0,
          }}>
            {/* LEFT — plugin author */}
            <div>
              <ZoneHeader label="You write this" kind="open" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                <ZoneCard kind="open" title="manifest.json"
                  sub="Declares your plugin's slug and which capabilities it needs. Validated before your code runs." />
                <ZoneCard kind="open" title="index.ts — activate(ctx)"
                  sub="Your entry point. Calls ctx.register() to contribute UI or behaviour." />
                <ZoneCard kind="open" title="Component files"
                  sub="React components passed into register(). Rendered by core UI at runtime." />
              </div>
            </div>

            {/* ARROW writes → */}
            <HArrow label={'writes\ninto'} direction="right" />

            {/* CENTER — framework */}
            <div>
              <ZoneHeader label="The framework" kind="unstruct" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
                <ZoneCard kind="unstruct" title="sdk/types.ts"
                  sub="The public contract. Defines every type a plugin author touches." />
                <FTick />
                <ZoneCard kind="unstruct" title="host/host.ts"
                  sub="Validates manifests, builds contexts, calls activate(). Errors caught per-plugin." />
                <FTick />
                <div style={{ paddingTop: 10 }}>
                  <ZoneCard kind="unstruct" title="PluginRegistry" accent
                    sub="In-memory map of capability → contributions. The only shared state between plugins and core UI." />
                </div>
              </div>
            </div>

            {/* ARROW ← reads from */}
            <HArrow label={'reads\nfrom'} direction="left" />

            {/* RIGHT — core app */}
            <div>
              <ZoneHeader label="Core app (unchanged)" kind="map" />
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <ZoneCard kind="map" title="Toolbar"    sub="Renders every registered tool button."
                  chips={['map.tools', 'bim.tools', 'pointcloud.tools']} />
                <ZoneCard kind="map" title="Sidebar"    sub="Renders navigation items."
                  chips={['sidebar.items']} />
                <ZoneCard kind="map" title="Viewer"     sub="Renders floating overlay panels."
                  chips={['viewer.panels']} />
                <ZoneCard kind="map" title="+ more"     sub="Additional contribution points."
                  chips={['map.layers', 'data.collections', 'jobs', 'commands', 'widgets']} />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginZones;
