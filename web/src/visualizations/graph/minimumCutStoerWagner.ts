import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Stoer-Wagner Minimum Cut visualization.
 * Finds the global minimum cut in an undirected weighted graph
 * by repeatedly performing "minimum cut phase" and merging vertices.
 */
export class MinimumCutStoerWagnerVisualization implements GraphVisualizationEngine {
  name = 'Stoer-Wagner Minimum Cut';
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

    if (nodes.length < 2) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'Need at least 2 nodes for minimum cut',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Stoer-Wagner: find global minimum cut in undirected graph'));

    // Build weighted adjacency matrix
    const activeNodes = new Set(nodes.map((n) => n.id));
    const w = new Map<string, Map<string, number>>();
    for (const n of nodes) w.set(n.id, new Map());

    edges.forEach((e) => {
      const wt = e.weight ?? 1;
      w.get(e.source)!.set(e.target, (w.get(e.source)!.get(e.target) ?? 0) + wt);
      w.get(e.target)!.set(e.source, (w.get(e.target)!.get(e.source) ?? 0) + wt);
    });

    // Track merged nodes for visualization
    const mergedInto = new Map<string, string[]>();
    for (const n of nodes) mergedInto.set(n.id, [n.id]);

    let bestCut = Infinity;
    let bestPartition: Set<string> = new Set();
    let phase = 0;

    while (activeNodes.size > 1) {
      phase++;
      // Minimum Cut Phase
      const active = [...activeNodes];
      const A = new Set<string>();
      const keyOf = new Map<string, number>();
      for (const id of active) keyOf.set(id, 0);

      // Start from first active node
      const first = active[0];
      A.add(first);
      // Update keys
      for (const [v, wt] of w.get(first) ?? []) {
        if (activeNodes.has(v) && !A.has(v)) {
          keyOf.set(v, (keyOf.get(v) ?? 0) + wt);
        }
      }

      nodeColors.set(first, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase ${phase}: Start maximum adjacency ordering from ${first}`,
      ));

      let lastAdded = first;
      let secondLast = first;

      while (A.size < activeNodes.size) {
        // Find most tightly connected vertex
        let maxKey = -1;
        let maxNode = '';
        for (const id of activeNodes) {
          if (!A.has(id) && (keyOf.get(id) ?? 0) > maxKey) {
            maxKey = keyOf.get(id) ?? 0;
            maxNode = id;
          }
        }

        secondLast = lastAdded;
        lastAdded = maxNode;
        A.add(maxNode);

        nodeColors.set(maxNode, COLORS.frontier);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase ${phase}: Add ${maxNode} (key=${maxKey}) to ordering`,
        ));

        // Update keys
        for (const [v, wt] of w.get(maxNode) ?? []) {
          if (activeNodes.has(v) && !A.has(v)) {
            keyOf.set(v, (keyOf.get(v) ?? 0) + wt);
          }
        }
      }

      // Cut of the phase = key of last added vertex
      const cutWeight = keyOf.get(lastAdded) ?? 0;

      // Highlight last vertex as potential cut
      for (const id of activeNodes) nodeColors.set(id, COLORS.visited);
      nodeColors.set(lastAdded, COLORS.relaxing);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase ${phase}: Cut-of-the-phase = ${cutWeight} (last vertex: ${lastAdded})`,
      ));

      if (cutWeight < bestCut) {
        bestCut = cutWeight;
        bestPartition = new Set(mergedInto.get(lastAdded) ?? []);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `New best cut: ${bestCut}. Partition: {${[...bestPartition].join(',')}}`,
        ));
      }

      // Merge lastAdded into secondLast
      // Update weights
      for (const [v, wt] of w.get(lastAdded) ?? []) {
        if (v === secondLast) continue;
        if (!w.has(secondLast)) continue;
        w.get(secondLast)!.set(v, (w.get(secondLast)!.get(v) ?? 0) + wt);
        w.get(v)!.set(secondLast, (w.get(v)!.get(secondLast) ?? 0) + wt);
      }

      // Merge tracking
      const merged = mergedInto.get(secondLast) ?? [];
      merged.push(...(mergedInto.get(lastAdded) ?? []));
      mergedInto.set(secondLast, merged);

      // Remove lastAdded
      activeNodes.delete(lastAdded);
      w.delete(lastAdded);
      for (const [, neighbors] of w) neighbors.delete(lastAdded);

      nodeColors.set(lastAdded, COLORS.unvisited);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Merge ${lastAdded} into ${secondLast}. Active nodes: ${activeNodes.size}`,
      ));

      // Reset colors
      for (const n of nodes) nodeColors.set(n.id, COLORS.unvisited);
    }

    // Highlight minimum cut
    for (const n of nodes) {
      nodeColors.set(n.id, bestPartition.has(n.id) ? COLORS.relaxing : COLORS.inPath);
    }
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const sIn = bestPartition.has(e.source);
      const tIn = bestPartition.has(e.target);
      if (sIn !== tIn) {
        edgeColors.set(String(i), COLORS.relaxing);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Stoer-Wagner complete. Minimum cut = ${bestCut}`,
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
