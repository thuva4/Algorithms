import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Max-Flow Min-Cut visualization using Ford-Fulkerson with BFS (Edmonds-Karp).
 * Finds maximum flow from source to sink, then identifies the minimum cut.
 */
export class MaxFlowMinCutVisualization implements GraphVisualizationEngine {
  name = 'Max-Flow Min-Cut';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    startNode?: string,
    endNode?: string,
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      directed: true,
      color: COLORS.unvisited,
    }));

    const source = startNode ?? nodes[0]?.id;
    const sink = endNode ?? nodes[nodes.length - 1]?.id;

    if (!source || !sink || nodes.length < 2) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'Need at least 2 nodes for max-flow',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const nodeIds = nodes.map((n) => n.id);

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Max-Flow Min-Cut: source=${source}, sink=${sink}`));

    // Build capacity and flow structures
    // Use adjacency with capacity[u][v] and flow[u][v]
    const cap = new Map<string, Map<string, number>>();
    const edgeMap = new Map<string, number>(); // "u->v" -> edgeIdx
    for (const id of nodeIds) cap.set(id, new Map());

    edges.forEach((e, i) => {
      const c = cap.get(e.source)!;
      c.set(e.target, (c.get(e.target) ?? 0) + (e.weight ?? 1));
      edgeMap.set(`${e.source}->${e.target}`, i);
      // Initialize reverse for residual graph
      if (!cap.get(e.target)!.has(e.source)) {
        cap.get(e.target)!.set(e.source, 0);
      }
    });

    const residual = new Map<string, Map<string, number>>();
    for (const [u, neighbors] of cap) {
      residual.set(u, new Map(neighbors));
    }

    let totalFlow = 0;
    let iteration = 0;

    // BFS to find augmenting path
    const bfs = (): { path: string[]; bottleneck: number } | null => {
      const parent = new Map<string, string>();
      const visited = new Set<string>([source]);
      const queue = [source];

      while (queue.length > 0) {
        const u = queue.shift()!;
        const neighbors = residual.get(u);
        if (!neighbors) continue;

        for (const [v, resCap] of neighbors) {
          if (!visited.has(v) && resCap > 0) {
            visited.add(v);
            parent.set(v, u);
            if (v === sink) {
              // Reconstruct path and find bottleneck
              const path = [sink];
              let bottleneck = Infinity;
              let cur = sink;
              while (cur !== source) {
                const prev = parent.get(cur)!;
                bottleneck = Math.min(bottleneck, residual.get(prev)!.get(cur)!);
                path.unshift(prev);
                cur = prev;
              }
              return { path, bottleneck };
            }
            queue.push(v);
          }
        }
      }
      return null;
    };

    nodeColors.set(source, COLORS.inPath);
    nodeColors.set(sink, COLORS.relaxing);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize flow network. Source: ${source} (blue), Sink: ${sink} (red)`,
    ));

    // Main loop: find augmenting paths
    let result = bfs();
    while (result) {
      iteration++;
      const { path, bottleneck } = result;

      // Highlight augmenting path
      for (const id of nodeIds) {
        if (id === source) nodeColors.set(id, COLORS.inPath);
        else if (id === sink) nodeColors.set(id, COLORS.relaxing);
        else nodeColors.set(id, COLORS.unvisited);
      }
      for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

      for (let i = 0; i < path.length - 1; i++) {
        nodeColors.set(path[i], COLORS.visiting);
        nodeColors.set(path[i + 1], COLORS.visiting);
        const eidx = edgeMap.get(`${path[i]}->${path[i + 1]}`);
        if (eidx !== undefined) edgeColors.set(String(eidx), COLORS.frontier);
      }
      nodeColors.set(source, COLORS.inPath);
      nodeColors.set(sink, COLORS.relaxing);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Iteration ${iteration}: augmenting path ${path.join(' -> ')} with bottleneck ${bottleneck}`,
      ));

      // Update residual capacities
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        residual.get(u)!.set(v, residual.get(u)!.get(v)! - bottleneck);
        if (!residual.has(v)) residual.set(v, new Map());
        residual.get(v)!.set(u, (residual.get(v)!.get(u) ?? 0) + bottleneck);
      }

      totalFlow += bottleneck;

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Flow increased by ${bottleneck}. Total flow: ${totalFlow}`,
      ));

      result = bfs();
    }

    // Find minimum cut: nodes reachable from source in residual graph
    const reachable = new Set<string>();
    const bfsQueue = [source];
    reachable.add(source);
    while (bfsQueue.length > 0) {
      const u = bfsQueue.shift()!;
      for (const [v, resCap] of residual.get(u) ?? []) {
        if (!reachable.has(v) && resCap > 0) {
          reachable.add(v);
          bfsQueue.push(v);
        }
      }
    }

    // Color cut edges
    for (const id of nodeIds) {
      nodeColors.set(id, reachable.has(id) ? COLORS.inPath : COLORS.relaxing);
    }
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      if (reachable.has(e.source) && !reachable.has(e.target)) {
        edgeColors.set(String(i), COLORS.relaxing);
      } else {
        edgeColors.set(String(i), COLORS.unvisited);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Max-Flow = Min-Cut = ${totalFlow}. Source side: {${[...reachable].join(',')}}`,
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
