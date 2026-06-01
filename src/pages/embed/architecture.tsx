import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';

/**
 * Standalone, chrome-less embed of the platform architecture diagram.
 *
 * Served at /embed/architecture — no navbar, sidebar, or footer — so it can be
 * iframed from other CDT properties (e.g. the marketing homepage) while staying
 * single-source with the docs. The diagram component itself is unchanged.
 *
 * Query params:
 *   ?theme=light|dark   force the palette (defaults to dark)
 *   ?chrome=1           show the flow-filter legend (hidden by default)
 *
 * The page also posts its content height to the parent window
 * ({ type: 'cdt-arch-height', height }) so an embedding iframe can auto-size.
 */

function getParam(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) ?? fallback;
}

function ArchitectureEmbed() {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const PlatformArchitecture = require('@site/src/components/PlatformArchitecture').default;

  const [theme] = useState<'light' | 'dark'>(() =>
    getParam('theme', 'dark') === 'light' ? 'light' : 'dark',
  );
  const showChrome = getParam('chrome', '0') === '1';

  // Force the docs palette to match the requested theme (──hp-* live on
  // html[data-theme]). Overrides any persisted Docusaurus colour preference.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Report content height so an embedding iframe can size itself exactly.
  useEffect(() => {
    const report = () => {
      const height = Math.ceil(document.body.scrollHeight);
      try {
        window.parent?.postMessage({ type: 'cdt-arch-height', height }, '*');
      } catch {
        /* cross-origin parent without a listener — safe to ignore */
      }
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(document.body);
    window.addEventListener('load', report);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', report);
    };
  }, []);

  return (
    <div
      style={{
        minHeight: '100vh',
        background: 'var(--hp-surface-grad, var(--hp-surface))',
        padding: 'clamp(12px, 2vw, 28px)',
        boxSizing: 'border-box',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ width: '100%' }}>
        <PlatformArchitecture theme={theme} bare={!showChrome} />
      </div>
    </div>
  );
}

export default function ArchitectureEmbedPage(): React.ReactElement {
  return (
    <>
      <Head>
        <title>CDT Platform Architecture</title>
        <meta name="robots" content="noindex" />
        {/* Strip default page chrome margins for a clean embed. */}
        <style>{`html,body{margin:0;padding:0;background:var(--hp-surface);} #__docusaurus{min-height:100vh;}`}</style>
      </Head>
      <BrowserOnly>{() => <ArchitectureEmbed />}</BrowserOnly>
    </>
  );
}
