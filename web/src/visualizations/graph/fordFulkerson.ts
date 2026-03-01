import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class FordFulkersonVisualization implements GraphVisualizationEngine {
  name = 'Ford-Fulkerson Algorithm';
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
        stepDescription: 'Need source and sink for Ford-Fulkerson',
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
      `Ford-Fulkerson max flow from ${source} to ${sink}. Find augmenting paths using DFS in residual graph.`));

    let totalFlow = 0;
    let iteration = 0;

    while (iteration < 100) {
      iteration++;

      // DFS to find augmenting path
      const parent = new Map<string, { from: string; edgeIdx: number } | null>();
      parent.set(source, null);
      const stack = [source];
      const visited = new Set<string>([source]);

      for (const n of nodes) {
        if (n.id !== source && n.id !== sink) nodeColors.set(n.id, COLORS.unvisited);
      }
      nodeColors.set(source, COLORS.relaxing);
      nodeColors.set(sink, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Iteration ${iteration}: DFS from ${source} to find augmenting path in residual graph`,
      ));

      let found = false;
      while (stack.length > 0 && !found) {
        const u = stack.pop()!;
        nodeColors.set(u, COLORS.visiting);

        for (const { target: v, edgeIdx } of adjList.get(u) ?? []) {
          const key = `${u}-${v}`;
          const residual = (capacity.get(key) ?? 0) - (flow.get(key) ?? 0);
          if (residual > 0 && !visited.has(v)) {
            visited.add(v);
            parent.set(v, { from: u, edgeIdx });
            nodeColors.set(v, COLORS.frontier);
            stack.push(v);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `DFS: explore ${u} -> ${v} (residual capacity: ${residual})`,
            ));

            if (v === sink) {
              found = true;
              break;
            }
          }
        }
      }

      if (!found) {
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          'No more augmenting paths. Algorithm terminates.',
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

      // Highlight path
      for (const id of path) nodeColors.set(id, COLORS.inPath);
      for (let i = 0; i < path.length - 1; i++) {
        const p = parent.get(path[i + 1]);
        if (p) edgeColors.set(String(p.edgeIdx), COLORS.relaxing);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Augmenting path: ${path.join(' -> ')}, bottleneck = ${bottleneck}`,
      ));

      // Update flow along path
      for (let i = 0; i < path.length - 1; i++) {
        const fwd = `${path[i]}-${path[i + 1]}`;
        const bwd = `${path[i + 1]}-${path[i]}`;
        flow.set(fwd, (flow.get(fwd) ?? 0) + bottleneck);
        flow.set(bwd, (flow.get(bwd) ?? 0) - bottleneck);
        const p = parent.get(path[i + 1]);
        if (p) edgeColors.set(String(p.edgeIdx), COLORS.inPath);
      }

      totalFlow += bottleneck;

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Flow updated by ${bottleneck}. Total flow = ${totalFlow}`,
      ));
    }

    // Final
    nodeColors.set(source, COLORS.relaxing);
    nodeColors.set(sink, COLORS.visiting);
    for (const n of nodes) {
      if (n.id !== source && n.id !== sink) nodeColors.set(n.id, COLORS.visited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Ford-Fulkerson complete. Maximum flow = ${totalFlow}`,
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
