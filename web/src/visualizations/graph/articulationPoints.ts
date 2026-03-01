import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class ArticulationPointsVisualization implements GraphVisualizationEngine {
  name = 'Articulation Points';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
    _startNode?: string,
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

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Find articulation points using DFS with discovery times and low-link values.'));

    const disc = new Map<string, number>();
    const low = new Map<string, number>();
    const parent = new Map<string, string | null>();
    const isAP = new Set<string>();
    let timer = 0;

    const dfs = (u: string) => {
      disc.set(u, timer);
      low.set(u, timer);
      timer++;
      let children = 0;

      nodeColors.set(u, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `DFS visit ${u}: disc[${u}]=${disc.get(u)}, low[${u}]=${low.get(u)}`,
      ));

      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        if (!disc.has(target)) {
          children++;
          parent.set(target, u);
          edgeColors.set(edgeIdx, COLORS.visiting);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Tree edge ${u} -> ${target}`,
          ));

          dfs(target);

          low.set(u, Math.min(low.get(u)!, low.get(target)!));

          // Check articulation point conditions
          const isRoot = parent.get(u) === null;
          if (isRoot && children > 1) {
            isAP.add(u);
            nodeColors.set(u, COLORS.relaxing);
            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `${u} is root with ${children} children -- ARTICULATION POINT`,
            ));
          }
          if (!isRoot && low.get(target)! >= disc.get(u)!) {
            isAP.add(u);
            nodeColors.set(u, COLORS.relaxing);
            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `low[${target}]=${low.get(target)} >= disc[${u}]=${disc.get(u)} -- ${u} is ARTICULATION POINT`,
            ));
          }

          edgeColors.set(edgeIdx, COLORS.inPath);
        } else if (target !== parent.get(u)) {
          low.set(u, Math.min(low.get(u)!, disc.get(target)!));
          edgeColors.set(edgeIdx, COLORS.frontier);

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back edge ${u} -> ${target}: update low[${u}]=${low.get(u)}`,
          ));
        }
      }

      if (!isAP.has(u)) {
        nodeColors.set(u, COLORS.visited);
      }
    };

    for (const n of nodes) {
      if (!disc.has(n.id)) {
        parent.set(n.id, null);
        dfs(n.id);
      }
    }

    // Final summary
    const apList = [...isAP];
    for (const ap of apList) nodeColors.set(ap, COLORS.relaxing);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Articulation points found: ${apList.length > 0 ? apList.join(', ') : 'none'} (${apList.length} total)`,
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
