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
            'https://github.com/CollabDigitalTwins/docs/tree/main/',
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
      defaultMode: 'dark',
      respectPrefersColorScheme: false,
    },
    navbar: {
      items: [
        {
          type: 'doc',
          docId: 'introduction',
          position: 'left',
          html: '<span class="navbarItemWithIcon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M3 21c1.5-4 5-6 9-6s7.5 2 9 6"/></svg>Users</span>',
        },
        {
          type: 'doc',
          docId: 'developer-introduction',
          position: 'left',
          html: '<span class="navbarItemWithIcon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="8 7 3 12 8 17"/><polyline points="16 7 21 12 16 17"/><line x1="14" y1="4" x2="10" y2="20"/></svg>Developers</span>',
        },
        {
          type: 'doc',
          docId: 'deployment/overview',
          position: 'left',
          html: '<span class="navbarItemWithIcon"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><rect x="3" y="4" width="18" height="6" rx="1.5"/><rect x="3" y="14" width="18" height="6" rx="1.5"/><line x1="7" y1="7" x2="7.01" y2="7"/><line x1="7" y1="17" x2="7.01" y2="17"/></svg>Deployment</span>',
        },
        {
          to: '/site-map',
          label: 'Site Map',
          position: 'left',
        },
        // {to: '/blog', label: 'Blog', position: 'left'},
        {
          href: 'https://github.com/CollabDigitalTwins/docs',
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
            {
              label: 'Site Map',
              to: '/site-map',
            },
          ],
        },
        {
          title: 'Community',
          items: [
            {
              label: 'GitHub',
              href: 'https://github.com/CollabDigitalTwins',
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
