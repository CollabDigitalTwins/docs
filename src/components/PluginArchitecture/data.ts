import type { Layer, Edge } from '../PlatformArchitecture/src/types';
import {
  FilesIcon, GatewayIcon, StackIcon, LayersIcon,
} from '../PlatformArchitecture/src/kindIcons';

const DOT = '·';

export const PLUGIN_LAYERS: Layer[] = [
  {
    id: 'manifest',
    label: 'PLUGIN MANIFEST',
    note: 'Plugin contract',
    nodes: [{
      id: 'manifest',
      title: 'Plugin Manifest',
      subtitle: `slug ${DOT} name ${DOT} version ${DOT} capabilities[]`,
      kind: 'open',
      wide: true,
      Icon: FilesIcon,
      modules: [
        {
          name: 'Identity',
          items: [{ n: 'slug' }, { n: 'name' }, { n: 'version' }],
        },
        {
          name: 'Capabilities',
          items: [{ n: 'map.tools' }, { n: 'sidebar.items' }, { n: '...' }],
        },
        {
          name: 'Config',
          items: [{ n: 'configSchema' }, { n: 'requiredPermissions' }],
        },
      ],
    }],
  },
  {
    id: 'host',
    label: 'PLUGIN HOST',
    note: 'Lifecycle manager',
    nodes: [{
      id: 'host',
      title: 'PluginHost',
      subtitle: `loadPlugin ${DOT} unloadPlugin ${DOT} validates capabilities`,
      kind: 'core',
      wide: true,
      Icon: GatewayIcon,
      modules: [
        {
          name: 'Load',
          items: [{ n: 'loadPlugin(manifest, entry)' }],
        },
        {
          name: 'Context',
          items: [{ n: 'createPluginContext()' }, { n: 'ctx.register(key, item)' }],
        },
        {
          name: 'Unload',
          items: [{ n: 'deactivate()' }, { n: 'registry.deregisterAll(slug)' }],
        },
      ],
    }],
  },
  {
    id: 'registry',
    label: 'PLUGIN REGISTRY',
    note: 'Generic key→items store',
    nodes: [{
      id: 'registry',
      title: 'PluginRegistry',
      subtitle: `register ${DOT} getAll ${DOT} deregisterAll — unchanged`,
      kind: 'unstruct',
      wide: true,
      Icon: StackIcon,
      modules: [
        {
          name: 'Write',
          items: [{ n: 'register(key, item)' }],
        },
        {
          name: 'Read',
          items: [{ n: 'getAll(key): Item[]' }],
        },
        {
          name: 'Cleanup',
          items: [{ n: 'deregisterAll(pluginId)' }],
        },
      ],
    }],
  },
  {
    id: 'consumers',
    label: 'CONSUMER COMPONENTS',
    note: 'UI reads contribution points',
    nodes: [
      {
        id: 'toolbar',
        title: 'Toolbar.tsx',
        subtitle: `registry.getAll('map.tools')`,
        kind: 'map',
        Icon: LayersIcon,
      },
      {
        id: 'sidebar',
        title: 'Sidebar.tsx',
        subtitle: `registry.getAll('sidebar.items')`,
        kind: 'map',
        Icon: LayersIcon,
      },
      {
        id: 'new_consumer',
        title: 'NewPanel.tsx',
        subtitle: `registry.getAll('data.columns')`,
        kind: 'map',
        Icon: LayersIcon,
      },
    ],
  },
];

export const PLUGIN_EDGES: Edge[] = [
  { from: 'manifest', to: 'host',     kind: 'open',     style: 'solid' },
  { from: 'host',     to: 'registry', kind: 'core',     style: 'solid' },
  { from: 'registry', to: 'toolbar',  kind: 'map',      style: 'solid' },
  { from: 'registry', to: 'sidebar',  kind: 'map',      style: 'solid' },
  { from: 'registry', to: 'new_consumer', kind: 'map',  style: 'dashed' },
];
