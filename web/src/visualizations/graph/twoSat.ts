import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class TwoSatVisualization implements GraphVisualizationEngine {
  name = '2-SAT';
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
        stepDescription: 'No nodes in the implication graph',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    // 2-SAT builds an implication graph then runs Tarjan's SCC
    this.steps.push(snapshot(positionedNodes, coloredEdges,
      'Initial implication graph for 2-SAT. Each clause (a OR b) adds edges NOT a -> b and NOT b -> a.'));

    // Tarjan's SCC algorithm
    const disc = new Map<string, number>();
    const low = new Map<string, number>();
    const onStack = new Set<string>();
    const stack: string[] = [];
    const comp = new Map<string, number>();
    let timer = 0;
    let sccId = 0;
    const sccColors = [COLORS.visited, COLORS.inPath, COLORS.frontier, COLORS.relaxing, COLORS.visiting, '#ec4899', '#06b6d4', '#f97316'];

    const strongconnect = (v: string) => {
      disc.set(v, timer);
      low.set(v, timer);
      timer++;
      stack.push(v);
      onStack.add(v);

      nodeColors.set(v, COLORS.visiting);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Visit node ${v}: disc[${v}] = ${disc.get(v)}, low[${v}] = ${low.get(v)}`,
      ));

      const neighbors = adj.get(v) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (!disc.has(target)) {
          edgeColors.set(edgeIdx, COLORS.relaxing);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Explore tree edge ${v} -> ${target}`,
          ));

          strongconnect(target);
          low.set(v, Math.min(low.get(v)!, low.get(target)!));
          edgeColors.set(edgeIdx, COLORS.inPath);
        } else if (onStack.has(target)) {
          edgeColors.set(edgeIdx, COLORS.frontier);
          low.set(v, Math.min(low.get(v)!, disc.get(target)!));
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Back edge ${v} -> ${target}: update low[${v}] = ${low.get(v)}`,
          ));
        }
      }

      if (low.get(v) === disc.get(v)) {
        const sccMembers: string[] = [];
        const color = sccColors[sccId % sccColors.length];
        while (true) {
          const w = stack.pop()!;
          onStack.delete(w);
          comp.set(w, sccId);
          sccMembers.push(w);
          nodeColors.set(w, color);
          if (w === v) break;
        }

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `SCC #${sccId} found: {${sccMembers.join(', ')}}`,
        ));
        sccId++;
      }
    };

    for (const n of nodes) {
      if (!disc.has(n.id)) {
        strongconnect(n.id);
      }
    }

    // Check satisfiability: for each variable x, check if x and NOT x are in same SCC
    // In the visualization graph, we represent this conceptually
    const nHalf = Math.floor(nodes.length / 2);
    let satisfiable = true;
    for (let i = 0; i < nHalf; i++) {
      const posNode = nodes[i]?.id;
      const negNode = nodes[i + nHalf]?.id;
      if (posNode && negNode && comp.get(posNode) === comp.get(negNode)) {
        satisfiable = false;
        nodeColors.set(posNode, COLORS.relaxing);
        nodeColors.set(negNode, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Contradiction: ${posNode} and ${negNode} are in the same SCC -- UNSATISFIABLE`,
        ));
        break;
      }
    }

    if (satisfiable) {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `No variable and its negation share an SCC. Formula is SATISFIABLE.`,
      ));
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `2-SAT analysis complete. Found ${sccId} SCCs.`,
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
