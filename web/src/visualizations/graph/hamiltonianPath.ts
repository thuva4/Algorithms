import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class HamiltonianPathVisualization implements GraphVisualizationEngine {
  name = 'Hamiltonian Path';
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

    // Build neighbor set and edge lookup
    const neighborSet = new Map<string, Set<string>>();
    const edgeIndex = new Map<string, string>();
    for (const n of nodes) {
      const nbrs = new Set<string>();
      for (const { target } of adj.get(n.id) ?? []) nbrs.add(target);
      neighborSet.set(n.id, nbrs);
    }
    edges.forEach((e, i) => {
      edgeIndex.set(`${e.source}-${e.target}`, String(i));
      if (!e.directed) edgeIndex.set(`${e.target}-${e.source}`, String(i));
    });

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Hamiltonian path: visit every node exactly once. Backtracking search on ${nodes.length} nodes.`));

    const path: string[] = [];
    const visited = new Set<string>();
    let found = false;

    const backtrack = (u: string, depth: number): boolean => {
      path.push(u);
      visited.add(u);
      nodeColors.set(u, COLORS.visiting);

      // Color edge from previous node
      if (path.length >= 2) {
        const prev = path[path.length - 2];
        const eIdx = edgeIndex.get(`${prev}-${u}`);
        if (eIdx) edgeColors.set(eIdx, COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Depth ${depth}: visit ${u}. Path: ${path.join(' -> ')}`,
      ));

      if (path.length === nodes.length) {
        // Found Hamiltonian path!
        found = true;
        for (const id of path) nodeColors.set(id, COLORS.inPath);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Hamiltonian path found: ${path.join(' -> ')}`,
        ));
        return true;
      }

      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (visited.has(target)) continue;

        edgeColors.set(edgeIdx, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Try edge ${u} -> ${target}`,
        ));

        if (backtrack(target, depth + 1)) return true;
      }

      // Backtrack
      path.pop();
      visited.delete(u);
      nodeColors.set(u, COLORS.unvisited);

      // Uncolor edge from previous node
      if (path.length >= 1) {
        const prev = path[path.length - 1];
        const eIdx = edgeIndex.get(`${prev}-${u}`);
        if (eIdx) edgeColors.set(eIdx, COLORS.unvisited);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Backtrack from ${u}. Path: ${path.length > 0 ? path.join(' -> ') : '(empty)'}`,
      ));

      return false;
    };

    // Try starting from each node (or the specified start node)
    const startCandidates = startNode ? [startNode] : nodes.map(n => n.id);

    for (const start of startCandidates) {
      if (found) break;

      // Reset state for new starting node
      path.length = 0;
      visited.clear();
      for (const n of nodes) nodeColors.set(n.id, COLORS.unvisited);
      for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Try starting from node ${start}`,
      ));

      backtrack(start, 0);
    }

    if (!found) {
      for (const n of nodes) nodeColors.set(n.id, COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'No Hamiltonian path exists in this graph.',
      ));
    }

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
