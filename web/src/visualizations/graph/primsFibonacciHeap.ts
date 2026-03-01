import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Prim's MST with Fibonacci Heap visualization.
 * Same algorithm as Prim's but uses a priority queue (simulated Fibonacci heap)
 * for O(E + V log V) complexity. Shows decrease-key operations.
 */
export class PrimsFibonacciHeapVisualization implements GraphVisualizationEngine {
  name = "Prim's MST (Fibonacci Heap)";
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

    const start = startNode ?? nodes[0]?.id;
    if (!start || nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const INF = 1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Prim's MST with Fibonacci Heap from ${start}. O(E + V log V) via decrease-key.`));

    // Priority queue simulation (min-heap by key)
    const key = new Map<string, number>();
    const parent = new Map<string, string>();
    const parentEdge = new Map<string, number>();
    const inMST = new Set<string>();

    for (const n of nodes) key.set(n.id, INF);
    key.set(start, 0);

    nodeColors.set(start, COLORS.frontier);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize: key[${start}] = 0, all others = infinity. Insert all into Fibonacci heap.`,
    ));

    let mstWeight = 0;

    while (inMST.size < nodes.length) {
      // Extract-min from heap
      let minKey = INF;
      let u = '';
      for (const n of nodes) {
        if (!inMST.has(n.id) && (key.get(n.id) ?? INF) < minKey) {
          minKey = key.get(n.id) ?? INF;
          u = n.id;
        }
      }

      if (u === '' || minKey === INF) {
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          'No more reachable vertices. Graph may be disconnected.',
        ));
        break;
      }

      inMST.add(u);
      mstWeight += minKey;
      nodeColors.set(u, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Extract-min: ${u} (key=${minKey}). Add to MST. MST weight: ${mstWeight}`,
      ));

      // Mark MST edge
      const pe = parentEdge.get(u);
      if (pe !== undefined) {
        edgeColors.set(String(pe), COLORS.inPath);
      }

      // Decrease-key for neighbors
      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (inMST.has(target)) continue;
        const w = edges[Number(edgeIdx)]?.weight ?? 1;
        const currentKey = key.get(target) ?? INF;

        edgeColors.set(edgeIdx, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Check edge ${u} - ${target} (weight: ${w}). Current key[${target}]=${currentKey === INF ? 'inf' : currentKey}`,
        ));

        if (w < currentKey) {
          key.set(target, w);
          parent.set(target, u);
          parentEdge.set(target, Number(edgeIdx));
          nodeColors.set(target, COLORS.frontier);
          edgeColors.set(edgeIdx, COLORS.frontier);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Decrease-key: key[${target}] = ${w} (via ${u}). O(1) in Fibonacci heap.`,
          ));
        } else {
          edgeColors.set(edgeIdx, COLORS.unvisited);
        }
      }

      nodeColors.set(u, COLORS.visited);
    }

    // Final state
    for (const n of nodes) {
      nodeColors.set(n.id, inMST.has(n.id) ? COLORS.inPath : COLORS.unvisited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Prim's (Fibonacci Heap) complete. MST weight: ${mstWeight}`,
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
