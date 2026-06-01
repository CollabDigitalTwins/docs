import React, { useEffect, useRef, useState } from 'react';
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
  const rootRef = useRef<HTMLDivElement>(null);

  // Force the docs palette to match the requested theme (──hp-* live on
  // html[data-theme]). Overrides any persisted Docusaurus colour preference.
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // Report the *content* height so an embedding iframe can size itself
  // exactly. We measure the root element (content-driven height) rather than
  // document.body / scrollHeight — using a viewport-relative height like
  // 100vh here would feed back through the parent's iframe sizing and grow
  // without bound. A small dead-band avoids sub-pixel oscillation.
  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let last = 0;
    const report = () => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (Math.abs(height - last) < 2) return;
      last = height;
      try {
        window.parent?.postMessage({ type: 'cdt-arch-height', height }, '*');
      } catch {
        /* cross-origin parent without a listener — safe to ignore */
      }
    };
    report();
    const ro = new ResizeObserver(report);
    ro.observe(el);
    window.addEventListener('load', report);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', report);
    };
  }, []);

  return (
    <div
      ref={rootRef}
      style={{
        background: 'var(--hp-surface-grad, var(--hp-surface))',
        padding: 'clamp(12px, 2vw, 28px)',
        boxSizing: 'border-box',
      }}
    >
      <PlatformArchitecture theme={theme} bare={!showChrome} />
    </div>
  );
}

export default function ArchitectureEmbedPage(): React.ReactElement {
  return (
    <>
      <Head>
        <title>CDT Platform Architecture</title>
        <meta name="robots" content="noindex" />
        {/* Strip default page chrome margins for a clean embed. No 100vh /
            min-height anywhere — the page is exactly as tall as the diagram so
            the height it reports to the parent iframe stays stable. */}
        <style>{`html,body{margin:0;padding:0;background:var(--hp-surface);}`}</style>
      </Head>
      <BrowserOnly>{() => <ArchitectureEmbed />}</BrowserOnly>
    </>
  );
}
