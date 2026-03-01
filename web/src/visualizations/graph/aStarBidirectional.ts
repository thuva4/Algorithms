import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class AStarBidirectionalVisualization implements GraphVisualizationEngine {
  name = 'Bidirectional A*';
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

    if (!start || !end) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'Need start and end nodes for Bidirectional A*',
      };
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

    const heuristic = (a: string, b: string): number => {
      const pa = posMap.get(a);
      const pb = posMap.get(b);
      if (!pa || !pb) return 0;
      return Math.sqrt((pa.x - pb.x) ** 2 + (pa.y - pb.y) ** 2) / 50;
    };

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Bidirectional A* from ${start} to ${end}. Two searches expand toward each other.`));

    // Forward search state
    const gF = new Map<string, number>();
    const fF = new Map<string, number>();
    const prevF = new Map<string, string | null>();
    const openF = new Set<string>();
    const closedF = new Set<string>();

    // Backward search state
    const gB = new Map<string, number>();
    const fB = new Map<string, number>();
    const prevB = new Map<string, string | null>();
    const openB = new Set<string>();
    const closedB = new Set<string>();

    for (const n of nodes) {
      gF.set(n.id, Infinity);
      fF.set(n.id, Infinity);
      prevF.set(n.id, null);
      gB.set(n.id, Infinity);
      fB.set(n.id, Infinity);
      prevB.set(n.id, null);
    }

    gF.set(start, 0);
    fF.set(start, heuristic(start, end));
    openF.add(start);

    gB.set(end, 0);
    fB.set(end, heuristic(end, start));
    openB.add(end);

    nodeColors.set(start, COLORS.frontier);
    nodeColors.set(end, '#a855f7');

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize forward open set with ${start}, backward open set with ${end}`,
    ));

    let mu = Infinity; // best path cost found
    let meetNode = '';
    let found = false;

    const pickBest = (openSet: Set<string>, fScore: Map<string, number>): string => {
      let best = '';
      let bestF = Infinity;
      for (const id of openSet) {
        const f = fScore.get(id) ?? Infinity;
        if (f < bestF) { bestF = f; best = id; }
      }
      return best;
    };

    let iteration = 0;
    while (openF.size > 0 && openB.size > 0 && iteration < 200) {
      iteration++;

      // Forward step
      if (openF.size > 0) {
        const current = pickBest(openF, fF);
        if (!current) break;

        openF.delete(current);
        closedF.add(current);
        nodeColors.set(current, COLORS.visiting);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Forward: expand ${current}, g=${gF.get(current)?.toFixed(1)}`,
        ));

        for (const { target, edgeIdx } of adj.get(current) ?? []) {
          if (closedF.has(target)) continue;
          const w = edges[Number(edgeIdx)]?.weight ?? 1;
          const tentG = (gF.get(current) ?? Infinity) + w;

          if (tentG < (gF.get(target) ?? Infinity)) {
            gF.set(target, tentG);
            fF.set(target, tentG + heuristic(target, end));
            prevF.set(target, current);
            openF.add(target);
            edgeColors.set(edgeIdx, COLORS.inPath);
            if (!closedB.has(target)) nodeColors.set(target, COLORS.frontier);
          }

          // Check meeting point
          if (closedB.has(target) || openB.has(target)) {
            const pathCost = tentG + (gB.get(target) ?? Infinity);
            if (pathCost < mu) {
              mu = pathCost;
              meetNode = target;
              this.steps.push(snapshot(
                applyNodeColors(positionedNodes, nodeColors),
                applyEdgeColors(coloredEdges, edgeColors),
                `Forward meets backward at ${target}, path cost = ${pathCost.toFixed(1)}`,
              ));
            }
          }
        }

        nodeColors.set(current, COLORS.visited);
      }

      // Backward step
      if (openB.size > 0) {
        const current = pickBest(openB, fB);
        if (!current) break;

        openB.delete(current);
        closedB.add(current);
        nodeColors.set(current, '#a855f7');

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Backward: expand ${current}, g=${gB.get(current)?.toFixed(1)}`,
        ));

        for (const { target, edgeIdx } of adj.get(current) ?? []) {
          if (closedB.has(target)) continue;
          const w = edges[Number(edgeIdx)]?.weight ?? 1;
          const tentG = (gB.get(current) ?? Infinity) + w;

          if (tentG < (gB.get(target) ?? Infinity)) {
            gB.set(target, tentG);
            fB.set(target, tentG + heuristic(target, start));
            prevB.set(target, current);
            openB.add(target);
            edgeColors.set(edgeIdx, '#a855f7');
            if (!closedF.has(target)) nodeColors.set(target, '#a855f7');
          }

          if (closedF.has(target) || openF.has(target)) {
            const pathCost = tentG + (gF.get(target) ?? Infinity);
            if (pathCost < mu) {
              mu = pathCost;
              meetNode = target;
              this.steps.push(snapshot(
                applyNodeColors(positionedNodes, nodeColors),
                applyEdgeColors(coloredEdges, edgeColors),
                `Backward meets forward at ${target}, path cost = ${pathCost.toFixed(1)}`,
              ));
            }
          }
        }
      }

      // Termination check
      const minFF = openF.size > 0 ? Math.min(...[...openF].map(id => fF.get(id) ?? Infinity)) : Infinity;
      const minFB = openB.size > 0 ? Math.min(...[...openB].map(id => fB.get(id) ?? Infinity)) : Infinity;
      if (Math.min(minFF, minFB) >= mu) {
        found = true;
        break;
      }
    }

    if (found && meetNode) {
      // Reconstruct path
      const pathFwd: string[] = [];
      let cur: string | null = meetNode;
      while (cur !== null) {
        pathFwd.unshift(cur);
        cur = prevF.get(cur) ?? null;
      }
      const pathBwd: string[] = [];
      cur = prevB.get(meetNode) ?? null;
      while (cur !== null) {
        pathBwd.push(cur);
        cur = prevB.get(cur) ?? null;
      }
      const fullPath = [...pathFwd, ...pathBwd];

      for (const n of nodes) nodeColors.set(n.id, COLORS.visited);
      for (let i = 0; i < edges.length; i++) edgeColors.set(String(i), COLORS.unvisited);

      for (const id of fullPath) nodeColors.set(id, COLORS.inPath);
      for (let i = 0; i < fullPath.length - 1; i++) {
        const from = fullPath[i];
        const to = fullPath[i + 1];
        const eIdx = edges.findIndex(
          (e) => (e.source === from && e.target === to) || (!e.directed && e.source === to && e.target === from),
        );
        if (eIdx !== -1) edgeColors.set(String(eIdx), COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Bidirectional A* path: ${fullPath.join(' -> ')} (cost: ${mu.toFixed(1)})`,
      ));
    } else {
      this.steps.push(snapshot(
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

  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
