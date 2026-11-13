import React, { useEffect, useRef, type ReactNode } from 'react';

export type EmbedTheme = 'light' | 'dark';

export function getEmbedParam(name: string, fallback: string): string {
  if (typeof window === 'undefined') return fallback;
  return new URLSearchParams(window.location.search).get(name) ?? fallback;
}

export function getEmbedTheme(): EmbedTheme {
  return getEmbedParam('theme', 'dark') === 'light' ? 'light' : 'dark';
}

export function postToParent(message: Record<string, unknown>): void {
  try {
    window.parent?.postMessage(message, '*');
  } catch {
    // A cross-origin parent without a listener is fine to ignore.
  }
}

interface EmbedFrameProps {
  id: string;
  children: ReactNode;
  onHello?: () => void;
  bare?: boolean;
}

/** Chrome-less wrapper for /embed pages: applies `?theme=` and posts its content height to the parent. */
export default function EmbedFrame({ id, children, onHello, bare = false }: EmbedFrameProps): React.ReactElement {
  const rootRef = useRef<HTMLDivElement>(null);
  const onHelloRef = useRef(onHello);
  onHelloRef.current = onHello;

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', getEmbedTheme());
  }, []);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    let last = 0;
    // Measure the root, never the viewport: a vh-based height feeds back through the iframe and grows forever.
    const report = (force = false) => {
      const height = Math.ceil(el.getBoundingClientRect().height);
      if (!force && Math.abs(height - last) < 2) return;
      last = height;
      postToParent({ type: 'cdt-embed-height', id, height });
    };
    // The parent may hydrate after this page loads, so it asks again with a hello.
    const onMessage = (e: MessageEvent) => {
      if ((e.data as { type?: string })?.type !== 'cdt-embed-hello') return;
      report(true);
      onHelloRef.current?.();
    };
    const onLoad = () => report();
    report();
    const ro = new ResizeObserver(() => report());
    ro.observe(el);
    window.addEventListener('load', onLoad);
    window.addEventListener('message', onMessage);
    return () => {
      ro.disconnect();
      window.removeEventListener('load', onLoad);
      window.removeEventListener('message', onMessage);
    };
  }, [id]);

  return (
    <div
      ref={rootRef}
      style={bare ? undefined : {
        background: 'var(--hp-surface-grad, var(--hp-surface))',
        padding: 'clamp(12px, 2vw, 28px)',
        boxSizing: 'border-box',
      }}
    >
      {children}
    </div>
  );
}

export const EMBED_PAGE_STYLE = 'html,body{margin:0;padding:0;overflow:hidden;background:var(--hp-surface);}';

/** A transparent page; the shared color-scheme keeps the host from painting an opaque iframe backdrop. */
export const BARE_EMBED_PAGE_STYLE = 'html,body{margin:0;padding:0;overflow:hidden;background:transparent!important;color-scheme:normal!important;}';
