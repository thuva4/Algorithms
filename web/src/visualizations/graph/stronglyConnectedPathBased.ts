import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

const SCC_COLORS = [
  '#3b82f6', '#22c55e', '#ef4444', '#a855f7',
  '#eab308', '#f97316', '#06b6d4', '#ec4899',
];

/**
 * Path-based SCC visualization.
 * Uses two stacks: S (nodes) and P (roots of potential SCCs).
 * When a node's DFS is complete, if it's still on top of P,
 * pop all nodes from S until the node is popped => forms one SCC.
 */
export class StronglyConnectedPathBasedVisualization implements GraphVisualizationEngine {
  name = 'Path-Based SCC';
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
      'Path-Based SCC: uses two stacks (S for nodes, P for SCC roots)'));

    // Build adjacency
    const adj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, edgeIdx: i });
    });

    let counter = 0;
    const preorder = new Map<string, number>();
    const assigned = new Set<string>();
    const S: string[] = []; // DFS stack of nodes
    const P: string[] = []; // Stack of potential SCC roots
    const components: string[][] = [];

    const dfs = (v: string) => {
      preorder.set(v, counter++);
      S.push(v);
      P.push(v);
      nodeColors.set(v, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Visit ${v} (preorder=${preorder.get(v)}). S=[${S.join(',')}] P=[${P.join(',')}]`,
      ));

      for (const { target, edgeIdx } of adj.get(v) ?? []) {
        if (!preorder.has(target)) {
          edgeColors.set(String(edgeIdx), COLORS.relaxing);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Tree edge: ${v} -> ${target}`,
          ));
          edgeColors.set(String(edgeIdx), COLORS.visited);
          dfs(target);
        } else if (!assigned.has(target)) {
          // Cross/back edge to unassigned node: pop P until top has preorder <= target's
          edgeColors.set(String(edgeIdx), COLORS.frontier);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back/cross edge: ${v} -> ${target} (preorder=${preorder.get(target)}). Pop P stack.`,
          ));

          while (P.length > 0 && preorder.get(P[P.length - 1])! > preorder.get(target)!) {
            P.pop();
          }

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `After popping P: P=[${P.join(',')}]`,
          ));
        }
      }

      // If v is the top of P, it's an SCC root
      if (P.length > 0 && P[P.length - 1] === v) {
        P.pop();
        const comp: string[] = [];

        // Pop S until v is popped
        while (S.length > 0) {
          const w = S.pop()!;
          assigned.add(w);
          comp.push(w);
          if (w === v) break;
        }

        components.push(comp);
        const color = SCC_COLORS[(components.length - 1) % SCC_COLORS.length];
        for (const id of comp) nodeColors.set(id, color);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC #${components.length}: {${comp.join(', ')}}. S=[${S.join(',')}] P=[${P.join(',')}]`,
        ));
      }
    };

    for (const n of nodes) {
      if (!preorder.has(n.id)) dfs(n.id);
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
      `Path-based SCC complete. Found ${components.length} SCC(s): ${components.map((c, i) => `#${i + 1}{${c.join(',')}}`).join(' ')}`,
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
