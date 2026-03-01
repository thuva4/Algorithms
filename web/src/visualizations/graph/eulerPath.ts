import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class EulerPathVisualization implements GraphVisualizationEngine {
  name = 'Euler Path / Circuit';
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

    // Compute degrees
    const degree = new Map<string, number>();
    for (const n of nodes) {
      degree.set(n.id, (adj.get(n.id) ?? []).length);
    }

    const oddDegreeNodes = nodes.filter(n => (degree.get(n.id) ?? 0) % 2 !== 0);

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Euler path/circuit: traverse every edge exactly once. Degrees: ${nodes.map(n => `${n.id}:${degree.get(n.id)}`).join(', ')}`));

    // Check Euler path/circuit existence
    if (oddDegreeNodes.length !== 0 && oddDegreeNodes.length !== 2) {
      for (const n of oddDegreeNodes) nodeColors.set(n.id, COLORS.relaxing);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `${oddDegreeNodes.length} nodes with odd degree. Euler path/circuit does NOT exist (need 0 or 2 odd-degree nodes).`,
      ));
      return this.steps[0];
    }

    const isCircuit = oddDegreeNodes.length === 0;

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      isCircuit
        ? 'All nodes have even degree. Euler CIRCUIT exists.'
        : `Two odd-degree nodes: ${oddDegreeNodes[0].id}, ${oddDegreeNodes[1].id}. Euler PATH exists.`,
    ));

    // Hierholzer's algorithm
    const start = startNode ?? (oddDegreeNodes.length === 2 ? oddDegreeNodes[0].id : nodes[0].id);
    const usedEdge = new Set<string>();

    // Build mutable adjacency with edge tracking
    const adjMut = new Map<string, { target: string; edgeIdx: string }[]>();
    for (const n of nodes) {
      adjMut.set(n.id, [...(adj.get(n.id) ?? [])]);
    }

    const circuit: string[] = [];
    const stack = [start];

    nodeColors.set(start, COLORS.visiting);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Start Hierholzer's algorithm from ${start}`,
    ));

    while (stack.length > 0) {
      const v = stack[stack.length - 1];
      const neighbors = adjMut.get(v) ?? [];

      // Find unused edge
      let foundEdge = false;
      while (neighbors.length > 0) {
        const { target, edgeIdx } = neighbors.pop()!;
        if (usedEdge.has(edgeIdx)) continue;

        usedEdge.add(edgeIdx);
        // Also remove reverse for undirected
        const reverseNeighbors = adjMut.get(target) ?? [];
        const revIdx = reverseNeighbors.findIndex(n => n.edgeIdx === edgeIdx);
        if (revIdx !== -1) reverseNeighbors.splice(revIdx, 1);

        edgeColors.set(edgeIdx, COLORS.relaxing);
        nodeColors.set(target, COLORS.frontier);
        stack.push(target);
        foundEdge = true;

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Traverse edge ${v} -> ${target}. Stack: [${stack.join(', ')}]`,
        ));
        break;
      }

      if (!foundEdge) {
        stack.pop();
        circuit.push(v);
        nodeColors.set(v, COLORS.visited);

        // Color edges in circuit so far
        if (circuit.length >= 2) {
          const prev = circuit[circuit.length - 2];
          const cur = circuit[circuit.length - 1];
          const eIdx = edges.findIndex(e =>
            (e.source === prev && e.target === cur) || (!e.directed && e.source === cur && e.target === prev),
          );
          if (eIdx !== -1) edgeColors.set(String(eIdx), COLORS.inPath);
        }

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Backtrack: add ${v} to circuit. Circuit so far: [${circuit.join(', ')}]`,
        ));
      }
    }

    circuit.reverse();

    // Highlight final path
    for (const id of circuit) nodeColors.set(id, COLORS.inPath);
    for (let i = 0; i < circuit.length - 1; i++) {
      const from = circuit[i];
      const to = circuit[i + 1];
      const eIdx = edges.findIndex(e =>
        (e.source === from && e.target === to) || (!e.directed && e.source === to && e.target === from),
      );
      if (eIdx !== -1) edgeColors.set(String(eIdx), COLORS.inPath);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Euler ${isCircuit ? 'circuit' : 'path'}: ${circuit.join(' -> ')} (${usedEdge.size} edges traversed)`,
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
