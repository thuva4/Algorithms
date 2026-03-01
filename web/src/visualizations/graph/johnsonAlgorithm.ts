import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Johnson's Algorithm visualization.
 * All-pairs shortest paths using Bellman-Ford reweighting + per-node Dijkstra.
 */
export class JohnsonAlgorithmVisualization implements GraphVisualizationEngine {
  name = "Johnson's Algorithm";
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
      directed: true,
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
    const INF = 1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      "Johnson's Algorithm: all-pairs shortest paths via Bellman-Ford reweighting + Dijkstra"));

    // Step 1: Add virtual node q with 0-weight edges to all nodes
    const nodeIds = nodes.map((n) => n.id);
    const VIRTUAL = '__q__';

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Step 1: Add virtual source q with 0-weight edges to all nodes',
    ));

    // Step 2: Bellman-Ford from q to compute h(v) potentials
    const h = new Map<string, number>();
    h.set(VIRTUAL, 0);
    for (const id of nodeIds) h.set(id, INF);

    // Virtual edges: q -> every node with weight 0
    const allEdges: { source: string; target: string; weight: number }[] = [
      ...edges.map((e) => ({ source: e.source, target: e.target, weight: e.weight ?? 1 })),
      ...nodeIds.map((id) => ({ source: VIRTUAL, target: id, weight: 0 })),
    ];

    for (const n of nodeIds) nodeColors.set(n, COLORS.unvisited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Step 2: Run Bellman-Ford from virtual node q to compute potentials h(v)',
    ));

    // Bellman-Ford relaxation
    const allNodeIds = [VIRTUAL, ...nodeIds];
    for (let i = 0; i < allNodeIds.length - 1; i++) {
      let updated = false;
      for (const e of allEdges) {
        const du = h.get(e.source) ?? INF;
        const dv = h.get(e.target) ?? INF;
        if (du + e.weight < dv) {
          h.set(e.target, du + e.weight);
          updated = true;
        }
      }
      if (!updated) break;
    }

    // Show potentials
    const potentials = nodeIds.map((id) => `h(${id})=${h.get(id) === INF ? 'inf' : h.get(id)}`).join(', ');
    for (const id of nodeIds) nodeColors.set(id, COLORS.visiting);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Bellman-Ford complete. Potentials: ${potentials}`,
    ));

    // Step 3: Reweight edges: w'(u,v) = w(u,v) + h(u) - h(v)
    for (const id of nodeIds) nodeColors.set(id, COLORS.unvisited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      "Step 3: Reweight edges: w'(u,v) = w(u,v) + h(u) - h(v). All weights now non-negative.",
    ));

    // Build adjacency with reweighted edges for Dijkstra
    const adjW = new Map<string, { target: string; weight: number; edgeIdx: number }[]>();
    for (const n of nodeIds) adjW.set(n, []);
    edges.forEach((e, i) => {
      const hu = h.get(e.source) ?? 0;
      const hv = h.get(e.target) ?? 0;
      const rw = (e.weight ?? 1) + hu - hv;
      adjW.get(e.source)?.push({ target: e.target, weight: rw, edgeIdx: i });
      if (!e.directed) {
        const rwRev = (e.weight ?? 1) + hv - hu;
        adjW.get(e.target)?.push({ target: e.source, weight: rwRev, edgeIdx: i });
      }
    });

    // Step 4: Dijkstra from each node
    const dist = new Map<string, Map<string, number>>();

    for (const source of nodeIds) {
      const d = new Map<string, number>();
      for (const id of nodeIds) d.set(id, INF);
      d.set(source, 0);
      const visited = new Set<string>();

      nodeColors.set(source, COLORS.relaxing);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Step 4: Dijkstra from node ${source} using reweighted edges`,
      ));

      for (let iter = 0; iter < nodeIds.length; iter++) {
        // Find minimum distance unvisited node
        let minD = INF;
        let u = '';
        for (const id of nodeIds) {
          if (!visited.has(id) && (d.get(id) ?? INF) < minD) {
            minD = d.get(id) ?? INF;
            u = id;
          }
        }
        if (u === '' || minD === INF) break;

        visited.add(u);
        nodeColors.set(u, COLORS.visiting);

        for (const { target, weight, edgeIdx } of adjW.get(u) ?? []) {
          if (visited.has(target)) continue;
          const newDist = (d.get(u) ?? INF) + weight;
          if (newDist < (d.get(target) ?? INF)) {
            d.set(target, newDist);
            edgeColors.set(String(edgeIdx), COLORS.relaxing);
          }
        }
      }

      // Convert back to original weights: d_orig(s,t) = d'(s,t) - h(s) + h(t)
      const origDist = new Map<string, number>();
      for (const id of nodeIds) {
        const dprime = d.get(id) ?? INF;
        if (dprime < INF) {
          origDist.set(id, dprime - (h.get(source) ?? 0) + (h.get(id) ?? 0));
        } else {
          origDist.set(id, INF);
        }
      }
      dist.set(source, origDist);

      // Show result for this source
      const distStr = nodeIds.map((id) => {
        const val = origDist.get(id);
        return `${id}:${val === INF ? 'inf' : val}`;
      }).join(', ');

      for (const id of nodeIds) nodeColors.set(id, COLORS.visited);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Dijkstra from ${source} done. Distances: ${distStr}`,
      ));

      // Reset for next source
      for (const id of nodeIds) nodeColors.set(id, COLORS.unvisited);
      for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);
    }

    // Final
    for (const id of nodeIds) nodeColors.set(id, COLORS.inPath);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      "Johnson's Algorithm complete. All-pairs shortest paths computed.",
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
