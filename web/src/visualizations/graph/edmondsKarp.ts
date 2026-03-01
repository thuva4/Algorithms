import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class EdmondsKarpVisualization implements GraphVisualizationEngine {
  name = 'Edmonds-Karp Algorithm';
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
      color: COLORS.unvisited,
    }));

    const source = startNode ?? nodes[0]?.id;
    const sink = endNode ?? nodes[nodes.length - 1]?.id;

    if (!source || !sink) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'Need source and sink for Edmonds-Karp',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // Build residual graph
    const capacity = new Map<string, number>();
    const flow = new Map<string, number>();
    const adjList = new Map<string, { target: string; edgeIdx: number }[]>();

    for (const n of nodes) adjList.set(n.id, []);

    edges.forEach((e, i) => {
      capacity.set(`${e.source}-${e.target}`, e.weight ?? 1);
      capacity.set(`${e.target}-${e.source}`, capacity.get(`${e.target}-${e.source}`) ?? 0);
      flow.set(`${e.source}-${e.target}`, 0);
      flow.set(`${e.target}-${e.source}`, 0);
      adjList.get(e.source)?.push({ target: e.target, edgeIdx: i });
      adjList.get(e.target)?.push({ target: e.source, edgeIdx: i });
    });

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Edmonds-Karp (BFS-based Ford-Fulkerson) from ${source} to ${sink}. Find shortest augmenting paths using BFS.`));

    let totalFlow = 0;
    let iteration = 0;

    while (iteration < 100) {
      iteration++;

      // BFS to find shortest augmenting path
      const parent = new Map<string, { from: string; edgeIdx: number } | null>();
      parent.set(source, null);
      const queue = [source];

      // Reset BFS visualization colors
      for (const n of nodes) {
        if (n.id !== source && n.id !== sink) nodeColors.set(n.id, COLORS.unvisited);
      }
      nodeColors.set(source, COLORS.relaxing);
      nodeColors.set(sink, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Iteration ${iteration}: BFS from ${source} to find augmenting path`,
      ));

      let found = false;
      while (queue.length > 0) {
        const u = queue.shift()!;
        for (const { target: v, edgeIdx } of adjList.get(u) ?? []) {
          const key = `${u}-${v}`;
          const residual = (capacity.get(key) ?? 0) - (flow.get(key) ?? 0);
          if (residual > 0 && !parent.has(v)) {
            parent.set(v, { from: u, edgeIdx });
            nodeColors.set(v, COLORS.frontier);
            queue.push(v);

            if (v === sink) {
              found = true;
              break;
            }
          }
        }
        if (found) break;
      }

      if (!found) {
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `No more augmenting paths found. Algorithm terminates.`,
        ));
        break;
      }

      // Trace path and find bottleneck
      let bottleneck = Infinity;
      const path: string[] = [sink];
      let cur = sink;
      while (cur !== source) {
        const p = parent.get(cur)!;
        const key = `${p.from}-${cur}`;
        bottleneck = Math.min(bottleneck, (capacity.get(key) ?? 0) - (flow.get(key) ?? 0));
        path.unshift(p.from);
        cur = p.from;
      }

      // Highlight augmenting path
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const p = parent.get(to);
        if (p) edgeColors.set(String(p.edgeIdx), COLORS.relaxing);
        nodeColors.set(from, COLORS.inPath);
      }
      nodeColors.set(sink, COLORS.inPath);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Augmenting path: ${path.join(' -> ')}, bottleneck = ${bottleneck}`,
      ));

      // Update flow
      for (let i = 0; i < path.length - 1; i++) {
        const fwd = `${path[i]}-${path[i + 1]}`;
        const bwd = `${path[i + 1]}-${path[i]}`;
        flow.set(fwd, (flow.get(fwd) ?? 0) + bottleneck);
        flow.set(bwd, (flow.get(bwd) ?? 0) - bottleneck);
      }

      totalFlow += bottleneck;

      // Update edge colors based on flow
      for (let i = 0; i < path.length - 1; i++) {
        const p = parent.get(path[i + 1]);
        if (p) edgeColors.set(String(p.edgeIdx), COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Flow updated by ${bottleneck}. Total flow = ${totalFlow}`,
      ));
    }

    // Final state
    nodeColors.set(source, COLORS.relaxing);
    nodeColors.set(sink, COLORS.visiting);
    for (const n of nodes) {
      if (n.id !== source && n.id !== sink) nodeColors.set(n.id, COLORS.visited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Edmonds-Karp complete. Maximum flow = ${totalFlow} (${iteration - 1} augmenting paths found)`,
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
