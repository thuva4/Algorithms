import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class BipartiteCheckVisualization implements GraphVisualizationEngine {
  name = 'Bipartite Check';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    startNode?: string,
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      color: COLORS.unvisited,
    }));

    if (nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes in the graph',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Bipartite check using BFS 2-coloring. Attempt to color graph with 2 colors such that no adjacent nodes share a color.'));

    const COLOR_A = COLORS.inPath;   // blue
    const COLOR_B = COLORS.frontier; // purple
    const colorMap = new Map<string, number>(); // 0 or 1
    let isBipartite = true;

    for (const n of nodes) {
      if (colorMap.has(n.id)) continue;

      // BFS from this component
      colorMap.set(n.id, 0);
      nodeColors.set(n.id, COLOR_A);
      const queue = [n.id];

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Start BFS coloring from ${n.id} with color A (blue)`,
      ));

      while (queue.length > 0 && isBipartite) {
        const current = queue.shift()!;
        const currentColor = colorMap.get(current)!;
        const neighborColor = 1 - currentColor;

        for (const { target, edgeIdx } of adj.get(current) ?? []) {
          if (!colorMap.has(target)) {
            colorMap.set(target, neighborColor);
            nodeColors.set(target, neighborColor === 0 ? COLOR_A : COLOR_B);
            edgeColors.set(edgeIdx, COLORS.visited);
            queue.push(target);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Color ${target} with ${neighborColor === 0 ? 'A (blue)' : 'B (purple)'} -- opposite of ${current}`,
            ));
          } else if (colorMap.get(target) === currentColor) {
            isBipartite = false;
            edgeColors.set(edgeIdx, COLORS.relaxing);
            nodeColors.set(current, COLORS.relaxing);
            nodeColors.set(target, COLORS.relaxing);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Conflict! ${current} and ${target} share the same color -- NOT BIPARTITE`,
            ));
            break;
          } else {
            edgeColors.set(edgeIdx, COLORS.visited);
          }
        }
      }

      if (!isBipartite) break;
    }

    if (isBipartite) {
      const setA = [...colorMap.entries()].filter(([, c]) => c === 0).map(([id]) => id);
      const setB = [...colorMap.entries()].filter(([, c]) => c === 1).map(([id]) => id);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Graph IS bipartite. Set A: {${setA.join(', ')}}, Set B: {${setB.join(', ')}}`,
      ));
    } else {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'Graph is NOT bipartite. An odd-length cycle exists.',
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
