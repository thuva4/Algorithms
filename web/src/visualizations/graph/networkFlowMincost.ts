import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Min-Cost Max-Flow visualization.
 * Uses Successive Shortest Paths algorithm (Bellman-Ford for shortest path
 * in the residual graph with costs, then push flow along that path).
 */
export class NetworkFlowMincostVisualization implements GraphVisualizationEngine {
  name = 'Min-Cost Max-Flow';
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
        stepDescription: 'Need at least 2 nodes for min-cost flow',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const nodeIds = nodes.map((n) => n.id);
    const INF = 1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Min-Cost Max-Flow: source=${source}, sink=${sink}. Edge weight = capacity (cost = weight/2 heuristic).`));

    // Build capacity and cost structures
    // Treat weight as capacity, cost = ceil(weight/2) heuristic for visualization
    const cap = new Map<string, Map<string, number>>();
    const cost = new Map<string, Map<string, number>>();
    const edgeMap = new Map<string, number>();

    for (const id of nodeIds) {
      cap.set(id, new Map());
      cost.set(id, new Map());
    }

    edges.forEach((e, i) => {
      const c = e.weight ?? 1;
      cap.get(e.source)!.set(e.target, (cap.get(e.source)!.get(e.target) ?? 0) + c);
      cost.get(e.source)!.set(e.target, Math.ceil(c / 2));
      edgeMap.set(`${e.source}->${e.target}`, i);

      // Reverse edges for residual
      if (!cap.get(e.target)!.has(e.source)) {
        cap.get(e.target)!.set(e.source, 0);
        cost.get(e.target)!.set(e.source, -Math.ceil(c / 2));
      }
    });

    const residual = new Map<string, Map<string, number>>();
    for (const [u, neighbors] of cap) {
      residual.set(u, new Map(neighbors));
    }

    nodeColors.set(source, COLORS.inPath);
    nodeColors.set(sink, COLORS.relaxing);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize. Source: ${source}, Sink: ${sink}`,
    ));

    let totalFlow = 0;
    let totalCost = 0;
    let iteration = 0;

    // Bellman-Ford to find shortest (cheapest) path in residual graph
    const bellmanFord = (): { path: string[]; bottleneck: number; pathCost: number } | null => {
      const dist = new Map<string, number>();
      const parent = new Map<string, string>();
      for (const id of nodeIds) dist.set(id, INF);
      dist.set(source, 0);

      for (let i = 0; i < nodeIds.length - 1; i++) {
        for (const u of nodeIds) {
          if ((dist.get(u) ?? INF) === INF) continue;
          for (const [v, resCap] of residual.get(u) ?? []) {
            if (resCap > 0) {
              const newDist = (dist.get(u) ?? INF) + (cost.get(u)?.get(v) ?? 0);
              if (newDist < (dist.get(v) ?? INF)) {
                dist.set(v, newDist);
                parent.set(v, u);
              }
            }
          }
        }
      }

      if ((dist.get(sink) ?? INF) === INF) return null;

      // Reconstruct path
      const path = [sink];
      let bottleneck = Infinity;
      let cur = sink;
      while (cur !== source) {
        const prev = parent.get(cur)!;
        bottleneck = Math.min(bottleneck, residual.get(prev)!.get(cur)!);
        path.unshift(prev);
        cur = prev;
      }

      return { path, bottleneck, pathCost: dist.get(sink)! };
    };

    let result = bellmanFord();
    while (result) {
      iteration++;
      const { path, bottleneck, pathCost } = result;

      // Highlight path
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
        `Iteration ${iteration}: shortest path ${path.join(' -> ')} (cost ${pathCost}, bottleneck ${bottleneck})`,
      ));

      // Update residual
      for (let i = 0; i < path.length - 1; i++) {
        const u = path[i];
        const v = path[i + 1];
        residual.get(u)!.set(v, residual.get(u)!.get(v)! - bottleneck);
        if (!residual.has(v)) residual.set(v, new Map());
        residual.get(v)!.set(u, (residual.get(v)!.get(u) ?? 0) + bottleneck);
      }

      totalFlow += bottleneck;
      totalCost += pathCost * bottleneck;

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Flow +${bottleneck}. Total flow: ${totalFlow}, total cost: ${totalCost}`,
      ));

      result = bellmanFord();
    }

    // Final
    for (const id of nodeIds) nodeColors.set(id, COLORS.visited);
    nodeColors.set(source, COLORS.inPath);
    nodeColors.set(sink, COLORS.inPath);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Min-Cost Max-Flow complete. Max flow: ${totalFlow}, min cost: ${totalCost}`,
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
