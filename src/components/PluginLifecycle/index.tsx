import { useEffect, useState, type CSSProperties, type FC } from 'react';
import type { Theme, FlowKind } from '../PlatformArchitecture/src/types';
import { THEMES, kindVar, kindSoft, kindName } from '../PlatformArchitecture/src/theme';

interface Step {
  num: number;
  label: string;
  sub: string;
  kind: FlowKind;
}

const STEPS: Step[] = [
  { num: 1, label: 'App mounts',                  sub: 'Next.js / React',       kind: 'core'    },
  { num: 2, label: 'PluginHostProvider',           sub: 'CombineProviders',      kind: 'open'    },
  { num: 3, label: 'Host loops plugins',           sub: 'installed.ts',          kind: 'core'    },
  { num: 4, label: 'Validate manifest',            sub: 'slug · caps · version', kind: 'core'    },
  { num: 5, label: 'createPluginContext',          sub: 'scoped to slug',        kind: 'core'    },
  { num: 6, label: 'activate(ctx) called',         sub: 'your plugin runs',      kind: 'open'    },
  { num: 7, label: 'ctx.register() → registry',   sub: 'contributions stored',  kind: 'unstruct' },
  { num: 8, label: 'Toolbar / Sidebar render',     sub: 'reads registry',        kind: 'map'     },
];

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

/* ── Desktop step bubble ───────────────────────────────────── */
const StepBubble: FC<{ step: Step; last: boolean }> = ({ step, last }) => (
  <div style={{
    display: 'flex', alignItems: 'center', gap: 0,
    flex: last ? '0 0 auto' : '1 1 0',
    minWidth: 0,
  }}>
    {/* card column */}
    <div style={{
      display: 'flex', flexDirection: 'column', alignItems: 'center',
      minWidth: 84, maxWidth: 116, flex: '0 0 auto',
    }}>
      {/* step number circle */}
      <div style={{
        width: 20, height: 20, borderRadius: '50%',
        background: kindSoft(step.kind),
        border: `1px solid ${kindVar(step.kind)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 9, fontWeight: 700,
        color: kindVar(step.kind),
        marginBottom: 6, flexShrink: 0,
        fontFamily: 'Geist Mono, ui-monospace, monospace',
        letterSpacing: '0.05em',
      }}>
        {step.num}
      </div>

      {/* card — matches NodeCard aesthetic */}
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
        border: '1px solid var(--stroke)',
        borderRadius: 10,
        padding: '8px 10px 8px 14px',
        width: '100%',
        boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 12px -8px rgba(0,0,0,0.4)',
      }}>
        {/* left accent bar */}
        <div style={{
          position: 'absolute',
          left: -1, top: -1, bottom: -1, width: 4,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          background: kindVar(step.kind),
          opacity: 0.95,
        }} />
        <div style={{
          fontSize: 11.5, fontWeight: 600,
          letterSpacing: '-0.01em',
          lineHeight: 1.3,
          color: 'var(--text)',
          marginBottom: 4,
        }}>
          {step.label}
        </div>
        {/* kind badge */}
        <span style={{
          fontFamily: 'Geist Mono, ui-monospace, monospace',
          fontSize: 8.5, letterSpacing: '0.12em',
          color: kindVar(step.kind),
          background: kindSoft(step.kind),
          padding: '2px 5px',
          borderRadius: 4,
          textTransform: 'uppercase',
          whiteSpace: 'nowrap',
        }}>
          {kindName(step.kind)}
        </span>
      </div>

      {/* subtitle below card */}
      <div style={{
        fontSize: 9.5,
        color: 'var(--text-dim-2)',
        marginTop: 5,
        textAlign: 'center',
        fontFamily: 'Geist Mono, ui-monospace, monospace',
        lineHeight: 1.3,
      }}>
        {step.sub}
      </div>
    </div>

    {/* arrow connector */}
    {!last && (
      <div style={{
        flex: '1 1 0', minWidth: 8,
        display: 'flex', alignItems: 'center',
        paddingBottom: 32,
      }}>
        <div style={{ flex: 1, height: 1.5, background: 'var(--primary-line)' }} />
        <svg width="8" height="12" viewBox="0 0 8 12" style={{ flexShrink: 0 }}>
          <path d="M0 0 L7 6 L0 12 z" fill="var(--primary)" />
        </svg>
      </div>
    )}
  </div>
);

/* ── Mobile step row ───────────────────────────────────────── */
const MobileStep: FC<{ step: Step; last: boolean }> = ({ step, last }) => (
  <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
    {/* timeline column */}
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', flexShrink: 0 }}>
      <div style={{
        width: 24, height: 24, borderRadius: '50%',
        background: kindSoft(step.kind),
        border: `1px solid ${kindVar(step.kind)}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 10, fontWeight: 700,
        color: kindVar(step.kind),
        fontFamily: 'Geist Mono, ui-monospace, monospace',
        letterSpacing: '0.05em',
        flexShrink: 0,
      }}>
        {step.num}
      </div>
      {!last && (
        <div style={{
          width: 1, flex: 1, minHeight: 14,
          background: 'var(--stroke)',
          margin: '3px 0',
        }} />
      )}
    </div>

    {/* card */}
    <div style={{ flex: 1, paddingBottom: last ? 0 : 10 }}>
      <div style={{
        position: 'relative',
        background: 'linear-gradient(180deg, var(--panel), var(--panel-2))',
        border: '1px solid var(--stroke)',
        borderRadius: 10,
        padding: '9px 12px 9px 15px',
        boxShadow: '0 1px 0 rgba(255,255,255,0.02) inset, 0 4px 12px -8px rgba(0,0,0,0.4)',
        marginBottom: 3,
      }}>
        <div style={{
          position: 'absolute',
          left: -1, top: -1, bottom: -1, width: 4,
          borderTopLeftRadius: 10,
          borderBottomLeftRadius: 10,
          background: kindVar(step.kind),
          opacity: 0.95,
        }} />
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 8 }}>
          <div style={{
            fontSize: 12.5, fontWeight: 600,
            letterSpacing: '-0.01em', lineHeight: 1.3,
            color: 'var(--text)',
          }}>
            {step.label}
          </div>
          <span style={{
            fontFamily: 'Geist Mono, ui-monospace, monospace',
            fontSize: 8.5, letterSpacing: '0.12em',
            color: kindVar(step.kind),
            background: kindSoft(step.kind),
            padding: '2px 5px', borderRadius: 4,
            textTransform: 'uppercase',
            whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            {kindName(step.kind)}
          </span>
        </div>
        <div style={{
          fontSize: 10,
          color: 'var(--text-dim)',
          marginTop: 4,
          fontFamily: 'Geist Mono, ui-monospace, monospace',
        }}>
          {step.sub}
        </div>
      </div>
    </div>
  </div>
);

/* ── Main component ────────────────────────────────────────── */
const PluginLifecycle: FC = () => {
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
          Startup lifecycle — what happens when the app loads
        </div>

        {isMobile ? (
          <div>
            {STEPS.map((step, i) => (
              <MobileStep key={step.num} step={step} last={i === STEPS.length - 1} />
            ))}
          </div>
        ) : (
          <div style={{ display: 'flex', alignItems: 'flex-start', overflow: 'hidden' }}>
            {STEPS.map((step, i) => (
              <StepBubble key={step.num} step={step} last={i === STEPS.length - 1} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default PluginLifecycle;
