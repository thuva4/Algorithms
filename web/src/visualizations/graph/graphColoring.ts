import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class GraphColoringVisualization implements GraphVisualizationEngine {
  name = 'Graph Coloring (Greedy)';
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
        stepDescription: 'No nodes in the graph',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    const palette = ['#3b82f6', '#22c55e', '#ef4444', '#eab308', '#a855f7', '#ec4899', '#06b6d4', '#f97316', '#14b8a6', '#8b5cf6'];
    const colorNames = ['Blue', 'Green', 'Red', 'Yellow', 'Purple', 'Pink', 'Cyan', 'Orange', 'Teal', 'Violet'];

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Graph coloring using greedy algorithm with Welsh-Powell ordering (nodes sorted by degree, descending).'));

    // Build neighbor sets
    const neighborSet = new Map<string, Set<string>>();
    for (const n of nodes) {
      const nbrs = new Set<string>();
      for (const { target } of adj.get(n.id) ?? []) nbrs.add(target);
      neighborSet.set(n.id, nbrs);
    }

    // Welsh-Powell ordering: sort by degree descending
    const ordered = [...nodes].sort((a, b) =>
      (neighborSet.get(b.id)?.size ?? 0) - (neighborSet.get(a.id)?.size ?? 0),
    );

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Nodes ordered by degree: ${ordered.map(n => `${n.id}(deg=${neighborSet.get(n.id)?.size ?? 0})`).join(', ')}`,
    ));

    const colorAssignment = new Map<string, number>();

    for (const n of ordered) {
      // Highlight current node being colored
      nodeColors.set(n.id, COLORS.visiting);

      // Highlight neighbor edges
      for (const { target, edgeIdx } of adj.get(n.id) ?? []) {
        if (colorAssignment.has(target)) {
          edgeColors.set(edgeIdx, COLORS.relaxing);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Coloring ${n.id}: check neighbor colors`,
      ));

      // Find colors used by neighbors
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
      nodeColors.set(n.id, palette[color % palette.length]);

      // Reset edge colors
      for (const { target, edgeIdx } of adj.get(n.id) ?? []) {
        if (colorAssignment.has(target)) {
          edgeColors.set(edgeIdx, COLORS.visited);
        }
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Assign ${n.id} -> ${colorNames[color % colorNames.length]} (color ${color + 1})${usedColors.size > 0 ? `. Neighbors use: {${[...usedColors].map(c => colorNames[c % colorNames.length]).join(', ')}}` : ''}`,
      ));
    }

    const colorsUsed = new Set(colorAssignment.values()).size;

    // Final: show all edges
    for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.visited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Graph coloring complete. ${colorsUsed} colors used. No two adjacent nodes share the same color.`,
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
