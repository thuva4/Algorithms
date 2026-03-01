import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class DinicVisualization implements GraphVisualizationEngine {
  name = 'Dinic\'s Algorithm';
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
        stepDescription: 'Need source and sink for Dinic\'s algorithm',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // Build capacity and flow matrices using edge indices
    const capacity = new Map<string, number>(); // "from-to" -> capacity
    const flow = new Map<string, number>();
    const adjList = new Map<string, { target: string; edgeIdx: number }[]>();

    for (const n of nodes) adjList.set(n.id, []);

    edges.forEach((e, i) => {
      const key = `${e.source}-${e.target}`;
      capacity.set(key, (e.weight ?? 1));
      flow.set(key, 0);
      flow.set(`${e.target}-${e.source}`, 0);
      capacity.set(`${e.target}-${e.source}`, capacity.get(`${e.target}-${e.source}`) ?? 0);
      adjList.get(e.source)?.push({ target: e.target, edgeIdx: i });
      adjList.get(e.target)?.push({ target: e.source, edgeIdx: i });
    });

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Dinic's max flow from ${source} to ${sink}. Builds level graph with BFS, then finds blocking flows with DFS.`));

    let totalFlow = 0;
    let phase = 0;

    const bfs = (): Map<string, number> | null => {
      const level = new Map<string, number>();
      level.set(source, 0);
      const queue = [source];

      while (queue.length > 0) {
        const u = queue.shift()!;
        for (const { target: v } of adjList.get(u) ?? []) {
          const key = `${u}-${v}`;
          const residual = (capacity.get(key) ?? 0) - (flow.get(key) ?? 0);
          if (residual > 0 && !level.has(v)) {
            level.set(v, level.get(u)! + 1);
            queue.push(v);
          }
        }
      }

      return level.has(sink) ? level : null;
    };

    const dfs = (u: string, pushed: number, level: Map<string, number>): number => {
      if (u === sink) return pushed;

      for (const { target: v, edgeIdx } of adjList.get(u) ?? []) {
        const key = `${u}-${v}`;
        const residual = (capacity.get(key) ?? 0) - (flow.get(key) ?? 0);
        if (residual > 0 && (level.get(v) ?? -1) === (level.get(u) ?? -1) + 1) {
          const d = dfs(v, Math.min(pushed, residual), level);
          if (d > 0) {
            flow.set(key, (flow.get(key) ?? 0) + d);
            flow.set(`${v}-${u}`, (flow.get(`${v}-${u}`) ?? 0) - d);
            edgeColors.set(String(edgeIdx), COLORS.inPath);
            return d;
          }
        }
      }
      return 0;
    };

    while (phase < 50) {
      const level = bfs();
      if (!level) break;

      phase++;

      // Visualize the level graph
      for (const n of nodes) {
        const l = level.get(n.id);
        if (l !== undefined) {
          nodeColors.set(n.id, l === 0 ? COLORS.relaxing : COLORS.frontier);
        } else {
          nodeColors.set(n.id, COLORS.unvisited);
        }
      }
      nodeColors.set(source, COLORS.relaxing);
      nodeColors.set(sink, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase ${phase}: BFS level graph built. ${level.size} reachable nodes. Levels: ${[...level.entries()].map(([id, l]) => `${id}:${l}`).join(', ')}`,
      ));

      // Find blocking flows
      let phaseFlow = 0;
      let iter = 0;
      while (iter < 100) {
        iter++;
        const pushed = dfs(source, Infinity, level);
        if (pushed <= 0) break;
        phaseFlow += pushed;
        totalFlow += pushed;

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase ${phase}: blocking flow pushed ${pushed} units. Phase total: ${phaseFlow}`,
        ));
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase ${phase} complete. Flow added: ${phaseFlow}. Total flow: ${totalFlow}`,
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
      `Dinic's algorithm complete. Maximum flow from ${source} to ${sink} = ${totalFlow}`,
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
