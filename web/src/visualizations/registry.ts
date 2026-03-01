import type { AnyVisualizationEngine, VisualizationType } from './types';
import { sortingVisualizations } from './sorting';
import { stringVisualizations } from './strings';
import { treeVisualizations } from './trees';
import { dpVisualizations } from './dynamic-programming';
import { graphVisualizations } from './graph';
import { backtrackingVisualizations } from './backtracking';
import { bitManipulationVisualizations } from './bit-manipulation';
import { cryptographyVisualizations } from './cryptography';
import { divideAndConquerVisualizations } from './divide-and-conquer';
import { geometryVisualizations } from './geometry';
import { searchingVisualizations } from './searching';
import { greedyVisualizations } from './greedy';
import { mathVisualizations } from './math';
import { dataStructuresVisualizations } from './data-structures';

const registry: Record<string, () => AnyVisualizationEngine> = {
  ...sortingVisualizations,
  ...stringVisualizations,
  ...treeVisualizations,
  ...dpVisualizations,
  ...graphVisualizations,
  ...backtrackingVisualizations,
  ...bitManipulationVisualizations,
  ...cryptographyVisualizations,
  ...divideAndConquerVisualizations,
  ...geometryVisualizations,
  ...searchingVisualizations,
  ...greedyVisualizations,
  ...mathVisualizations,
  ...dataStructuresVisualizations,
};

export function registerVisualizations(entries: Record<string, () => AnyVisualizationEngine>): void {
  Object.assign(registry, entries);
}

export function getVisualization(slug: string): AnyVisualizationEngine | null {
  const factory = registry[slug];
  return factory ? factory() : null;
}

export function hasVisualization(slug: string): boolean {
  return slug in registry;
}

export function getVisualizationType(slug: string): VisualizationType {
  const engine = getVisualization(slug);
  if (!engine) return 'sorting';
  return engine.visualizationType ?? 'sorting';
}
