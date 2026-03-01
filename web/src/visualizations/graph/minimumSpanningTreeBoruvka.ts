import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Boruvka's MST visualization.
 * Each component selects its minimum weight outgoing edge simultaneously,
 * then components are merged. Repeats until one component remains.
 */
export class MinimumSpanningTreeBoruvkaVisualization implements GraphVisualizationEngine {
  name = "Boruvka's MST";
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
      "Boruvka's MST: each component picks cheapest outgoing edge each round"));

    // Union-Find
    const parent = new Map<string, string>();
    const rank = new Map<string, number>();
    for (const n of nodes) {
      parent.set(n.id, n.id);
      rank.set(n.id, 0);
    }

    const find = (x: string): string => {
      while (parent.get(x) !== x) {
        parent.set(x, parent.get(parent.get(x)!)!);
        x = parent.get(x)!;
      }
      return x;
    };

    const union = (a: string, b: string): boolean => {
      const ra = find(a);
      const rb = find(b);
      if (ra === rb) return false;
      const rankA = rank.get(ra) ?? 0;
      const rankB = rank.get(rb) ?? 0;
      if (rankA < rankB) parent.set(ra, rb);
      else if (rankA > rankB) parent.set(rb, ra);
      else { parent.set(rb, ra); rank.set(ra, rankA + 1); }
      return true;
    };

    let numComponents = nodes.length;
    let mstWeight = 0;
    let mstEdges = 0;
    let round = 0;

    while (numComponents > 1) {
      round++;

      // For each component, find cheapest outgoing edge
      const cheapest = new Map<string, { source: string; target: string; weight: number; edgeIdx: number }>();

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Round ${round}: ${numComponents} components. Each selects cheapest outgoing edge.`,
      ));

      edges.forEach((e, i) => {
        if (edgeColors.get(String(i)) === COLORS.inPath) return; // Already in MST
        const compS = find(e.source);
        const compT = find(e.target);
        if (compS === compT) return;

        const w = e.weight ?? 1;

        // Check for source component
        const curS = cheapest.get(compS);
        if (!curS || w < curS.weight) {
          cheapest.set(compS, { source: e.source, target: e.target, weight: w, edgeIdx: i });
        }

        // Check for target component
        const curT = cheapest.get(compT);
        if (!curT || w < curT.weight) {
          cheapest.set(compT, { source: e.source, target: e.target, weight: w, edgeIdx: i });
        }
      });

      if (cheapest.size === 0) break;

      // Highlight candidate edges
      for (const [, edge] of cheapest) {
        edgeColors.set(String(edge.edgeIdx), COLORS.relaxing);
        nodeColors.set(edge.source, COLORS.frontier);
        nodeColors.set(edge.target, COLORS.frontier);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Round ${round}: ${cheapest.size} cheapest edges identified`,
      ));

      // Add cheapest edges to MST
      const addedThisRound = new Set<number>();
      for (const [, edge] of cheapest) {
        if (addedThisRound.has(edge.edgeIdx)) continue;
        if (union(edge.source, edge.target)) {
          addedThisRound.add(edge.edgeIdx);
          edgeColors.set(String(edge.edgeIdx), COLORS.inPath);
          nodeColors.set(edge.source, COLORS.visited);
          nodeColors.set(edge.target, COLORS.visited);
          mstWeight += edge.weight;
          mstEdges++;
          numComponents--;

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Add edge ${edge.source} - ${edge.target} (weight: ${edge.weight}). MST weight: ${mstWeight}`,
          ));
        } else {
          edgeColors.set(String(edge.edgeIdx), COLORS.unvisited);
        }
      }

      // Reset non-MST highlighting
      for (const n of nodes) {
        if (nodeColors.get(n.id) !== COLORS.visited) {
          nodeColors.set(n.id, COLORS.unvisited);
        }
      }
    }

    // Final state
    for (const n of nodes) nodeColors.set(n.id, COLORS.inPath);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Boruvka's MST complete. Total weight: ${mstWeight}, edges: ${mstEdges}, rounds: ${round}`,
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
