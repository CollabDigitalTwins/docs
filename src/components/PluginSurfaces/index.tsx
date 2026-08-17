import { useEffect, useState, type CSSProperties, type FC, type ReactNode } from 'react';
import type { Theme, FlowKind } from '../PlatformArchitecture/src/types';
import { THEMES, kindVar, kindSoft } from '../PlatformArchitecture/src/theme';

const MOBILE_BREAKPOINT = 768;
const MONO = 'Geist Mono, ui-monospace, monospace';

const AUTHORED: { title: string; sub: string }[] = [
  { title: 'manifest.json', sub: 'The slug, the capabilities used, settings and translations.' },
  { title: 'activate(ctx)', sub: 'The entry point. Calls ctx.register() once per contribution.' },
  { title: 'Components', sub: 'React components CDT renders, scoped to the plugin.' },
];

const HOSTED: { title: string; sub: string; chips: string[] }[] = [
  {
    title: 'Toolbars',
    sub: 'Panel content inside the standard button and dropdown.',
    chips: ['map.tools', 'bim.tools', 'pointcloud.tools'],
  },
  {
    title: 'The map',
    sub: 'Sources and layers you draw, for as long as the map lives.',
    chips: ['map.layers'],
  },
  {
    title: 'Legend card',
    sub: 'A section in the shared legend, map and BIM viewer.',
    chips: ['viewer.legends'],
  },
  {
    title: 'Viewer sidebar',
    sub: 'A tab beside Files, Layers and Sensors.',
    chips: ['viewer.tabs'],
  },
  {
    title: 'Datasets nav',
    sub: 'A full page. CDT draws the table, the plugin supplies the rows.',
    chips: ['data.pages'],
  },
  {
    title: 'Modal',
    sub: 'Opened by id from any other surface of the plugin.',
    chips: ['ui.dialogs'],
  },
];

const CAPABILITIES = [
  'map.tools', 'bim.tools', 'pointcloud.tools', 'map.layers',
  'viewer.legends', 'viewer.tabs', 'data.pages', 'ui.dialogs',
];

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

function useDocTheme(): Theme {
  const [theme, setTheme] = useState<Theme>('dark');
  useEffect(() => {
    const sync = () =>
      setTheme(document.documentElement.getAttribute('data-theme') === 'light' ? 'light' : 'dark');
    sync();
    const observer = new MutationObserver(sync);
    observer.observe(document.documentElement, { attributes: true, attributeFilter: ['data-theme'] });
    return () => observer.disconnect();
  }, []);
  return theme;
}

const Chip: FC<{ label: string }> = ({ label }) => (
  <span style={{
    display: 'inline-flex', alignItems: 'center', gap: 5,
    padding: '2px 7px 2px 5px',
    background: 'var(--chip)',
    border: '1px solid var(--stroke)',
    borderRadius: 5,
    fontSize: 10.5,
    fontFamily: MONO,
    color: 'var(--text)',
    whiteSpace: 'nowrap',
  }}>
    <span style={{ width: 5, height: 5, borderRadius: 2, background: 'var(--text-dim-2)', flexShrink: 0 }} />
    {label}
  </span>
);

const Card: FC<{
  title: string;
  sub: string;
  kind: FlowKind;
  badge?: string;
  hub?: boolean;
  chips?: string[];
}> = ({ title, sub, kind, badge, hub, chips }) => (
  <div style={{
    position: 'relative',
    background: hub
      ? `linear-gradient(180deg, color-mix(in srgb, ${kindVar(kind)} 12%, var(--panel)), var(--panel-2))`
      : 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    border: `1px solid ${hub ? `color-mix(in srgb, ${kindVar(kind)} 60%, var(--stroke))` : 'var(--stroke)'}`,
    borderRadius: 10,
    padding: '10px 13px 10px 16px',
    boxShadow: hub
      ? `0 0 22px color-mix(in srgb, ${kindVar(kind)} 16%, transparent), 0 1px 0 rgba(255,255,255,0.02) inset`
      : '0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 12px -8px rgba(0,0,0,0.35)',
  }}>
    <div style={{
      position: 'absolute',
      left: -1, top: -1, bottom: -1, width: 4,
      borderTopLeftRadius: 10, borderBottomLeftRadius: 10,
      background: kindVar(kind),
      opacity: 0.95,
    }} />

    <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: 8 }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{
          fontSize: 12, fontWeight: 600, letterSpacing: '-0.01em',
          color: 'var(--text)', lineHeight: 1.3, marginBottom: 3,
          fontFamily: MONO,
        }}>
          {title}
        </div>
        <div style={{ fontSize: 11, color: 'var(--text-dim)', lineHeight: 1.45 }}>{sub}</div>
      </div>
      {badge && (
        <span style={{
          fontFamily: MONO,
          fontSize: 8.5, letterSpacing: '0.12em',
          color: kindVar(kind), background: kindSoft(kind),
          padding: '2px 5px', borderRadius: 4,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap', flexShrink: 0, marginTop: 1,
        }}>
          {badge}
        </span>
      )}
    </div>

    {chips && (
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4, marginTop: 8 }}>
        {chips.map(chip => <Chip key={chip} label={chip} />)}
      </div>
    )}
  </div>
);

const ZoneBox: FC<{ label: string; kind: FlowKind; children: ReactNode }> = ({ label, kind, children }) => (
  <div style={{
    border: `1px dashed color-mix(in srgb, ${kindVar(kind)} 40%, var(--stroke))`,
    borderRadius: 10,
    padding: '12px 14px 14px',
    background: kindSoft(kind),
  }}>
    <div style={{
      fontFamily: MONO,
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

const Tick: FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '2px 0' }}>
    <div style={{ width: 1, height: 10, background: 'var(--stroke)' }} />
    <svg width="8" height="6" viewBox="0 0 8 6" aria-hidden>
      <path d="M0 0 L4 5 L8 0 z" fill="var(--stroke)" opacity="0.6" />
    </svg>
  </div>
);

const HArrow: FC<{ label: string; direction: 'right' | 'left' }> = ({ label, direction }) => (
  <div style={{
    display: 'flex', flexDirection: 'column',
    alignItems: 'center', justifyContent: 'center',
    gap: 6, padding: '0 4px',
  }}>
    <div style={{
      fontFamily: MONO,
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
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }} aria-hidden>
          <path d="M7 0 L0 6 L7 12 z" fill="var(--primary)" />
        </svg>
      )}
      <div style={{ flex: 1, height: 1.5, background: 'var(--primary-line)' }} />
      {direction === 'right' && (
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }} aria-hidden>
          <path d="M0 0 L7 6 L0 12 z" fill="var(--primary)" />
        </svg>
      )}
    </div>
  </div>
);

const VArrow: FC<{ label: string }> = ({ label }) => (
  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 0', gap: 5 }}>
    <div style={{
      fontFamily: MONO,
      fontSize: 8.5, fontWeight: 700, letterSpacing: '0.1em',
      textTransform: 'uppercase', color: 'var(--text-dim-2)',
    }}>
      {label}
    </div>
    <div style={{ width: 1, height: 12, background: 'var(--primary-line)' }} />
    <svg width="10" height="7" viewBox="0 0 10 7" aria-hidden>
      <path d="M0 0 L5 6 L10 0 z" fill="var(--primary)" />
    </svg>
  </div>
);

const AuthoredCards: FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column', gap: 9 }}>
    {AUTHORED.map(card => <Card key={card.title} kind="open" {...card} />)}
  </div>
);

const Framework: FC = () => (
  <div style={{ display: 'flex', flexDirection: 'column' }}>
    <div style={{
      textAlign: 'center',
      fontFamily: MONO,
      fontSize: 9, letterSpacing: '0.16em',
      textTransform: 'uppercase',
      color: kindVar('unstruct'),
      background: kindSoft('unstruct'),
      borderRadius: 6, padding: '5px 0',
      marginBottom: 12,
    }}>
      CDT, at start-up
    </div>
    <Card kind="core" title="Checks the manifest"
      sub="Slug, hostApi and capabilities, before any plugin code runs." />
    <Tick />
    <Card kind="core" title="Calls activate(ctx)"
      sub="Once, with the plugin id and its saved settings." />
    <Tick />
    <div style={{ marginTop: 10 }}>
      <Card kind="unstruct" hub badge="Registry" title="Registered contributions"
        sub="Kept per capability. The app subscribes, so a plugin switched on or off appears and disappears without a reload." />
    </div>
  </div>
);

const HostedCards: FC<{ columns: number }> = ({ columns }) => (
  <div style={{
    display: 'grid',
    gridTemplateColumns: `repeat(${columns}, minmax(0, 1fr))`,
    gap: 9,
    alignContent: 'start',
  }}>
    {HOSTED.map(card => <Card key={card.title} kind="map" {...card} />)}
  </div>
);

const DeclareStrip: FC = () => (
  <div style={{
    border: '1px solid var(--stroke)',
    borderRadius: 10,
    padding: '14px 18px',
    background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
    boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset',
    marginTop: 16,
  }}>
    <div style={{
      fontFamily: MONO,
      fontSize: 10, letterSpacing: '0.16em',
      color: 'var(--text-dim)', textTransform: 'uppercase',
      marginBottom: 6,
    }}>
      Declare what you register
    </div>
    <div style={{ fontSize: 12, color: 'var(--text-dim)', lineHeight: 1.55, marginBottom: 10 }}>
      Every capability passed to{' '}
      <code style={{
        fontFamily: MONO, fontSize: 11,
        color: kindVar('open'), background: kindSoft('open'),
        padding: '1px 5px', borderRadius: 4,
      }}>
        ctx.register()
      </code>{' '}
      must also be listed in the manifest. If an undeclared one is registered, CDT drops every
      contribution that plugin made and marks it errored — activation is all-or-nothing, so a
      half-registered plugin never occurs.
    </div>
    <div style={{ display: 'flex', flexWrap: 'wrap', gap: 5 }}>
      {CAPABILITIES.map(key => <Chip key={key} label={key} />)}
    </div>
  </div>
);

const PluginSurfaces: FC = () => {
  const themeVars = THEMES[useDocTheme()] as unknown as CSSProperties;
  const isMobile = useIsMobile();

  return (
    <figure style={{
      ...themeVars,
      margin: '0 0 8px',
      color: 'var(--text)',
      fontFamily: 'Geist, system-ui, sans-serif',
    }}>
      <div style={{
        position: 'relative',
        border: '1px solid var(--stroke)',
        borderRadius: 14,
        background:
          'repeating-linear-gradient(0deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'repeating-linear-gradient(90deg, transparent 0, transparent 39px, var(--grid) 40px), ' +
          'var(--bg-2)',
        padding: isMobile ? '20px 14px' : 24,
        overflow: 'hidden',
      }}>
        <div style={{
          fontFamily: MONO,
          fontSize: 10, letterSpacing: '0.16em',
          color: 'var(--text-dim)', textTransform: 'uppercase',
          marginBottom: 20,
        }}>
          What a plugin supplies, and where it appears
        </div>

        {isMobile ? (
          <div>
            <ZoneBox label="Supplied by the plugin" kind="open"><AuthoredCards /></ZoneBox>
            <VArrow label="registers into" />
            <Framework />
            <VArrow label="read by" />
            <ZoneBox label="Where it appears" kind="map"><HostedCards columns={1} /></ZoneBox>
          </div>
        ) : (
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'minmax(0, 0.95fr) 50px minmax(0, 0.95fr) 50px minmax(0, 1.5fr)',
            alignItems: 'center',
          }}>
            <ZoneBox label="Supplied by the plugin" kind="open"><AuthoredCards /></ZoneBox>
            <HArrow label={'registers\ninto'} direction="right" />
            <Framework />
            <HArrow label={'read\nby'} direction="right" />
            <ZoneBox label="Where it appears" kind="map"><HostedCards columns={2} /></ZoneBox>
          </div>
        )}

        <DeclareStrip />
      </div>
    </figure>
  );
};

export default PluginSurfaces;
