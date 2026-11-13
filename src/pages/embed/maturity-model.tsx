import React, { useEffect, useState } from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import EmbedFrame, { EMBED_PAGE_STYLE, postToParent } from '@site/src/components/EmbedFrame';

interface UseCase {
  id: string;
  label: string;
  level: number;
}

const TRUSTED_ORIGIN = /^https:\/\/(www\.)?collabdt\.org$|^http:\/\/localhost(:\d+)?$/;

function isUseCase(value: unknown): value is UseCase {
  const v = value as UseCase;
  return typeof v?.id === 'string' && typeof v.label === 'string' && Number.isInteger(v.level);
}

function MaturityModelEmbed(): React.ReactElement {
  const MaturityModel = require('@site/src/components/MaturityModel').default;
  const [useCases, setUseCases] = useState<UseCase[]>([]);

  useEffect(() => {
    const onMessage = (e: MessageEvent) => {
      if (!TRUSTED_ORIGIN.test(e.origin)) return;
      const data = e.data as { type?: string; items?: unknown };
      if (data?.type !== 'cdt-mm-usecases' || !Array.isArray(data.items)) return;
      setUseCases(data.items.filter(isUseCase));
    };
    window.addEventListener('message', onMessage);
    postToParent({ type: 'cdt-mm-ready' });
    return () => window.removeEventListener('message', onMessage);
  }, []);

  return (
    <EmbedFrame id="maturity-model" onHello={() => postToParent({ type: 'cdt-mm-ready' })}>
      <MaturityModel
        useCases={useCases}
        onUseCaseSelect={(id: string) => postToParent({ type: 'cdt-mm-select', id })}
        yAxisLabel="Maturity →"
        kicker="Use cases · Plugins"
        title={
          <>
            Plugins on the <span className="mm-acc">Maturity Model</span>
          </>
        }
        lede="Each plugin adds a use case at the level it reaches. Select one to watch it, or a level to see what it unlocks."
      />
    </EmbedFrame>
  );
}

export default function MaturityModelEmbedPage(): React.ReactElement {
  return (
    <>
      <Head>
        <title>CDT Plugins Maturity Model</title>
        <meta name="robots" content="noindex" />
        <style>{EMBED_PAGE_STYLE}</style>
      </Head>
      <BrowserOnly>{() => <MaturityModelEmbed />}</BrowserOnly>
    </>
  );
}
