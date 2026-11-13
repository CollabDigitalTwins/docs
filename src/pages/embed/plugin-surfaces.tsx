import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';
import Head from '@docusaurus/Head';
import EmbedFrame, { EMBED_PAGE_STYLE } from '@site/src/components/EmbedFrame';

function PluginSurfacesEmbed(): React.ReactElement {
  const PluginSurfaces = require('@site/src/components/PluginSurfaces').default;
  return (
    <EmbedFrame id="plugin-surfaces">
      <PluginSurfaces />
    </EmbedFrame>
  );
}

export default function PluginSurfacesEmbedPage(): React.ReactElement {
  return (
    <>
      <Head>
        <title>CDT Plugin Surfaces</title>
        <meta name="robots" content="noindex" />
        <style>{EMBED_PAGE_STYLE}</style>
      </Head>
      <BrowserOnly>{() => <PluginSurfacesEmbed />}</BrowserOnly>
    </>
  );
}
