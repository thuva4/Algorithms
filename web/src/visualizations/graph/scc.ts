import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

// SCC color palette for distinguishing different components
const SCC_COMPONENT_COLORS = [
  '#3b82f6', // blue
  '#22c55e', // green
  '#ef4444', // red
  '#a855f7', // purple
  '#eab308', // yellow
  '#f97316', // orange
  '#06b6d4', // cyan
  '#ec4899', // pink
];

export class SCCVisualization implements GraphVisualizationEngine {
  name = 'Strongly Connected Components';
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
    // Force directed for SCC
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

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      "Finding SCCs using Kosaraju's algorithm",
    ));

    // Build adjacency lists
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

    // Phase 1: Forward DFS to compute finish order
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Phase 1: DFS on original graph to compute finish order',
    ));

    const visited = new Set<string>();
    const finishOrder: string[] = [];

    const dfsForward = (node: string) => {
      visited.add(node);
      nodeColors.set(node, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 1: Visit ${node}`,
      ));

      const neighbors = adjForward.get(node) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (visited.has(target)) continue;
        edgeColors.set(String(edgeIdx), COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase 1: Explore edge ${node} -> ${target}`,
        ));

        edgeColors.set(String(edgeIdx), COLORS.visited);
        dfsForward(target);
      }

      finishOrder.push(node);
      nodeColors.set(node, COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 1: ${node} finished (order position: ${finishOrder.length})`,
      ));
    };

    for (const n of nodes) {
      if (!visited.has(n.id)) {
        dfsForward(n.id);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Phase 1 complete. Finish order: ${finishOrder.join(', ')}`,
    ));

    // Phase 2: DFS on reversed graph in reverse finish order
    // Reset colors
    for (const n of nodes) nodeColors.set(n.id, COLORS.unvisited);
    for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      'Phase 2: DFS on reversed graph in reverse finish order',
    ));

    const visited2 = new Set<string>();
    const components: string[][] = [];

    const dfsReverse = (node: string, component: string[]) => {
      visited2.add(node);
      component.push(node);
      nodeColors.set(node, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Phase 2: Visit ${node} in reversed graph (SCC #${components.length + 1})`,
      ));

      const neighbors = adjReverse.get(node) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (visited2.has(target)) continue;
        edgeColors.set(String(edgeIdx), COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase 2: Explore reversed edge ${node} -> ${target}`,
        ));

        edgeColors.set(String(edgeIdx), COLORS.visited);
        dfsReverse(target, component);
      }
    };

    for (let i = finishOrder.length - 1; i >= 0; i--) {
      const node = finishOrder[i];
      if (!visited2.has(node)) {
        const component: string[] = [];
        dfsReverse(node, component);
        components.push(component);

        // Color the component
        const compColor = SCC_COMPONENT_COLORS[(components.length - 1) % SCC_COMPONENT_COLORS.length];
        for (const id of component) {
          nodeColors.set(id, compColor);
        }

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC #${components.length} found: {${component.join(', ')}}`,
        ));
      }
    }

    // Color edges within same SCC
    const nodeToSCC = new Map<string, number>();
    components.forEach((comp, idx) => {
      for (const id of comp) nodeToSCC.set(id, idx);
    });

    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const srcSCC = nodeToSCC.get(e.source);
      const tgtSCC = nodeToSCC.get(e.target);
      if (srcSCC !== undefined && srcSCC === tgtSCC) {
        edgeColors.set(String(i), SCC_COMPONENT_COLORS[srcSCC % SCC_COMPONENT_COLORS.length]);
      } else {
        edgeColors.set(String(i), COLORS.unvisited);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Found ${components.length} SCC(s): ${components.map((c, i) => `#${i + 1}{${c.join(',')}}`).join(' ')}`,
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

  reset(): void {
    this.currentStepIndex = -1;
  }

  getStepCount(): number {
    return this.steps.length;
  }

  getCurrentStep(): number {
    return this.currentStepIndex;
  }
}
