import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Longest Path in a DAG visualization.
 * Uses topological sort followed by dynamic programming relaxation
 * (negate the relaxation direction compared to shortest path).
 */
export class LongestPathVisualization implements GraphVisualizationEngine {
  name = 'Longest Path (DAG)';
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
    const NEG_INF = -1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Longest Path in DAG from ${start}: topological sort + DP relaxation`));

    // Build adjacency
    const adj = new Map<string, { target: string; weight: number; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, weight: e.weight ?? 1, edgeIdx: i });
    });

    // Topological sort via DFS
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
      `Topological order: ${topoOrder.join(' -> ')}`,
    ));

    // Initialize distances
    const dist = new Map<string, number>();
    const pred = new Map<string, string>();
    const predEdge = new Map<string, number>();
    for (const id of topoOrder) dist.set(id, NEG_INF);
    dist.set(start, 0);

    nodeColors.set(start, COLORS.visiting);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize dist[${start}] = 0, all others = -infinity`,
    ));

    // Relax edges in topological order
    for (const u of topoOrder) {
      const du = dist.get(u)!;
      if (du === NEG_INF) continue;

      nodeColors.set(u, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Process node ${u} (dist = ${du})`,
      ));

      for (const { target, weight, edgeIdx } of adj.get(u) ?? []) {
        edgeColors.set(String(edgeIdx), COLORS.relaxing);
        const newDist = du + weight;
        const oldDist = dist.get(target)!;

        if (newDist > oldDist) {
          dist.set(target, newDist);
          pred.set(target, u);
          predEdge.set(target, edgeIdx);
          nodeColors.set(target, COLORS.frontier);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Relax ${u} -> ${target}: dist[${target}] updated to ${newDist} (was ${oldDist === NEG_INF ? '-inf' : oldDist})`,
          ));
        } else {
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Edge ${u} -> ${target}: no improvement (${newDist} <= ${oldDist === NEG_INF ? '-inf' : oldDist})`,
          ));
        }
        edgeColors.set(String(edgeIdx), COLORS.unvisited);
      }

      nodeColors.set(u, COLORS.visited);
    }

    // Find longest reachable distance
    let maxDist = NEG_INF;
    let maxNode = start;
    for (const [id, d] of dist) {
      if (d > maxDist) {
        maxDist = d;
        maxNode = id;
      }
    }

    // Trace back the longest path
    const path: string[] = [];
    let cur: string | undefined = maxNode;
    while (cur !== undefined) {
      path.unshift(cur);
      nodeColors.set(cur, COLORS.inPath);
      const pe = predEdge.get(cur);
      if (pe !== undefined) edgeColors.set(String(pe), COLORS.inPath);
      cur = pred.get(cur);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Longest path: ${path.join(' -> ')} with total distance ${maxDist === NEG_INF ? 'unreachable' : maxDist}`,
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
