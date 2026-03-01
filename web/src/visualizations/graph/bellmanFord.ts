import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class BellmanFordVisualization implements GraphVisualizationEngine {
  name = 'Bellman-Ford';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    startNode?: string,
    endNode?: string,
  ): GraphVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const positionedNodes = layoutCircle(nodes);
    const coloredEdges: GraphEdge[] = edges.map((e) => ({
      ...e,
      color: COLORS.unvisited,
    }));

    const start = startNode ?? nodes[0]?.id;
    const end = endNode ?? nodes[nodes.length - 1]?.id;

    if (!start) {
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

    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();

    for (const n of nodes) {
      dist.set(n.id, Infinity);
      prev.set(n.id, null);
    }
    dist.set(start, 0);
    nodeColors.set(start, COLORS.frontier);

    this.steps.push(snapshot(
      positionedNodes,
      coloredEdges,
      `Initialize: dist[${start}] = 0, all others = Infinity`,
    ));

    const n = nodes.length;

    // Build a flat edge list for Bellman-Ford (expand undirected into both directions)
    const allEdges: { source: string; target: string; weight: number; origIdx: number }[] = [];
    edges.forEach((e, i) => {
      allEdges.push({ source: e.source, target: e.target, weight: e.weight ?? 1, origIdx: i });
      if (!e.directed) {
        allEdges.push({ source: e.target, target: e.source, weight: e.weight ?? 1, origIdx: i });
      }
    });

    let updated = false;
    for (let iteration = 0; iteration < n - 1; iteration++) {
      updated = false;

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Iteration ${iteration + 1} of ${n - 1}`,
      ));

      for (const edge of allEdges) {
        const srcDist = dist.get(edge.source) ?? Infinity;
        if (srcDist === Infinity) continue;

        const newDist = srcDist + edge.weight;
        const eidx = String(edge.origIdx);

        edgeColors.set(eidx, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Relax edge ${edge.source} -> ${edge.target} (w=${edge.weight}): dist = ${dist.get(edge.target) === Infinity ? '\u221E' : dist.get(edge.target)}, new = ${newDist}`,
        ));

        if (newDist < (dist.get(edge.target) ?? Infinity)) {
          dist.set(edge.target, newDist);
          prev.set(edge.target, edge.source);
          nodeColors.set(edge.target, COLORS.frontier);
          edgeColors.set(eidx, COLORS.inPath);
          updated = true;

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Updated dist[${edge.target}] = ${newDist}`,
          ));
        } else {
          edgeColors.set(eidx, COLORS.unvisited);
        }
      }

      if (!updated) {
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `No updates in iteration ${iteration + 1}, early termination`,
        ));
        break;
      }
    }

    // Check for negative-weight cycles
    let hasNegativeCycle = false;
    if (updated) {
      for (const edge of allEdges) {
        const srcDist = dist.get(edge.source) ?? Infinity;
        if (srcDist === Infinity) continue;
        if (srcDist + edge.weight < (dist.get(edge.target) ?? Infinity)) {
          hasNegativeCycle = true;
          break;
        }
      }
    }

    if (hasNegativeCycle) {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'Negative-weight cycle detected! Shortest paths undefined.',
      ));
    } else if (end && dist.get(end) !== Infinity) {
      // Reconstruct path
      const path: string[] = [];
      let cur: string | null = end;
      while (cur !== null) {
        path.unshift(cur);
        cur = prev.get(cur) ?? null;
      }

      // Mark all as visited first
      for (const nd of nodes) nodeColors.set(nd.id, COLORS.visited);
      for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

      for (const id of path) nodeColors.set(id, COLORS.inPath);
      for (let i = 0; i < path.length - 1; i++) {
        const from = path[i];
        const to = path[i + 1];
        const eIdx = edges.findIndex(
          (e) =>
            (e.source === from && e.target === to) ||
            (!e.directed && e.source === to && e.target === from),
        );
        if (eIdx !== -1) edgeColors.set(String(eIdx), COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Shortest path: ${path.join(' -> ')} (distance: ${dist.get(end)})`,
      ));
    } else {
      for (const nd of nodes) {
        if (dist.get(nd.id) !== Infinity) {
          nodeColors.set(nd.id, COLORS.visited);
        }
      }
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'Bellman-Ford complete. All reachable shortest distances computed.',
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
