import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * All Topological Sorts visualization.
 * Enumerates all valid topological orderings of a DAG using backtracking.
 * Shows each valid ordering found.
 */
export class TopologicalSortAllVisualization implements GraphVisualizationEngine {
  name = 'All Topological Sorts';
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
      'All Topological Sorts: enumerate every valid topological ordering'));

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

    const results: string[][] = [];
    const current: string[] = [];
    const visited = new Set<string>();
    const MAX_RESULTS = 10; // Cap to avoid exponential blowup in visualization

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initial in-degrees: ${nodes.map((n) => `${n.id}:${inDegree.get(n.id)}`).join(', ')}`,
    ));

    const backtrack = () => {
      if (results.length >= MAX_RESULTS) return;

      // Find all nodes with in-degree 0 and not visited
      const available: string[] = [];
      for (const n of nodes) {
        if (!visited.has(n.id) && inDegree.get(n.id) === 0) {
          available.push(n.id);
        }
      }

      if (available.length === 0) {
        if (current.length === nodes.length) {
          results.push([...current]);

          // Color this ordering
          for (let i = 0; i < current.length; i++) {
            nodeColors.set(current[i], COLORS.inPath);
          }

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Topological order #${results.length}: ${current.join(' -> ')}`,
          ));

          // Reset colors
          for (const n of nodes) nodeColors.set(n.id, COLORS.unvisited);
        }
        return;
      }

      for (const node of available) {
        if (results.length >= MAX_RESULTS) return;

        // Choose node
        visited.add(node);
        current.push(node);
        nodeColors.set(node, COLORS.visiting);

        // Decrease in-degrees of neighbors
        for (const { target, edgeIdx } of adjList.get(node) ?? []) {
          inDegree.set(target, (inDegree.get(target) ?? 1) - 1);
          edgeColors.set(String(edgeIdx), COLORS.visited);
        }

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Pick ${node} (position ${current.length}). Available were: [${available.join(', ')}]`,
        ));

        backtrack();

        // Un-choose (backtrack)
        current.pop();
        visited.delete(node);
        nodeColors.set(node, COLORS.unvisited);

        for (const { target, edgeIdx } of adjList.get(node) ?? []) {
          inDegree.set(target, (inDegree.get(target) ?? 0) + 1);
          edgeColors.set(String(edgeIdx), COLORS.unvisited);
        }
      }
    };

    backtrack();

    // Final summary
    for (const n of nodes) nodeColors.set(n.id, COLORS.visited);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Found ${results.length}${results.length >= MAX_RESULTS ? '+' : ''} topological ordering(s)`,
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
