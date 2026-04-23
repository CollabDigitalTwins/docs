import type { FC } from 'react';
import PlatformArchitecture from './PlatformArchitecture';
import type { PlatformArchitectureProps } from './PlatformArchitecture';
import { getBackendLayers, getBackendEdges } from './PlatformArchitecture/sections';

const BackendArchitectureDiagram: FC<Omit<PlatformArchitectureProps, 'layers' | 'edges'>> = (props) => (
    <PlatformArchitecture
        {...props}
        layers={getBackendLayers()}
        edges={getBackendEdges()}
    />
);

export default BackendArchitectureDiagram;
