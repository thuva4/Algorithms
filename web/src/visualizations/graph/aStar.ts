import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class AStarVisualization implements GraphVisualizationEngine {
  name = 'A* Search';
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

    if (!start || !end) {
      const emptyState = snap(positionedNodes, coloredEdges, 'Need start and end nodes for A*');
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // Build position map for heuristic
    const posMap = new Map<string, { x: number; y: number }>();
    for (const n of positionedNodes) {
      posMap.set(n.id, { x: n.x, y: n.y });
    }

    // Heuristic: Euclidean distance based on node positions
    const heuristic = (a: string, b: string): number => {
      const pa = posMap.get(a);
      const pb = posMap.get(b);
      if (!pa || !pb) return 0;
      return Math.sqrt((pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2) / 50;
    };

    this.steps.push(snap(
      positionedNodes,
      coloredEdges,
      `A* Search from ${start} to ${end}. Using Euclidean distance heuristic.`,
    ));

    const gScore = new Map<string, number>();
    const fScore = new Map<string, number>();
    const prev = new Map<string, string | null>();
    const openSet = new Set<string>();
    const closedSet = new Set<string>();

    for (const n of nodes) {
      gScore.set(n.id, Infinity);
      fScore.set(n.id, Infinity);
      prev.set(n.id, null);
    }

    gScore.set(start, 0);
    fScore.set(start, heuristic(start, end));
    openSet.add(start);
    nodeColors.set(start, COLORS.frontier);

    this.steps.push(snap(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Add ${start} to open set. f(${start}) = ${fScore.get(start)?.toFixed(1)}`,
    ));

    let found = false;

    while (openSet.size > 0) {
      // Find node in open set with lowest fScore
      let current = '';
      let minF = Infinity;
      for (const id of openSet) {
        const f = fScore.get(id) ?? Infinity;
        if (f < minF) {
          minF = f;
          current = id;
        }
      }

      if (current === end) {
        found = true;
        nodeColors.set(current, COLORS.visiting);

        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Reached target ${end}! g(${end}) = ${gScore.get(end)?.toFixed(1)}`,
        ));
        break;
      }

      openSet.delete(current);
      closedSet.add(current);
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Process ${current}: f=${fScore.get(current)?.toFixed(1)}, g=${gScore.get(current)?.toFixed(1)}, h=${(minF - (gScore.get(current) ?? 0)).toFixed(1)}`,
      ));

      const neighbors = adj.get(current) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (closedSet.has(target)) continue;

        const edgeWeight = edges[Number(edgeIdx)]?.weight ?? 1;
        const tentativeG = (gScore.get(current) ?? Infinity) + edgeWeight;

        edgeColors.set(edgeIdx, COLORS.relaxing);

        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Consider ${current} -> ${target}: tentative g = ${tentativeG.toFixed(1)}`,
        ));

        if (tentativeG < (gScore.get(target) ?? Infinity)) {
          prev.set(target, current);
          gScore.set(target, tentativeG);
          fScore.set(target, tentativeG + heuristic(target, end));
          openSet.add(target);

          nodeColors.set(target, COLORS.frontier);
          edgeColors.set(edgeIdx, COLORS.inPath);

          this.steps.push(snap(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Updated ${target}: g=${tentativeG.toFixed(1)}, f=${fScore.get(target)?.toFixed(1)}`,
          ));
        } else {
          edgeColors.set(edgeIdx, COLORS.unvisited);

          this.steps.push(snap(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `No improvement for ${target}`,
          ));
        }
      }

      nodeColors.set(current, COLORS.visited);

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `${current} moved to closed set`,
      ));
    }

    if (found) {
      // Reconstruct path
      const path: string[] = [];
      let cur: string | null = end;
      while (cur !== null) {
        path.unshift(cur);
        cur = prev.get(cur) ?? null;
      }

      // Reset all colors
      for (const n of nodes) nodeColors.set(n.id, COLORS.visited);
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

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `A* path found: ${path.join(' -> ')} (cost: ${gScore.get(end)?.toFixed(1)})`,
      ));
    } else {
      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `No path found from ${start} to ${end}`,
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
