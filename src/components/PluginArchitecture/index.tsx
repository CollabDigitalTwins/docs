import type { FC } from 'react';
import PlatformArchitecture from '../PlatformArchitecture';
import type { PlatformArchitectureProps } from '../PlatformArchitecture';
import { PLUGIN_LAYERS, PLUGIN_EDGES } from './data';

const PluginArchitecture: FC<Omit<PlatformArchitectureProps, 'layers' | 'edges'>> = (props) => (
  <PlatformArchitecture
    {...props}
    layers={PLUGIN_LAYERS}
    edges={PLUGIN_EDGES}
  />
);

export default PluginArchitecture;
