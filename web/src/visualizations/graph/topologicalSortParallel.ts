import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

const LEVEL_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
  '#eab308', '#f97316', '#06b6d4', '#ec4899',
];

/**
 * Parallel Topological Sort visualization.
 * Groups nodes into levels based on their dependencies.
 * Nodes in the same level can be processed in parallel.
 * Uses repeated Kahn's: all zero in-degree nodes form one level.
 */
export class TopologicalSortParallelVisualization implements GraphVisualizationEngine {
  name = 'Parallel Topological Sort';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      directed: true,
      color: COLORS.unvisited,
    }));

    if (nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to sort',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Parallel Topological Sort: group nodes into levels for parallel execution'));

    // Compute in-degrees
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    }
    edges.forEach((e, i) => {
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
      adjList.get(e.source)?.push({ target: e.target, edgeIdx: i });
    });

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `In-degrees: ${nodes.map((n) => `${n.id}:${inDegree.get(n.id)}`).join(', ')}`,
    ));

    const levels: string[][] = [];
    const processed = new Set<string>();
    let level = 0;

    while (processed.size < nodes.length) {
      // Find all zero in-degree nodes not yet processed
      const currentLevel: string[] = [];
      for (const n of nodes) {
        if (!processed.has(n.id) && inDegree.get(n.id) === 0) {
          currentLevel.push(n.id);
        }
      }

      if (currentLevel.length === 0) {
        // Cycle detected
        for (const n of nodes) {
          if (!processed.has(n.id)) nodeColors.set(n.id, COLORS.relaxing);
        }
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          'Cycle detected! Cannot complete topological sort.',
        ));
        break;
      }

      levels.push(currentLevel);
      const levelColor = LEVEL_COLORS[level % LEVEL_COLORS.length];

      // Highlight current level
      for (const id of currentLevel) {
        nodeColors.set(id, COLORS.frontier);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Level ${level}: [${currentLevel.join(', ')}] - can execute in parallel`,
      ));

      // Process all nodes in this level
      for (const id of currentLevel) {
        processed.add(id);
        nodeColors.set(id, COLORS.visiting);

        for (const { target, edgeIdx } of adjList.get(id) ?? []) {
          inDegree.set(target, (inDegree.get(target) ?? 1) - 1);
          edgeColors.set(String(edgeIdx), COLORS.visited);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Level ${level} processed. Remove edges, update in-degrees.`,
      ));

      // Assign final level color
      for (const id of currentLevel) {
        nodeColors.set(id, levelColor);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Level ${level} complete: [${currentLevel.join(', ')}]`,
      ));

      level++;
    }

    // Final summary
    if (processed.size === nodes.length) {
      const summary = levels.map((l, i) => `L${i}:[${l.join(',')}]`).join(' -> ');

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Parallel sort complete. ${levels.length} levels, critical path length = ${levels.length}. ${summary}`,
      ));
    }

    return this.steps[0];
  }

  step(): GraphVisualizationState | null {
    this.currentStepIndex++;
    if (this.currentStepIndex >= this.steps.length) {
      this.currentStepIndex = this.steps.length;
      return null;
    }
    return this.steps[this.currentStepIndex];
  }

  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
