import type { FC } from 'react';
import PlatformArchitecture from './PlatformArchitecture';
import type { PlatformArchitectureProps } from './PlatformArchitecture';
import { getDataLayerLayers, getDataLayerEdges } from './PlatformArchitecture/sections';

const DataLayerArchitectureDiagram: FC<Omit<PlatformArchitectureProps, 'layers' | 'edges'>> = (props) => (
    <PlatformArchitecture
        {...props}
        layers={getDataLayerLayers()}
        edges={getDataLayerEdges()}
    />
);

export default DataLayerArchitectureDiagram;
