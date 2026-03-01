import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Kahn's Topological Sort visualization.
 * BFS-based approach using in-degree counting.
 * Repeatedly removes nodes with in-degree 0.
 */
export class TopologicalSortKahnVisualization implements GraphVisualizationEngine {
  name = "Kahn's Topological Sort";
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
        stepDescription: 'No nodes to sort',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      "Kahn's Topological Sort: BFS with in-degree tracking"));

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

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `In-degrees: ${nodes.map((n) => `${n.id}:${inDegree.get(n.id)}`).join(', ')}`,
    ));

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
      `Initial zero in-degree nodes: [${queue.join(', ')}]`,
    ));

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Dequeue ${current} (position ${result.length}). Queue: [${queue.join(', ')}]`,
      ));

      for (const { target, edgeIdx } of adjList.get(current) ?? []) {
        edgeColors.set(String(edgeIdx), COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Remove edge ${current} -> ${target}. in-degree[${target}]: ${inDegree.get(target)} -> ${(inDegree.get(target) ?? 1) - 1}`,
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
            `${target} now has in-degree 0. Enqueue. Queue: [${queue.join(', ')}]`,
          ));
        }
      }

      nodeColors.set(current, COLORS.visited);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `${current} done. Order so far: ${result.join(' -> ')}`,
      ));
    }

    // Check for cycle
    if (result.length < nodes.length) {
      // Mark unprocessed nodes as cycle members
      for (const n of nodes) {
        if (!result.includes(n.id)) nodeColors.set(n.id, COLORS.relaxing);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Cycle detected! Only ${result.length}/${nodes.length} nodes sorted. Remaining nodes form a cycle.`,
      ));
    } else {
      for (const id of result) nodeColors.set(id, COLORS.inPath);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Kahn's sort complete. Order: ${result.join(' -> ')}`,
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

  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
