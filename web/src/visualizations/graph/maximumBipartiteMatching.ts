import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Maximum Bipartite Matching visualization using Hopcroft-Karp style
 * augmenting paths with DFS.
 */
export class MaximumBipartiteMatchingVisualization implements GraphVisualizationEngine {
  name = 'Maximum Bipartite Matching';
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

    if (nodes.length === 0) {
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

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Maximum Bipartite Matching: find maximum cardinality matching'));

    // BFS 2-coloring to partition into left/right
    const adj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, edgeIdx: i });
      if (!e.directed) {
        adj.get(e.target)?.push({ target: e.source, edgeIdx: i });
      }
    });

    const side = new Map<string, number>();
    for (const n of nodes) {
      if (side.has(n.id)) continue;
      const queue = [n.id];
      side.set(n.id, 0);
      while (queue.length > 0) {
        const cur = queue.shift()!;
        const c = side.get(cur)!;
        for (const { target } of adj.get(cur) ?? []) {
          if (!side.has(target)) {
            side.set(target, 1 - c);
            queue.push(target);
          }
        }
      }
    }

    const left = nodes.filter((n) => side.get(n.id) === 0).map((n) => n.id);
    const right = nodes.filter((n) => side.get(n.id) === 1).map((n) => n.id);

    for (const id of left) nodeColors.set(id, COLORS.frontier);
    for (const id of right) nodeColors.set(id, COLORS.visiting);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Bipartite partition: Left={${left.join(',')}} Right={${right.join(',')}}`,
    ));

    // Build adjacency for left nodes
    const leftAdj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const id of left) leftAdj.set(id, []);
    edges.forEach((e, i) => {
      if (left.includes(e.source)) {
        leftAdj.get(e.source)?.push({ target: e.target, edgeIdx: i });
      }
      if (!e.directed && left.includes(e.target)) {
        leftAdj.get(e.target)?.push({ target: e.source, edgeIdx: i });
      }
    });

    // Hungarian augmenting path matching
    const matchL = new Map<string, string>();
    const matchR = new Map<string, string>();
    const matchEdge = new Map<string, number>(); // "l->r" edge index

    let matchingSize = 0;

    for (const u of left) {
      nodeColors.set(u, COLORS.relaxing);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Try to find augmenting path from ${u}`,
      ));

      const visitedR = new Set<string>();

      const dfs = (node: string): boolean => {
        for (const { target, edgeIdx } of leftAdj.get(node) ?? []) {
          if (visitedR.has(target)) continue;
          visitedR.add(target);

          edgeColors.set(String(edgeIdx), COLORS.relaxing);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Consider edge ${node} - ${target}`,
          ));

          if (!matchR.has(target) || dfs(matchR.get(target)!)) {
            matchL.set(node, target);
            matchR.set(target, node);
            matchEdge.set(`${node}->${target}`, edgeIdx);
            edgeColors.set(String(edgeIdx), COLORS.inPath);
            nodeColors.set(node, COLORS.visited);
            nodeColors.set(target, COLORS.visited);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Match ${node} <-> ${target}`,
            ));
            return true;
          }

          edgeColors.set(String(edgeIdx), COLORS.unvisited);
        }
        return false;
      };

      if (dfs(u)) {
        matchingSize++;
      } else {
        nodeColors.set(u, COLORS.unvisited);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `No augmenting path from ${u}`,
        ));
      }
    }

    // Final state
    for (const n of nodes) {
      const id = n.id;
      nodeColors.set(id, matchL.has(id) || matchR.has(id) ? COLORS.inPath : COLORS.unvisited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Maximum Bipartite Matching complete. Matching size: ${matchingSize}`,
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
