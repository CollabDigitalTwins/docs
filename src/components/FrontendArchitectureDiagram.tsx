import type { FC } from 'react';
import PlatformArchitecture from './PlatformArchitecture';
import type { PlatformArchitectureProps } from './PlatformArchitecture';
import { getFrontendLayers, getFrontendEdges } from './PlatformArchitecture/sections';

const FrontendArchitectureDiagram: FC<Omit<PlatformArchitectureProps, 'layers' | 'edges'>> = (props) => (
    <PlatformArchitecture
        {...props}
        layers={getFrontendLayers()}
        edges={getFrontendEdges()}
    />
);

export default FrontendArchitectureDiagram;
