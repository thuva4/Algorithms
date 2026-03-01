import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class BipartiteMatchingVisualization implements GraphVisualizationEngine {
  name = 'Bipartite Matching (Hopcroft-Karp style)';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    _startNode?: string,
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

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // 2-color to find bipartition
    const colorMap = new Map<string, number>();
    const queue: string[] = [];
    for (const n of nodes) {
      if (colorMap.has(n.id)) continue;
      colorMap.set(n.id, 0);
      queue.push(n.id);
      while (queue.length > 0) {
        const cur = queue.shift()!;
        for (const { target } of adj.get(cur) ?? []) {
          if (!colorMap.has(target)) {
            colorMap.set(target, 1 - colorMap.get(cur)!);
            queue.push(target);
          }
        }
      }
    }

    const leftSet = nodes.filter(n => colorMap.get(n.id) === 0).map(n => n.id);
    const rightSet = nodes.filter(n => colorMap.get(n.id) === 1).map(n => n.id);

    for (const id of leftSet) nodeColors.set(id, COLORS.inPath);
    for (const id of rightSet) nodeColors.set(id, COLORS.frontier);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Bipartite matching. Left set (blue): {${leftSet.join(', ')}}, Right set (purple): {${rightSet.join(', ')}}`,
    ));

    // Hungarian-style augmenting path matching
    const matchL = new Map<string, string | null>();
    const matchR = new Map<string, string | null>();
    for (const id of leftSet) matchL.set(id, null);
    for (const id of rightSet) matchR.set(id, null);

    const tryAugment = (u: string, visited: Set<string>): boolean => {
      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (visited.has(target)) continue;
        visited.add(target);

        edgeColors.set(edgeIdx, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Try matching ${u} -> ${target}`,
        ));

        const currentMatch = matchR.get(target);
        if (currentMatch === null || currentMatch === undefined || tryAugment(currentMatch, visited)) {
          matchL.set(u, target);
          matchR.set(target, u);
          edgeColors.set(edgeIdx, COLORS.inPath);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Match ${u} <-> ${target}`,
          ));
          return true;
        } else {
          edgeColors.set(edgeIdx, COLORS.unvisited);
        }
      }
      return false;
    };

    let matchingSize = 0;
    for (const u of leftSet) {
      nodeColors.set(u, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Find augmenting path from ${u}`,
      ));

      const visited = new Set<string>();
      if (tryAugment(u, visited)) {
        matchingSize++;
        nodeColors.set(u, COLORS.visited);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Augmenting path found for ${u}. Matching size = ${matchingSize}`,
        ));
      } else {
        nodeColors.set(u, COLORS.inPath);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `No augmenting path for ${u}`,
        ));
      }
    }

    // Final: highlight matched edges
    for (const [l, r] of matchL.entries()) {
      if (r) {
        nodeColors.set(l, COLORS.visited);
        nodeColors.set(r, COLORS.visited);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Maximum matching size = ${matchingSize}`,
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
