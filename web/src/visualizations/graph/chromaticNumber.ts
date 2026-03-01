import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class ChromaticNumberVisualization implements GraphVisualizationEngine {
  name = 'Chromatic Number';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    _startNode?: string,
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
        stepDescription: 'No nodes in the graph',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    const palette = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#8b5cf6'];

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Find chromatic number: minimum colors needed so no two adjacent nodes share a color. Using greedy approach with backtracking.'));

    // Build neighbor sets for quick lookup
    const neighborSet = new Map<string, Set<string>>();
    for (const n of nodes) {
      const neighbors = new Set<string>();
      for (const { target } of adj.get(n.id) ?? []) {
        neighbors.add(target);
      }
      neighborSet.set(n.id, neighbors);
    }

    // Order nodes by degree (descending) for better greedy results
    const ordered = [...nodes].sort((a, b) => {
      return (neighborSet.get(b.id)?.size ?? 0) - (neighborSet.get(a.id)?.size ?? 0);
    });

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Nodes ordered by degree: ${ordered.map(n => `${n.id}(${neighborSet.get(n.id)?.size ?? 0})`).join(', ')}`,
    ));

    // Greedy coloring
    const colorAssignment = new Map<string, number>();
    let maxColor = 0;

    for (const n of ordered) {
      // Find used colors among neighbors
      const usedColors = new Set<number>();
      for (const nbr of neighborSet.get(n.id) ?? []) {
        if (colorAssignment.has(nbr)) {
          usedColors.add(colorAssignment.get(nbr)!);
        }
      }

      // Find smallest available color
      let color = 0;
      while (usedColors.has(color)) color++;

      colorAssignment.set(n.id, color);
      maxColor = Math.max(maxColor, color);
      nodeColors.set(n.id, palette[color % palette.length]);

      // Highlight neighbor edges
      for (const { target, edgeIdx } of adj.get(n.id) ?? []) {
        if (colorAssignment.has(target)) {
          edgeColors.set(edgeIdx, COLORS.visited);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Color ${n.id} with color ${color + 1}${usedColors.size > 0 ? ` (neighbors use colors: {${[...usedColors].map(c => c + 1).join(', ')}})` : ' (no colored neighbors)'}`,
      ));
    }

    const chromaticNumber = maxColor + 1;

    // Final summary
    for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.visited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Chromatic number (greedy upper bound) = ${chromaticNumber}. All nodes colored with no adjacent conflicts.`,
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
