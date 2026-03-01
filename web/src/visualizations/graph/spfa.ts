import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * SPFA (Shortest Path Faster Algorithm) visualization.
 * A queue-based optimization of Bellman-Ford. Maintains a queue of vertices
 * whose distances have been updated and only relaxes edges from those vertices.
 */
export class SpfaVisualization implements GraphVisualizationEngine {
  name = 'SPFA';
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
      directed: true,
      color: COLORS.unvisited,
    }));

    const start = startNode ?? nodes[0]?.id;
    if (!start || nodes.length === 0) {
      const emptyState: GraphVisualizationState = {
        nodes: positionedNodes,
        edges: coloredEdges,
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const adj = buildAdjacency(nodes, edges);
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const INF = 1e9;

    this.steps.push(snapshot(positionedNodes, coloredEdges,
      `SPFA from ${start}: queue-based Bellman-Ford optimization`));

    // Initialize distances
    const dist = new Map<string, number>();
    const inQueue = new Set<string>();
    const pred = new Map<string, string>();
    const predEdge = new Map<string, number>();
    const relaxCount = new Map<string, number>();

    for (const n of nodes) {
      dist.set(n.id, INF);
      relaxCount.set(n.id, 0);
    }
    dist.set(start, 0);

    const queue: string[] = [start];
    inQueue.add(start);
    nodeColors.set(start, COLORS.frontier);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Initialize: dist[${start}] = 0, enqueue ${start}`,
    ));

    let negativeCycle = false;

    while (queue.length > 0 && !negativeCycle) {
      const u = queue.shift()!;
      inQueue.delete(u);
      nodeColors.set(u, COLORS.visiting);

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Dequeue ${u} (dist=${dist.get(u)}). Queue: [${queue.join(', ')}]`,
      ));

      const du = dist.get(u)!;

      for (const { target, edgeIdx } of adj.get(u) ?? []) {
        const w = edges[Number(edgeIdx)]?.weight ?? 1;
        edgeColors.set(edgeIdx, COLORS.relaxing);
        const newDist = du + w;
        const oldDist = dist.get(target) ?? INF;

        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Check edge ${u} -> ${target} (w=${w}): ${du} + ${w} = ${newDist} vs ${oldDist === INF ? 'inf' : oldDist}`,
        ));

        if (newDist < oldDist) {
          dist.set(target, newDist);
          pred.set(target, u);
          predEdge.set(target, Number(edgeIdx));
          nodeColors.set(target, COLORS.frontier);
          edgeColors.set(edgeIdx, COLORS.visited);

          if (!inQueue.has(target)) {
            queue.push(target);
            inQueue.add(target);
            relaxCount.set(target, (relaxCount.get(target) ?? 0) + 1);

            // Check for negative cycle
            if ((relaxCount.get(target) ?? 0) >= nodes.length) {
              negativeCycle = true;
              this.steps.push(snapshot(
                applyNodeColors(positionedNodes, nodeColors),
                applyEdgeColors(coloredEdges, edgeColors),
                `Negative cycle detected! ${target} relaxed ${nodes.length} times.`,
              ));
              break;
            }
          }

          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Relax: dist[${target}] = ${newDist}. ${!inQueue.has(target) ? '' : `Enqueue ${target}.`} Queue: [${queue.join(', ')}]`,
          ));
        } else {
          edgeColors.set(edgeIdx, COLORS.unvisited);
        }
      }

      nodeColors.set(u, COLORS.visited);
    }

    if (negativeCycle) {
      for (const n of nodes) nodeColors.set(n.id, COLORS.relaxing);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        'SPFA terminated: negative cycle detected',
      ));
    } else {
      // Highlight shortest path tree
      for (const n of nodes) {
        const d = dist.get(n.id)!;
        nodeColors.set(n.id, d < INF ? COLORS.inPath : COLORS.unvisited);
      }
      for (const [, eidx] of predEdge) {
        edgeColors.set(String(eidx), COLORS.inPath);
      }

      const distStr = nodes.map((n) => {
        const d = dist.get(n.id)!;
        return `${n.id}:${d === INF ? 'inf' : d}`;
      }).join(', ');

      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `SPFA complete. Distances: ${distStr}`,
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
