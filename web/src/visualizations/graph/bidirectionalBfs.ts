import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class BidirectionalBFSVisualization implements GraphVisualizationEngine {
  name = 'Bidirectional BFS';
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
        stepDescription: 'Need start and end nodes for Bidirectional BFS',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Bidirectional BFS from ${start} to ${end}. Two BFS searches expand from both endpoints.`));

    const visitedF = new Map<string, string | null>(); // node -> parent
    const visitedB = new Map<string, string | null>();
    const queueF: string[] = [start];
    const queueB: string[] = [end];
    visitedF.set(start, null);
    visitedB.set(end, null);

    nodeColors.set(start, COLORS.frontier);
    nodeColors.set(end, '#a855f7');

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize: forward queue = [${start}], backward queue = [${end}]`,
    ));

    let meetNode = '';
    let found = false;

    while (queueF.length > 0 && queueB.length > 0 && !found) {
      // Forward BFS step
      if (queueF.length > 0) {
        const size = queueF.length;
        for (let s = 0; s < size && !found; s++) {
          const current = queueF.shift()!;
          nodeColors.set(current, COLORS.visiting);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Forward BFS: dequeue ${current}`,
          ));

          for (const { target, edgeIdx } of adj.get(current) ?? []) {
            if (visitedF.has(target)) continue;

            visitedF.set(target, current);
            queueF.push(target);
            edgeColors.set(edgeIdx, COLORS.inPath);
            nodeColors.set(target, COLORS.frontier);

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Forward: discover ${target} via ${current}`,
            ));

            if (visitedB.has(target)) {
              meetNode = target;
              found = true;
              this.steps.push(snapshot(
                applyNodeColors(positionedNodes, nodeColors),
                applyEdgeColors(coloredEdges, edgeColors),
                `Searches meet at ${target}!`,
              ));
              break;
            }
          }

          nodeColors.set(current, COLORS.visited);
        }
      }

      if (found) break;

      // Backward BFS step
      if (queueB.length > 0) {
        const size = queueB.length;
        for (let s = 0; s < size && !found; s++) {
          const current = queueB.shift()!;
          nodeColors.set(current, '#a855f7');

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Backward BFS: dequeue ${current}`,
          ));

          for (const { target, edgeIdx } of adj.get(current) ?? []) {
            if (visitedB.has(target)) continue;

            visitedB.set(target, current);
            queueB.push(target);
            edgeColors.set(edgeIdx, '#a855f7');
            if (!visitedF.has(target)) nodeColors.set(target, '#a855f7');

            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Backward: discover ${target} via ${current}`,
            ));

            if (visitedF.has(target)) {
              meetNode = target;
              found = true;
              this.steps.push(snapshot(
                applyNodeColors(positionedNodes, nodeColors),
                applyEdgeColors(coloredEdges, edgeColors),
                `Searches meet at ${target}!`,
              ));
              break;
            }
          }
        }
      }
    }

    if (found && meetNode) {
      // Reconstruct path
      const pathFwd: string[] = [];
      let cur: string | null = meetNode;
      while (cur !== null) {
        pathFwd.unshift(cur);
        cur = visitedF.get(cur) ?? null;
      }
      const pathBwd: string[] = [];
      cur = visitedB.get(meetNode) ?? null;
      while (cur !== null) {
        pathBwd.push(cur);
        cur = visitedB.get(cur) ?? null;
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
        `Path found: ${fullPath.join(' -> ')} (length: ${fullPath.length - 1})`,
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
