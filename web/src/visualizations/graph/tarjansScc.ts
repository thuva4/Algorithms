import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

const SCC_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
  '#eab308', '#f97316', '#06b6d4', '#ec4899',
];

/**
 * Tarjan's SCC visualization.
 * Uses DFS with a stack and lowlink values. When lowlink[v] == index[v],
 * all nodes on the stack above v form an SCC.
 */
export class TarjansSccVisualization implements GraphVisualizationEngine {
  name = "Tarjan's SCC";
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
      "Tarjan's SCC: DFS with index and lowlink values"));

    // Build adjacency
    const adj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, edgeIdx: i });
    });

    let idx = 0;
    const dfsIndex = new Map<string, number>();
    const lowlink = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const components: string[][] = [];

    const strongConnect = (v: string) => {
      dfsIndex.set(v, idx);
      lowlink.set(v, idx);
      idx++;
      stack.push(v);
      onStack.add(v);

      nodeColors.set(v, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Visit ${v}: index=${dfsIndex.get(v)}, lowlink=${lowlink.get(v)}. Stack: [${stack.join(', ')}]`,
      ));

      for (const { target, edgeIdx } of adj.get(v) ?? []) {
        if (!dfsIndex.has(target)) {
          // Tree edge
          edgeColors.set(String(edgeIdx), COLORS.relaxing);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Tree edge: ${v} -> ${target}`,
          ));
          edgeColors.set(String(edgeIdx), COLORS.visited);

          strongConnect(target);
          lowlink.set(v, Math.min(lowlink.get(v)!, lowlink.get(target)!));

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back from ${target}: lowlink[${v}] = min(${lowlink.get(v)}, lowlink[${target}]=${lowlink.get(target)}) = ${Math.min(lowlink.get(v)!, lowlink.get(target)!)}`,
          ));
        } else if (onStack.has(target)) {
          // Back edge to node on stack
          edgeColors.set(String(edgeIdx), COLORS.frontier);
          lowlink.set(v, Math.min(lowlink.get(v)!, dfsIndex.get(target)!));

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back edge: ${v} -> ${target} (on stack). lowlink[${v}] = ${lowlink.get(v)}`,
          ));
        } else {
          // Cross edge to already-assigned node
          edgeColors.set(String(edgeIdx), COLORS.unvisited);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Cross edge: ${v} -> ${target} (already in SCC, ignore)`,
          ));
        }
      }

      // If v is a root of an SCC
      if (lowlink.get(v) === dfsIndex.get(v)) {
        const comp: string[] = [];
        let w: string;
        do {
          w = stack.pop()!;
          onStack.delete(w);
          comp.push(w);
        } while (w !== v);

        components.push(comp);
        const color = SCC_COLORS[(components.length - 1) % SCC_COLORS.length];
        for (const id of comp) nodeColors.set(id, color);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC root ${v}: pop stack -> SCC #${components.length}: {${comp.join(', ')}}`,
        ));
      }
    };

    for (const n of nodes) {
      if (!dfsIndex.has(n.id)) strongConnect(n.id);
    }

    // Color intra-SCC edges
    const nodeToSCC = new Map<string, number>();
    components.forEach((comp, i) => {
      for (const id of comp) nodeToSCC.set(id, i);
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
      `Tarjan's complete. Found ${components.length} SCC(s): ${components.map((c, i) => `#${i + 1}{${c.join(',')}}`).join(' ')}`,
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
