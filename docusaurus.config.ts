import 'dotenv/config';
import { themes as prismThemes } from 'prism-react-renderer';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This runs in Node.js - Don't use client-side code here (browser APIs, JSX...)

const algoliaApiKey = process.env.ALGOLIA_SEARCH_API_KEY;

const config: Config = {
  title: 'CDT Docs',
  tagline: 'Visit our guides, documents, and examples to integrate with Collab Digital Twins’ platform.',
  favicon: 'img/cdt-logo-stroke.svg',

  headTags: [
    {
      tagName: 'meta',
      attributes: {
        property: 'og:image',
        content: 'https://docs.collabdt.org/img/cdt-og_card.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:image',
        content: 'https://docs.collabdt.org/img/cdt-og_card.png',
      },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'twitter:card',
        content: 'summary_large_image',
      },
    },
  ],

  // Future flags, see https://docusaurus.io/docs/api/docusaurus-config#future
  future: {
    v4: true, // Improve compatibility with the upcoming Docusaurus v4
  },

  // Set the production url of your site here
  url: 'https://docs.collabdt.org',
  // Set the /<baseUrl>/ pathname under which your site is served
  // For GitHub pages deployment, it is often '/<projectName>/'
  baseUrl: '/',

  // GitHub pages deployment config.
  // If you aren't using GitHub pages, you don't need these.
  organizationName: 'collabdt', // Usually your GitHub org/user name.
  projectName: 'docs', // Usually your repo name.

  onBrokenLinks: 'warn',
  onBrokenMarkdownLinks: 'warn',

  // Even if you don't use internationalization, you can use this field to set
  // useful metadata like html lang. For example, if your site is Chinese, you
  // may want to replace "en" with "zh-Hans".
  i18n: {
    defaultLocale: 'en',
    locales: ['en'],
  },

  presets: [
    [
      'classic',
      {
        docs: {
          sidebarPath: './sidebars.ts',
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/collabdt/docs/tree/main/',
        },
        blog: {
          showReadingTime: true,
          feedOptions: {
            type: ['rss', 'atom'],
            xslt: true,
          },
          // Please change this to your repo.
          // Remove this to remove the "edit this page" links.
          editUrl:
            'https://github.com/collabdt/docs/tree/main/',
          // Useful options to enforce blogging best practices
          onInlineTags: 'warn',
          onInlineAuthors: 'warn',
          onUntruncatedBlogPosts: 'warn',
        },
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    // Replace with your project's social card
    image: 'img/cdt-og_card.png',
    colorMode: {
      respectPrefersColorScheme: false,
    },
    navbar: {
      title: 'CDT Docs',
      logo: {
        alt: 'Collab Digital Twins',
        src: 'img/cdt-logo-stroke.svg',
      },
      items: [
        {
          type: 'docSidebar',
          sidebarId: 'baseSidebar',
          position: 'left',
          label: 'Docs',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/collabdt/docs',
          label: 'GitHub',
          position: 'right',
        },
        {
          href: 'https://collabdt.org/home',
          label: 'Home',
          position: 'right',
        },
      ],
    },
    footer: {
      style: 'dark',
      links: [
        {
          title: 'Docs',
          items: [
            {
              label: 'Introduction',
              to: '/docs/introduction',
            },
            {
              label: 'Getting Started',
              to: '/docs/getting-started/installation',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/collabdt',
            },
            {
              label: 'Contact',
              href: 'https://collabdt.org/home#contact',
            },
          ],
        },
        {
          title: 'More',
          items: [
            {
              label: 'CDT Home',
              href: 'https://collabdt.org/home',
            },
          ],
        },
      ],
      copyright: ` ${new Date().getFullYear()} 
      Collab Digital Twins. All rights reserved.
      Stewarded by a Canadian not-for-profit organization for long-term public benefit. Built with Docusaurus.`,
    },
    ...(algoliaApiKey
      ? {
        algolia: {
          // The application ID provided by Algolia
          appId: 'OKIPW773AK',
          apiKey: algoliaApiKey,
          indexName: 'CDT Documentation',
          // Optional: Algolia search parameters
          searchParameters: {},
          // Optional: path for search page that enabled by default (`false` to disable it)
          searchPagePath: 'search',
          // Optional: whether the insights feature is enabled or not on DocSearch (`false` by default)
          insights: false,
          // Contextual search is enabled by default
          contextualSearch: true,
          // Optional: enable Ask AI later if needed
          // askAi: process.env.ALGOLIA_ASK_AI_ASSISTANT_ID,
        },
      }
      : {}),
    prism: {
      theme: prismThemes.github,
      darkTheme: prismThemes.dracula,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;
