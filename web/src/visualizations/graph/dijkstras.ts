import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class DijkstrasVisualization implements GraphVisualizationEngine {
  name = "Dijkstra's Shortest Path";
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
    const snap = (currentNodes: typeof positionedNodes, currentEdges: GraphEdge[], description: string) =>
      snapshot(currentNodes, currentEdges, description, { startNodeId: start, targetNodeId: end });

    if (!start) {
      const emptyState = snap(positionedNodes, coloredEdges, 'No nodes to process');
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // Distance and predecessor tracking
    const dist = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const visited = new Set<string>();

    for (const n of nodes) {
      dist.set(n.id, Infinity);
      prev.set(n.id, null);
    }
    dist.set(start, 0);

    this.steps.push(snap(
      positionedNodes,
      coloredEdges,
      `Initialize distances. dist[${start}] = 0, all others = Infinity`,
    ));

    nodeColors.set(start, COLORS.frontier);
    this.steps.push(snap(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Start node ${start} added to priority queue with distance 0`,
    ));

    const nodeIds = nodes.map((n) => n.id);

    while (true) {
      // Find unvisited node with smallest distance
      let minDist = Infinity;
      let current: string | null = null;
      for (const id of nodeIds) {
        if (!visited.has(id) && (dist.get(id) ?? Infinity) < minDist) {
          minDist = dist.get(id)!;
          current = id;
        }
      }

      if (current === null) break;

      visited.add(current);
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Extract min: node ${current} with distance ${dist.get(current)}`,
      ));

      if (current === end) {
        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Reached target node ${end} with distance ${dist.get(end)}`,
        ));
        break;
      }

      const neighbors = adj.get(current) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (visited.has(target)) continue;

        const edgeWeight = edges[Number(edgeIdx)]?.weight ?? 1;
        const newDist = (dist.get(current) ?? Infinity) + edgeWeight;

        edgeColors.set(edgeIdx, COLORS.relaxing);
        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Relax edge ${current} -> ${target}: current dist = ${dist.get(target) === Infinity ? '\u221E' : dist.get(target)}, new dist = ${newDist}`,
        ));

        if (newDist < (dist.get(target) ?? Infinity)) {
          dist.set(target, newDist);
          prev.set(target, current);
          nodeColors.set(target, COLORS.frontier);
          edgeColors.set(edgeIdx, COLORS.inPath);

          this.steps.push(snap(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Updated dist[${target}] = ${newDist} via ${current}`,
          ));
        } else {
          edgeColors.set(edgeIdx, COLORS.unvisited);
          this.steps.push(snap(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `No improvement for ${target}, keeping dist = ${dist.get(target)}`,
          ));
        }
      }

      nodeColors.set(current, COLORS.visited);
      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Node ${current} finalized with distance ${dist.get(current)}`,
      ));
    }

    // Reconstruct shortest path if end is reachable
    if (end && dist.get(end) !== Infinity) {
      const path: string[] = [];
      let cur: string | null = end;
      while (cur !== null) {
        path.unshift(cur);
        cur = prev.get(cur) ?? null;
      }

      // Reset colors for path highlight
      for (const id of nodeIds) {
        nodeColors.set(id, COLORS.visited);
      }
      for (let i = 0; i < edges.length; i++) {
        edgeColors.set(String(i), COLORS.unvisited);
      }

      for (const id of path) {
        nodeColors.set(id, COLORS.inPath);
      }
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

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Shortest path from ${start} to ${end}: ${path.join(' -> ')} (distance: ${dist.get(end)})`,
      ));
    } else {
      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        end ? `No path found from ${start} to ${end}` : "Dijkstra's algorithm complete",
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
