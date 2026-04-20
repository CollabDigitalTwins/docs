import type { IconComp } from './icons';
import {
  BookOpenIcon, RocketIcon, GlobeIcon, UsersIcon,
  CodeIcon, GitBranchIcon, EyeIcon, NetworkIcon,
} from './icons';

export type Capability = {
  Icon: IconComp;
  title: string;
  description: string;
  href: string;
};

export const CAPABILITIES: Capability[] = [
  {
    Icon: BookOpenIcon,
    title: 'Platform Overview',
    description:
      'Understand the CDT architecture — geospatial layers, BIM models, and the multi-scale data model.',
    href: '/docs/architecture/overview',
  },
  {
    Icon: RocketIcon,
    title: 'Getting Started',
    description:
      'Install dependencies, connect to a deployment, and load your first digital twin in minutes.',
    href: '/docs/getting-started/installation',
  },
  {
    Icon: GlobeIcon,
    title: 'Open Standards',
    description:
      'Built on CityGML, IFC, and OGC APIs. No proprietary lock-in — your data stays yours.',
    href: '/docs/concepts/open-standards',
  },
  {
    Icon: UsersIcon,
    title: 'Collaboration',
    description:
      'Multi-user sessions, comments, and shared views — built for interdisciplinary teams.',
    href: '/docs/authorization',
  },
  {
    Icon: CodeIcon,
    title: 'API Reference',
    description:
      'Full REST and WebSocket API surface for integrating CDT data into your own applications.',
    href: '/docs/architecture/backend-and-api',
  },
  {
    Icon: GitBranchIcon,
    title: 'Contributing',
    description:
      'CDT is stewarded as a Canadian not-for-profit. Learn how to contribute code, data, or feedback.',
    href: '/docs/contributing',
  },
  {
    Icon: EyeIcon,
    title: 'Transparent',
    description:
      'Foster trust and collaborative development through fully open source code and public roadmaps.',
    href: '/docs/introduction',
  },
  {
    Icon: NetworkIcon,
    title: 'Multidisciplinary',
    description:
      'Where we are today is evidence that we are stronger and smarter when we build together.',
    href: '/docs/introduction',
  },
];
