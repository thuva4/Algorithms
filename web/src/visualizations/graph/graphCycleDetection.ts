import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class GraphCycleDetectionVisualization implements GraphVisualizationEngine {
  name = 'Graph Cycle Detection (DFS)';
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

    const isDirected = edges.some(e => e.directed);

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Cycle detection using DFS on ${isDirected ? 'directed' : 'undirected'} graph. White=unvisited, Yellow=in stack, Green=finished.`));

    // DFS-based cycle detection
    // For directed: WHITE (unvisited), GRAY (in recursion stack), BLACK (finished)
    // For undirected: track parent to avoid false positives
    const WHITE = 0, GRAY = 1, BLACK = 2;
    const color = new Map<string, number>();
    for (const n of nodes) color.set(n.id, WHITE);

    const parent = new Map<string, string | null>();
    let cycleFound = false;
    let cycleEdge: { from: string; to: string; edgeIdx: string } | null = null;

    const dfs = (u: string) => {
      if (cycleFound) return;

      color.set(u, GRAY);
      nodeColors.set(u, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `DFS: visit ${u} (mark as in-stack / gray)`,
      ));

      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (cycleFound) return;

        const targetColor = color.get(target)!;

        if (targetColor === WHITE) {
          parent.set(target, u);
          edgeColors.set(edgeIdx, COLORS.visiting);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Explore tree edge ${u} -> ${target}`,
          ));

          dfs(target);
          edgeColors.set(edgeIdx, COLORS.inPath);
        } else if (targetColor === GRAY) {
          // For undirected graphs, skip the parent edge
          if (!isDirected && target === parent.get(u)) continue;

          // Found a cycle!
          cycleFound = true;
          cycleEdge = { from: u, to: target, edgeIdx };
          edgeColors.set(edgeIdx, COLORS.relaxing);
          nodeColors.set(u, COLORS.relaxing);
          nodeColors.set(target, COLORS.relaxing);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back edge ${u} -> ${target}: CYCLE DETECTED!`,
          ));

          // Trace back through the cycle
          const cycleNodes = [u];
          let cur = parent.get(u);
          while (cur && cur !== target) {
            cycleNodes.push(cur);
            nodeColors.set(cur, COLORS.relaxing);
            cur = parent.get(cur) ?? null;
          }
          if (cur === target) cycleNodes.push(target);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Cycle: ${cycleNodes.reverse().join(' -> ')} -> ${cycleNodes[0]}`,
          ));

          return;
        } else {
          // BLACK node - cross/forward edge
          edgeColors.set(edgeIdx, COLORS.visited);
        }
      }

      color.set(u, BLACK);
      if (!cycleFound) {
        nodeColors.set(u, COLORS.visited);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `${u} finished (mark as black). No cycle through ${u}.`,
        ));
      }
    };

    for (const n of nodes) {
      if (cycleFound) break;
      if (color.get(n.id) === WHITE) {
        parent.set(n.id, null);
        dfs(n.id);
      }
    }

    if (!cycleFound) {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'DFS complete. No cycle found -- graph is acyclic.',
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
