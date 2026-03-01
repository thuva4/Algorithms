import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class FloodFillVisualization implements GraphVisualizationEngine {
  name = 'Flood Fill';
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

    const start = startNode ?? nodes[0]?.id;

    if (!start) {
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

    const FILL_COLOR = COLORS.inPath;     // blue - the new fill color
    const ORIGINAL_COLOR = COLORS.unvisited; // gray - original "color" of nodes

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Flood fill from ${start}. Fill all connected nodes that share the original color (gray) with new color (blue).`));

    // BFS-based flood fill
    const filled = new Set<string>();
    const queue = [start];
    filled.add(start);

    nodeColors.set(start, COLORS.frontier);
    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Start flood fill at ${start}. Add to queue.`,
    ));

    while (queue.length > 0) {
      const current = queue.shift()!;
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Process ${current}: check neighbors for same-color nodes`,
      ));

      for (const { target, edgeIdx } of adj.get(current) ?? []) {
        if (filled.has(target)) {
          edgeColors.set(edgeIdx, COLORS.visited);
          continue;
        }

        // In a graph visualization, all nodes start as "same color" (unvisited)
        // We simulate checking if the neighbor has the original color
        edgeColors.set(edgeIdx, COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Check neighbor ${target}: same original color -- fill it`,
        ));

        filled.add(target);
        queue.push(target);
        nodeColors.set(target, COLORS.frontier);
        edgeColors.set(edgeIdx, FILL_COLOR);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Fill ${target} and add to queue. Queue size: ${queue.length}`,
        ));
      }

      nodeColors.set(current, FILL_COLOR);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `${current} fully processed and filled`,
      ));
    }

    // Highlight unfilled nodes differently
    for (const n of nodes) {
      if (!filled.has(n.id)) {
        nodeColors.set(n.id, COLORS.unvisited);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Flood fill complete. ${filled.size} nodes filled from ${start}: {${[...filled].join(', ')}}`,
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
