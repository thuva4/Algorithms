import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class KruskalsVisualization implements GraphVisualizationEngine {
  name = "Kruskal's MST";
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

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      "Kruskal's: Sort edges by weight, then greedily add to MST",
    ));

    // Sort edges by weight
    const sortedEdges = edges
      .map((e, i) => ({ ...e, origIdx: i }))
      .sort((a, b) => (a.weight ?? 1) - (b.weight ?? 1));

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Edges sorted by weight: ${sortedEdges.map((e) => `${e.source}-${e.target}(${e.weight ?? 1})`).join(', ')}`,
    ));

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
      const rootA = find(a);
      const rootB = find(b);
      if (rootA === rootB) return false;
      const rankA = rank.get(rootA) ?? 0;
      const rankB = rank.get(rootB) ?? 0;
      if (rankA < rankB) {
        parent.set(rootA, rootB);
      } else if (rankA > rankB) {
        parent.set(rootB, rootA);
      } else {
        parent.set(rootB, rootA);
        rank.set(rootA, rankA + 1);
      }
      return true;
    };

    let mstWeight = 0;
    let edgesAdded = 0;

    for (const edge of sortedEdges) {
      const eidx = String(edge.origIdx);

      edgeColors.set(eidx, COLORS.relaxing);
      nodeColors.set(edge.source, COLORS.visiting);
      nodeColors.set(edge.target, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Consider edge ${edge.source} - ${edge.target} (weight: ${edge.weight ?? 1})`,
      ));

      if (union(edge.source, edge.target)) {
        edgesAdded++;
        mstWeight += edge.weight ?? 1;
        edgeColors.set(eidx, COLORS.inPath);
        nodeColors.set(edge.source, COLORS.visited);
        nodeColors.set(edge.target, COLORS.visited);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Added to MST (no cycle). MST weight so far: ${mstWeight}`,
        ));
      } else {
        edgeColors.set(eidx, COLORS.unvisited);
        nodeColors.set(edge.source, COLORS.visited);
        nodeColors.set(edge.target, COLORS.visited);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Rejected edge ${edge.source} - ${edge.target}: would create a cycle`,
        ));
      }

      if (edgesAdded === nodes.length - 1) break;
    }

    // Final
    for (const n of nodes) nodeColors.set(n.id, COLORS.inPath);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Kruskal's MST complete. Total weight: ${mstWeight}, edges: ${edgesAdded}`,
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
