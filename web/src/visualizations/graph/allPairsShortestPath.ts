import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class AllPairsShortestPathVisualization implements GraphVisualizationEngine {
  name = 'All-Pairs Shortest Path (Floyd-Warshall)';
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

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const n = nodes.length;
    const ids = nodes.map(nd => nd.id);
    const idxOf = new Map<string, number>();
    ids.forEach((id, i) => idxOf.set(id, i));

    // Initialize distance matrix
    const dist: number[][] = Array.from({ length: n }, () => Array(n).fill(Infinity));
    for (let i = 0; i < n; i++) dist[i][i] = 0;

    for (const e of edges) {
      const si = idxOf.get(e.source);
      const ti = idxOf.get(e.target);
      if (si !== undefined && ti !== undefined) {
        const w = e.weight ?? 1;
        dist[si][ti] = Math.min(dist[si][ti], w);
        if (!e.directed) dist[ti][si] = Math.min(dist[ti][si], w);
      }
    }

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `All-Pairs Shortest Path using Floyd-Warshall on ${n} nodes. Initialize distance matrix from edge weights.`));

    // Floyd-Warshall: try each node as intermediate
    for (let k = 0; k < n; k++) {
      const kId = ids[k];
      nodeColors.set(kId, COLORS.relaxing);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Intermediate node k = ${kId}: check if routing through ${kId} improves any pair`,
      ));

      let improvements = 0;
      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (dist[i][k] + dist[k][j] < dist[i][j]) {
            dist[i][j] = dist[i][k] + dist[k][j];
            improvements++;
          }
        }
      }

      // Highlight edges that use this intermediate node
      for (let eIdx = 0; eIdx < edges.length; eIdx++) {
        const e = edges[eIdx];
        if (e.source === kId || e.target === kId) {
          edgeColors.set(String(eIdx), COLORS.visiting);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Through ${kId}: ${improvements} pair distances improved`,
      ));

      nodeColors.set(kId, COLORS.visited);

      // Reset edge highlights
      for (let eIdx = 0; eIdx < edges.length; eIdx++) {
        const e = edges[eIdx];
        if (e.source === kId || e.target === kId) {
          edgeColors.set(String(eIdx), COLORS.visited);
        }
      }
    }

    // Final: show all edges as computed
    for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.inPath);
    for (const id of ids) nodeColors.set(id, COLORS.visited);

    // Build summary of shortest paths
    const start = startNode ?? ids[0];
    const si = idxOf.get(start) ?? 0;
    const pathSummary = ids
      .filter(id => id !== start)
      .map(id => `${start}->${id}: ${dist[si][idxOf.get(id)!] === Infinity ? 'inf' : dist[si][idxOf.get(id)!]}`)
      .join(', ');

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `All-pairs shortest path complete. From ${start}: ${pathSummary}`,
    ));

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
