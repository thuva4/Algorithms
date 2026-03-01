import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class FloydWarshallVisualization implements GraphVisualizationEngine {
  name = 'Floyd-Warshall';
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
      color: COLORS.unvisited,
    }));

    const n = nodes.length;
    if (n === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeIds = nodes.map((nd) => nd.id);
    const idxOf = new Map<string, number>();
    nodeIds.forEach((id, i) => idxOf.set(id, i));

    // Initialize distance matrix
    const dist: number[][] = Array.from({ length: n }, () =>
      Array.from({ length: n }, () => Infinity),
    );
    for (let i = 0; i < n; i++) dist[i][i] = 0;

    for (const e of edges) {
      const si = idxOf.get(e.source);
      const ti = idxOf.get(e.target);
      if (si === undefined || ti === undefined) continue;
      const w = e.weight ?? 1;
      dist[si][ti] = Math.min(dist[si][ti], w);
      if (!e.directed) {
        dist[ti][si] = Math.min(dist[ti][si], w);
      }
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      'Initialize distance matrix from edge weights',
    ));

    // Floyd-Warshall main loop
    for (let k = 0; k < n; k++) {
      nodeColors.set(nodeIds[k], COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Intermediate node: ${nodeIds[k]} (iteration ${k + 1}/${n})`,
      ));

      for (let i = 0; i < n; i++) {
        for (let j = 0; j < n; j++) {
          if (i === j || i === k || j === k) continue;
          if (dist[i][k] === Infinity || dist[k][j] === Infinity) continue;

          const throughK = dist[i][k] + dist[k][j];

          if (throughK < dist[i][j]) {
            // Highlight the nodes involved
            nodeColors.set(nodeIds[i], COLORS.frontier);
            nodeColors.set(nodeIds[j], COLORS.frontier);

            // Find and highlight edges i->k and k->j
            const ikEdge = findEdgeIndex(edges, nodeIds[i], nodeIds[k]);
            const kjEdge = findEdgeIndex(edges, nodeIds[k], nodeIds[j]);
            if (ikEdge !== -1) edgeColors.set(String(ikEdge), COLORS.relaxing);
            if (kjEdge !== -1) edgeColors.set(String(kjEdge), COLORS.relaxing);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `dist[${nodeIds[i]}][${nodeIds[j]}] updated: ${dist[i][j] === Infinity ? '\u221E' : dist[i][j]} -> ${throughK} via ${nodeIds[k]}`,
            ));

            dist[i][j] = throughK;

            if (ikEdge !== -1) edgeColors.set(String(ikEdge), COLORS.unvisited);
            if (kjEdge !== -1) edgeColors.set(String(kjEdge), COLORS.unvisited);
            nodeColors.set(nodeIds[i], COLORS.unvisited);
            nodeColors.set(nodeIds[j], COLORS.unvisited);
          }
        }
      }

      nodeColors.set(nodeIds[k], COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Completed paths through ${nodeIds[k]}`,
      ));
    }

    // Build final summary
    const pairs: string[] = [];
    for (let i = 0; i < n && pairs.length < 6; i++) {
      for (let j = i + 1; j < n && pairs.length < 6; j++) {
        if (dist[i][j] !== Infinity) {
          pairs.push(`${nodeIds[i]}->${nodeIds[j]}:${dist[i][j]}`);
        }
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Floyd-Warshall complete. Sample distances: ${pairs.join(', ') || 'none'}`,
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

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}

function findEdgeIndex(
  edges: { source: string; target: string; directed?: boolean }[],
  from: string,
  to: string,
): number {
  return edges.findIndex(
    (e) =>
      (e.source === from && e.target === to) ||
      (!e.directed && e.source === to && e.target === from),
  );
}
