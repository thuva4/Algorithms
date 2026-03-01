import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

const SCC_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
  '#eab308', '#f97316', '#06b6d4', '#ec4899',
];

/**
 * SCC Condensation visualization.
 * 1. Find SCCs using Tarjan's algorithm.
 * 2. Build the condensation DAG (each SCC becomes a single node).
 * 3. Show the resulting DAG structure.
 */
export class StronglyConnectedCondensationVisualization implements GraphVisualizationEngine {
  name = 'SCC Condensation';
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
      'SCC Condensation: find SCCs, then build condensation DAG'));

    // Build adjacency
    const adj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, edgeIdx: i });
    });

    // Step 1: Tarjan's SCC
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      "Step 1: Find SCCs using Tarjan's algorithm",
    ));

    let idx = 0;
    const dfsIndex = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const components: string[][] = [];

    const tarjan = (u: string) => {
      dfsIndex.set(u, idx);
      lowlink.set(u, idx);
      idx++;
      stack.push(u);
      onStack.add(u);
      nodeColors.set(u, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Visit ${u} (index=${dfsIndex.get(u)}, lowlink=${lowlink.get(u)})`,
      ));

      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (!dfsIndex.has(target)) {
          edgeColors.set(String(edgeIdx), COLORS.relaxing);
          tarjan(target);
          lowlink.set(u, Math.min(lowlink.get(u)!, lowlink.get(target)!));
          edgeColors.set(String(edgeIdx), COLORS.visited);
        } else if (onStack.has(target)) {
          lowlink.set(u, Math.min(lowlink.get(u)!, dfsIndex.get(target)!));
          edgeColors.set(String(edgeIdx), COLORS.frontier);
        }
      }

      // Root of SCC
      if (lowlink.get(u) === dfsIndex.get(u)) {
        const comp: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
        } while (w !== u);

        components.push(comp);
        const color = SCC_COLORS[(components.length - 1) % SCC_COLORS.length];
        for (const id of comp) nodeColors.set(id, color);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC #${components.length} found: {${comp.join(', ')}}`,
        ));
      }
    };

    for (const n of nodes) {
      if (!dfsIndex.has(n.id)) tarjan(n.id);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Found ${components.length} SCCs. Building condensation DAG...`,
    ));

    // Step 2: Build condensation
    const nodeToSCC = new Map<string, number>();
    components.forEach((comp, i) => {
      for (const id of comp) nodeToSCC.set(id, i);
    });

    // Color intra-SCC edges
    const interSCCEdges = new Set<string>();
    for (let i = 0; i < edges.length; i++) {
      const e = edges[i];
      const srcSCC = nodeToSCC.get(e.source)!;
      const tgtSCC = nodeToSCC.get(e.target)!;
      if (srcSCC === tgtSCC) {
        edgeColors.set(String(i), SCC_COLORS[srcSCC % SCC_COLORS.length]);
      } else {
        const key = `${srcSCC}->${tgtSCC}`;
        if (!interSCCEdges.has(key)) {
          interSCCEdges.add(key);
          edgeColors.set(String(i), COLORS.visiting);
        } else {
          edgeColors.set(String(i), COLORS.unvisited);
        }
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Step 2: Condensation DAG has ${components.length} nodes, ${interSCCEdges.size} edges`,
    ));

    // Show condensation structure
    const condensationDesc = components.map((c, i) =>
      `SCC${i}: {${c.join(',')}}`
    ).join(', ');

    const dagEdges = [...interSCCEdges].map((e) => {
      const [s, t] = e.split('->');
      return `SCC${s}->SCC${t}`;
    }).join(', ');

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Condensation complete. Nodes: [${condensationDesc}]. DAG edges: [${dagEdges}]`,
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
