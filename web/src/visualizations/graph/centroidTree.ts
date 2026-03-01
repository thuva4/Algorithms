import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class CentroidTreeVisualization implements GraphVisualizationEngine {
  name = 'Centroid Decomposition';
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

    if (nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes in the tree',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Centroid decomposition: recursively find the centroid of each subtree and remove it.'));

    const removed = new Set<string>();
    const centroidParent = new Map<string, string | null>();
    const decompositionColors = [COLORS.visited, COLORS.inPath, COLORS.frontier, COLORS.relaxing, COLORS.visiting, '#ec4899', '#06b6d4'];
    let level = 0;

    // Compute subtree sizes
    const getSize = (u: string, par: string | null): number => {
      if (removed.has(u)) return 0;
      let size = 1;
      for (const { target } of adj.get(u) ?? []) {
        if (target !== par && !removed.has(target)) {
          size += getSize(target, u);
        }
      }
      return size;
    };

    // Find centroid of subtree rooted at u
    const getCentroid = (u: string, par: string | null, treeSize: number): string => {
      let size = 1;
      let maxChild = 0;
      for (const { target } of adj.get(u) ?? []) {
        if (target !== par && !removed.has(target)) {
          const childSize = getSize(target, u);
          size += childSize;
          maxChild = Math.max(maxChild, childSize);
        }
      }
      maxChild = Math.max(maxChild, treeSize - size);
      if (maxChild <= Math.floor(treeSize / 2)) return u;

      for (const { target } of adj.get(u) ?? []) {
        if (target !== par && !removed.has(target)) {
          const result = getCentroid(target, u, treeSize);
          if (result) return result;
        }
      }
      return u;
    };

    const decompose = (u: string, par: string | null, depth: number) => {
      const treeSize = getSize(u, null);
      if (treeSize === 0) return;

      const centroid = getCentroid(u, null, treeSize);
      removed.add(centroid);
      centroidParent.set(centroid, par);

      const color = decompositionColors[depth % decompositionColors.length];
      nodeColors.set(centroid, color);

      // Highlight edges to centroid
      for (const { target, edgeIdx } of adj.get(centroid) ?? []) {
        if (!removed.has(target)) {
          edgeColors.set(edgeIdx, COLORS.visiting);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Depth ${depth}: centroid = ${centroid} (subtree size ${treeSize})${par ? `, parent centroid = ${par}` : ' (root of centroid tree)'}`,
      ));

      // Reset edge colors after showing
      for (const { target, edgeIdx } of adj.get(centroid) ?? []) {
        if (!removed.has(target)) {
          edgeColors.set(edgeIdx, color);
        }
      }

      // Recurse into remaining subtrees
      for (const { target } of adj.get(centroid) ?? []) {
        if (!removed.has(target)) {
          decompose(target, centroid, depth + 1);
        }
      }
    };

    const root = startNode ?? nodes[0]?.id;
    if (root) {
      decompose(root, null, 0);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Centroid decomposition complete. ${removed.size} centroids processed.`,
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
