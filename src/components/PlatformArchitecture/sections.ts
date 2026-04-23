/**
 * Section-specific architecture exports
 * Used to show filtered diagrams in Frontend, Backend, and Data Layer docs pages.
 * These reuse components from the full diagram without duplication.
 */

import type { Layer, Edge } from './src/types';
import { DEFAULT_LAYERS, DEFAULT_EDGES } from './src/data';

export function getFrontendLayers(): Layer[] {
    // User + Frontend only
    return DEFAULT_LAYERS.filter(l => ['user', 'frontend'].includes(l.id));
}

export function getFrontendEdges(): Edge[] {
    // Only the user → frontend edge
    return DEFAULT_EDGES.filter(e => ['user', 'frontend'].some(id => e.from === id || e.to === id));
}

export function getBackendLayers(): Layer[] {
    // API + Backend services only
    return DEFAULT_LAYERS.filter(l => ['api', 'backend'].includes(l.id));
}

export function getBackendEdges(): Edge[] {
    // API gateway → backend service edges
    return DEFAULT_EDGES.filter(e => {
        const layerIds = new Set(['api', 'backend']);
        const fromInScope = DEFAULT_LAYERS.find(l => l.nodes.some(n => n.id === e.from))?.id;
        const toInScope = DEFAULT_LAYERS.find(l => l.nodes.some(n => n.id === e.to))?.id;
        return fromInScope && toInScope && layerIds.has(fromInScope) && layerIds.has(toInScope);
    });
}

export function getDataLayerLayers(): Layer[] {
    // Backend + Data + Infrastructure
    return DEFAULT_LAYERS.filter(l => ['backend', 'data', 'infra'].includes(l.id));
}

export function getDataLayerEdges(): Edge[] {
    // Backend → Data + Data → Infrastructure edges
    return DEFAULT_EDGES.filter(e => {
        const layerIds = new Set(['backend', 'data', 'infra']);
        const fromInScope = DEFAULT_LAYERS.find(l => l.nodes.some(n => n.id === e.from))?.id;
        const toInScope = DEFAULT_LAYERS.find(l => l.nodes.some(n => n.id === e.to))?.id;
        return fromInScope && toInScope && layerIds.has(fromInScope) && layerIds.has(toInScope);
    });
}
