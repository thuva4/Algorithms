import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class TopologicalSortVisualization implements GraphVisualizationEngine {
  name = 'Topological Sort';
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
    // Force directed for topological sort
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      directed: true,
      color: COLORS.unvisited,
    }));

    if (nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to sort',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      "Topological Sort using Kahn's algorithm (BFS-based)",
    ));

    // Compute in-degrees
    const inDegree = new Map<string, number>();
    const adjList = new Map<string, { target: string; edgeIdx: number }[]>();

    for (const n of nodes) {
      inDegree.set(n.id, 0);
      adjList.set(n.id, []);
    }

    edges.forEach((e, i) => {
      inDegree.set(e.target, (inDegree.get(e.target) ?? 0) + 1);
      adjList.get(e.source)?.push({ target: e.target, edgeIdx: i });
    });

    // Find initial zero in-degree nodes
    const queue: string[] = [];
    for (const n of nodes) {
      if (inDegree.get(n.id) === 0) {
        queue.push(n.id);
        nodeColors.set(n.id, COLORS.frontier);
      }
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Nodes with in-degree 0: ${queue.join(', ') || 'none'}`,
    ));

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Process node ${current} (position ${result.length} in topological order)`,
      ));

      const neighbors = adjList.get(current) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        edgeColors.set(String(edgeIdx), COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Remove edge ${current} -> ${target}, decrease in-degree of ${target}`,
        ));

        const newDeg = (inDegree.get(target) ?? 1) - 1;
        inDegree.set(target, newDeg);
        edgeColors.set(String(edgeIdx), COLORS.visited);

        if (newDeg === 0) {
          queue.push(target);
          nodeColors.set(target, COLORS.frontier);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Node ${target} now has in-degree 0, add to queue`,
          ));
        }
      }

      nodeColors.set(current, COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Node ${current} complete. Order so far: ${result.join(' -> ')}`,
      ));
    }

    // Check for cycle
    if (result.length < nodes.length) {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Cycle detected! Only ${result.length}/${nodes.length} nodes could be sorted.`,
      ));
    } else {
      // Highlight final order
      for (let i = 0; i < result.length; i++) {
        nodeColors.set(result[i], COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Topological order: ${result.join(' -> ')}`,
      ));
    }

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
