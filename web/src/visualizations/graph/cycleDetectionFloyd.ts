import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

export class CycleDetectionFloydVisualization implements GraphVisualizationEngine {
  name = 'Cycle Detection (Floyd\'s Tortoise and Hare)';
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

    const start = startNode ?? nodes[0]?.id;

    if (!start) {
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

    // Get the first neighbor (simulating linked list traversal in a directed graph)
    const getNext = (id: string): { target: string; edgeIdx: string } | null => {
      const neighbors = adj.get(id) ?? [];
      return neighbors.length > 0 ? neighbors[0] : null;
    };

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `Floyd's cycle detection from ${start}. Tortoise moves 1 step, Hare moves 2 steps at a time.`));

    // Phase 1: Detect cycle
    let tortoise = start;
    let hare = start;
    let cycleFound = false;
    let iteration = 0;

    nodeColors.set(tortoise, COLORS.visiting);  // tortoise = yellow
    nodeColors.set(hare, COLORS.relaxing);       // hare = red

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Phase 1: Tortoise (yellow) and Hare (red) both start at ${start}`,
    ));

    while (iteration < 200) {
      iteration++;

      // Tortoise moves one step
      const tNext = getNext(tortoise);
      if (!tNext) break;

      edgeColors.set(tNext.edgeIdx, COLORS.visiting);
      nodeColors.set(tortoise, COLORS.visited);
      tortoise = tNext.target;
      nodeColors.set(tortoise, COLORS.visiting);

      // Hare moves two steps
      const hNext1 = getNext(hare);
      if (!hNext1) break;
      edgeColors.set(hNext1.edgeIdx, COLORS.relaxing);
      nodeColors.set(hare, COLORS.visited);
      hare = hNext1.target;

      const hNext2 = getNext(hare);
      if (!hNext2) break;
      edgeColors.set(hNext2.edgeIdx, COLORS.relaxing);
      hare = hNext2.target;
      nodeColors.set(hare, COLORS.relaxing);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Step ${iteration}: Tortoise at ${tortoise}, Hare at ${hare}`,
      ));

      if (tortoise === hare) {
        cycleFound = true;
        nodeColors.set(tortoise, COLORS.frontier);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Tortoise and Hare meet at ${tortoise} -- CYCLE DETECTED!`,
        ));
        break;
      }
    }

    if (cycleFound) {
      // Phase 2: Find cycle start
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'Phase 2: Reset tortoise to start. Move both one step at a time to find cycle entrance.',
      ));

      tortoise = start;
      nodeColors.set(tortoise, COLORS.visiting);

      let phase2Steps = 0;
      while (tortoise !== hare && phase2Steps < 200) {
        phase2Steps++;
        const tNext = getNext(tortoise);
        const hNext = getNext(hare);
        if (!tNext || !hNext) break;

        nodeColors.set(tortoise, COLORS.visited);
        nodeColors.set(hare, COLORS.visited);

        tortoise = tNext.target;
        hare = hNext.target;

        nodeColors.set(tortoise, COLORS.visiting);
        nodeColors.set(hare, COLORS.relaxing);

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Phase 2 step ${phase2Steps}: Tortoise at ${tortoise}, Hare at ${hare}`,
        ));
      }

      nodeColors.set(tortoise, COLORS.inPath);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Cycle entrance found at node ${tortoise}`,
      ));

      // Phase 3: Measure cycle length
      let cycleLen = 1;
      let runner = getNext(tortoise)?.target;
      const cycleNodes = [tortoise];

      while (runner && runner !== tortoise && cycleLen < 200) {
        cycleNodes.push(runner);
        nodeColors.set(runner, COLORS.inPath);
        cycleLen++;
        runner = getNext(runner)?.target ?? null;
      }

      // Highlight cycle edges
      for (let i = 0; i < cycleNodes.length; i++) {
        const from = cycleNodes[i];
        const to = cycleNodes[(i + 1) % cycleNodes.length];
        const eIdx = edges.findIndex(e => e.source === from && e.target === to);
        if (eIdx !== -1) edgeColors.set(String(eIdx), COLORS.inPath);
      }

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Cycle: ${cycleNodes.join(' -> ')} -> ${tortoise} (length: ${cycleLen})`,
      ));
    } else {
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'No cycle detected. The sequence terminates.',
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
