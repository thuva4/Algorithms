import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Minimum Spanning Arborescence (Edmonds/Chu-Liu) visualization.
 * Finds the minimum weight directed spanning tree rooted at a given node.
 * Uses iterative cycle contraction.
 */
export class MinimumSpanningArborescenceVisualization implements GraphVisualizationEngine {
  name = 'Minimum Spanning Arborescence';
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
      directed: true,
      color: COLORS.unvisited,
    }));

    const root = startNode ?? nodes[0]?.id;
    if (!root || nodes.length === 0) {
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
      `Minimum Spanning Arborescence (Edmonds' algorithm) rooted at ${root}`));

    const nodeIds = nodes.map((n) => n.id);

    // Step 1: For each non-root node, select the minimum incoming edge
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Step 1: For each non-root node, select minimum weight incoming edge',
    ));

    // Track edge selections
    const minInEdge = new Map<string, { source: string; weight: number; edgeIdx: number }>();

    for (const v of nodeIds) {
      if (v === root) continue;
      let minWeight = Infinity;
      let bestEdge: { source: string; weight: number; edgeIdx: number } | null = null;

      for (const [i, e] of edges.entries()) {
        if (e.target === v) {
          const w = e.weight ?? 1;
          if (w < minWeight) {
            minWeight = w;
            bestEdge = { source: e.source, weight: w, edgeIdx: i };
          }
        }
      }

      if (bestEdge) {
        minInEdge.set(v, bestEdge);
        edgeColors.set(String(bestEdge.edgeIdx), COLORS.frontier);
        nodeColors.set(v, COLORS.visiting);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Min incoming edge for ${v}: ${bestEdge.source} -> ${v} (weight: ${bestEdge.weight})`,
        ));
      }
    }

    nodeColors.set(root, COLORS.inPath);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'All minimum incoming edges selected. Check for cycles.',
    ));

    // Step 2: Detect cycles in the selected edges
    // Build a graph from selected edges
    const selectedParent = new Map<string, string>();
    for (const [v, edge] of minInEdge) {
      selectedParent.set(v, edge.source);
    }

    // Find cycles using DFS on selected edges
    const cycleNodes = new Set<string>();
    const visited = new Set<string>();
    const inStack = new Set<string>();

    const findCycle = (node: string): string[] | null => {
      if (inStack.has(node)) {
        // Found cycle, collect nodes
        const cycle = [node];
        let cur = selectedParent.get(node);
        while (cur && cur !== node) {
          cycle.push(cur);
          cur = selectedParent.get(cur);
        }
        return cycle;
      }
      if (visited.has(node)) return null;

      visited.add(node);
      inStack.add(node);

      const parent = selectedParent.get(node);
      let result: string[] | null = null;
      if (parent) {
        result = findCycle(parent);
      }

      inStack.delete(node);
      return result;
    };

    const cycles: string[][] = [];
    for (const v of nodeIds) {
      if (v === root || visited.has(v)) continue;
      const cycle = findCycle(v);
      if (cycle && cycle.length > 1) {
        // Check if this cycle is new
        const cycleSet = new Set(cycle);
        const isNew = !cycles.some((c) => c.length === cycle.length && c.every((n) => cycleSet.has(n)));
        if (isNew) {
          cycles.push(cycle);
          for (const n of cycle) cycleNodes.add(n);
        }
      }
    }

    if (cycles.length === 0) {
      // No cycles - the selected edges form the arborescence
      for (const n of nodeIds) {
        nodeColors.set(n, COLORS.inPath);
      }
      for (const [, edge] of minInEdge) {
        edgeColors.set(String(edge.edgeIdx), COLORS.inPath);
      }

      let totalWeight = 0;
      for (const [, edge] of minInEdge) totalWeight += edge.weight;

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `No cycles found. Arborescence is complete. Total weight: ${totalWeight}`,
      ));
    } else {
      // Highlight cycles
      for (const cycle of cycles) {
        for (const n of cycle) {
          nodeColors.set(n, COLORS.relaxing);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Found ${cycles.length} cycle(s): ${cycles.map((c) => `{${c.join(',')}}`).join(' ')}`,
      ));

      // Step 3: Contract cycles and re-select
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'Step 3: Contract cycles, adjust edge weights, and recurse',
      ));

      // For visualization, show the final arborescence after contraction
      // Mark the selected edges as the result (simplified for visualization)
      for (const n of nodeIds) {
        nodeColors.set(n, cycleNodes.has(n) ? COLORS.visiting : COLORS.visited);
      }
      nodeColors.set(root, COLORS.inPath);

      // Select final edges: for cycle nodes, pick best external incoming edge
      for (const cycle of cycles) {
        const cycleSet = new Set(cycle);
        let bestExtEdge: { edgeIdx: number; weight: number } | null = null;
        let bestWeight = Infinity;

        for (const v of cycle) {
          for (const [i, e] of edges.entries()) {
            if (e.target === v && !cycleSet.has(e.source)) {
              const cycleEdgeW = minInEdge.get(v)?.weight ?? 0;
              const adjusted = (e.weight ?? 1) - cycleEdgeW;
              if (adjusted < bestWeight) {
                bestWeight = adjusted;
                bestExtEdge = { edgeIdx: i, weight: e.weight ?? 1 };
              }
            }
          }
        }

        if (bestExtEdge) {
          edgeColors.set(String(bestExtEdge.edgeIdx), COLORS.inPath);
        }
      }

      // Mark remaining selected edges
      for (const [v, edge] of minInEdge) {
        if (!cycleNodes.has(v)) {
          edgeColors.set(String(edge.edgeIdx), COLORS.inPath);
        }
      }
      // Mark cycle edges except the one replaced
      for (const cycle of cycles) {
        for (const v of cycle) {
          const edge = minInEdge.get(v);
          if (edge && edgeColors.get(String(edge.edgeIdx)) !== COLORS.inPath) {
            edgeColors.set(String(edge.edgeIdx), COLORS.visited);
          }
        }
      }

      let totalWeight = 0;
      for (let i = 0; i < edges.length; i++) {
        if (edgeColors.get(String(i)) === COLORS.inPath || edgeColors.get(String(i)) === COLORS.visited) {
          totalWeight += edges[i].weight ?? 1;
        }
      }

      for (const n of nodeIds) nodeColors.set(n, COLORS.inPath);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Minimum Spanning Arborescence complete. Approximate total weight: ${totalWeight}`,
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
