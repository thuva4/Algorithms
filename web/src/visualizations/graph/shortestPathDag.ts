import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Shortest Path in DAG visualization.
 * Topological sort followed by edge relaxation in topological order.
 * O(V + E) time complexity.
 */
export class ShortestPathDagVisualization implements GraphVisualizationEngine {
  name = 'Shortest Path (DAG)';
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
      directed: true,
      color: COLORS.unvisited,
    }));

    const start = startNode ?? nodes[0]?.id;
    if (!start || nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const INF = 1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Shortest Path in DAG from ${start}: topological sort + relaxation`));

    // Build adjacency
    const adj = new Map<string, { target: string; weight: number; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, weight: e.weight ?? 1, edgeIdx: i });
    });

    // Step 1: Topological sort via DFS
    const visited = new Set<string>();
    const topoOrder: string[] = [];

    const dfs = (u: string) => {
      visited.add(u);
      for (const { target } of adj.get(u) ?? []) {
        if (!visited.has(target)) dfs(target);
      }
      topoOrder.push(u);
    };

    for (const n of nodes) {
      if (!visited.has(n.id)) dfs(n.id);
    }
    topoOrder.reverse();

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Step 1: Topological order: ${topoOrder.join(' -> ')}`,
    ));

    // Step 2: Initialize distances
    const dist = new Map<string, number>();
    const pred = new Map<string, string>();
    const predEdge = new Map<string, number>();
    for (const id of topoOrder) dist.set(id, INF);
    dist.set(start, 0);

    nodeColors.set(start, COLORS.visiting);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Step 2: Initialize dist[${start}] = 0, all others = infinity`,
    ));

    // Step 3: Relax edges in topological order
    for (const u of topoOrder) {
      const du = dist.get(u)!;
      if (du === INF) continue;

      nodeColors.set(u, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Process ${u} (dist=${du})`,
      ));

      for (const { target, weight, edgeIdx } of adj.get(u) ?? []) {
        edgeColors.set(String(edgeIdx), COLORS.relaxing);
        const newDist = du + weight;
        const oldDist = dist.get(target)!;

        if (newDist < oldDist) {
          dist.set(target, newDist);
          pred.set(target, u);
          predEdge.set(target, edgeIdx);
          nodeColors.set(target, COLORS.frontier);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Relax ${u} -> ${target}: dist[${target}] = ${newDist} (was ${oldDist === INF ? 'inf' : oldDist})`,
          ));
        } else {
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `No relaxation ${u} -> ${target}: ${newDist} >= ${oldDist === INF ? 'inf' : oldDist}`,
          ));
        }
        edgeColors.set(String(edgeIdx), COLORS.unvisited);
      }

      nodeColors.set(u, COLORS.visited);
    }

    // Highlight shortest path tree
    for (const n of nodes) {
      const d = dist.get(n.id)!;
      nodeColors.set(n.id, d < INF ? COLORS.inPath : COLORS.unvisited);
    }
    for (const [, eidx] of predEdge) {
      edgeColors.set(String(eidx), COLORS.inPath);
    }

    const distStr = nodes.map((n) => {
      const d = dist.get(n.id)!;
      return `${n.id}:${d === INF ? 'inf' : d}`;
    }).join(', ');

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Shortest paths from ${start}: ${distStr}`,
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
