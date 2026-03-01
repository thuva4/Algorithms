import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

const SCC_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
  '#eab308', '#f97316', '#06b6d4', '#ec4899',
];

/**
 * Kosaraju's SCC visualization.
 * Phase 1: DFS on original graph to get finish order.
 * Phase 2: DFS on transposed graph in reverse finish order to find SCCs.
 */
export class KosarajusSccVisualization implements GraphVisualizationEngine {
  name = "Kosaraju's SCC";
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

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      "Kosaraju's Algorithm: find strongly connected components"));

    // Build forward and reverse adjacency
    const adjForward = new Map<string, { target: string; edgeIdx: number }[]>();
    const adjReverse = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) {
      adjForward.set(n.id, []);
      adjReverse.set(n.id, []);
    }
    edges.forEach((e, i) => {
      adjForward.get(e.source)?.push({ target: e.target, edgeIdx: i });
      adjReverse.get(e.target)?.push({ target: e.source, edgeIdx: i });
    });

    // Phase 1: Forward DFS
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Phase 1: DFS on original graph to determine finish order',
    ));

    const visited = new Set<string>();
    const finishOrder: string[] = [];

    const dfs1 = (node: string) => {
      visited.add(node);
      nodeColors.set(node, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 1: Visit ${node}`,
      ));

      for (const { target, edgeIdx } of adjForward.get(node) ?? []) {
        if (visited.has(target)) continue;
        edgeColors.set(String(edgeIdx), COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase 1: Explore ${node} -> ${target}`,
        ));
        edgeColors.set(String(edgeIdx), COLORS.visited);
        dfs1(target);
      }

      finishOrder.push(node);
      nodeColors.set(node, COLORS.visited);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 1: ${node} finished (position ${finishOrder.length})`,
      ));
    };

    for (const n of nodes) {
      if (!visited.has(n.id)) dfs1(n.id);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Phase 1 complete. Finish order: ${finishOrder.join(', ')}`,
    ));

    // Reset colors for Phase 2
    for (const n of nodes) nodeColors.set(n.id, COLORS.unvisited);
    for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Phase 2: DFS on transposed graph in reverse finish order',
    ));

    // Phase 2: Reverse DFS
    const visited2 = new Set<string>();
    const components: string[][] = [];

    const dfs2 = (node: string, comp: string[]) => {
      visited2.add(node);
      comp.push(node);
      nodeColors.set(node, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 2: Visit ${node} (SCC #${components.length + 1})`,
      ));

      for (const { target, edgeIdx } of adjReverse.get(node) ?? []) {
        if (visited2.has(target)) continue;
        edgeColors.set(String(edgeIdx), COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase 2: Explore reverse edge ${node} -> ${target}`,
        ));
        edgeColors.set(String(edgeIdx), COLORS.visited);
        dfs2(target, comp);
      }
    };

    for (let i = finishOrder.length - 1; i >= 0; i--) {
      const node = finishOrder[i];
      if (!visited2.has(node)) {
        const comp: string[] = [];
        dfs2(node, comp);
        components.push(comp);

        const color = SCC_COLORS[(components.length - 1) % SCC_COLORS.length];
        for (const id of comp) nodeColors.set(id, color);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC #${components.length} found: {${comp.join(', ')}}`,
        ));
      }
    }

    // Color intra-SCC edges
    const nodeToSCC = new Map<string, number>();
    components.forEach((comp, idx) => {
      for (const id of comp) nodeToSCC.set(id, idx);
    });

    for (let i = 0; i < edges.length; i++) {
      const src = nodeToSCC.get(edges[i].source);
      const tgt = nodeToSCC.get(edges[i].target);
      if (src !== undefined && src === tgt) {
        edgeColors.set(String(i), SCC_COLORS[src % SCC_COLORS.length]);
      } else {
        edgeColors.set(String(i), COLORS.unvisited);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Kosaraju's complete. Found ${components.length} SCC(s): ${components.map((c, i) => `#${i + 1}{${c.join(',')}}`).join(' ')}`,
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
