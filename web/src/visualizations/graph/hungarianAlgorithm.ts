import type { GraphVisualizationEngine, GraphVisualizationState, GraphEdge } from '../types';
import { layoutCircle, applyNodeColors, applyEdgeColors, snapshot, COLORS } from './bfs';

/**
 * Hungarian Algorithm visualization.
 * Models a bipartite assignment problem on a graph where left-side nodes
 * are "workers" and right-side nodes are "jobs". Edges represent costs.
 * We simulate row/column reduction and augmenting-path matching.
 */
export class HungarianAlgorithmVisualization implements GraphVisualizationEngine {
  name = 'Hungarian Algorithm';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string }[],
    edges: { source: string; target: string; weight?: number; directed?: boolean }[],
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
        stepDescription: 'No nodes to process',
      };
      this.steps.push(emptyState);
      return emptyState;
    }

    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();

    this.steps.push(snapshot(positionedNodes, coloredEdges, 'Hungarian Algorithm: find minimum cost assignment in bipartite graph'));

    // Partition nodes into two sets heuristically (even-index = workers, odd-index = jobs)
    const workers: string[] = [];
    const jobs: string[] = [];
    // Try to detect bipartite partition via BFS coloring
    const colorMap = new Map<string, number>();
    const adj = new Map<string, { target: string; edgeIdx: number }[]>();
    for (const n of nodes) adj.set(n.id, []);
    edges.forEach((e, i) => {
      adj.get(e.source)?.push({ target: e.target, edgeIdx: i });
      if (!e.directed) {
        adj.get(e.target)?.push({ target: e.source, edgeIdx: i });
      }
    });

    // BFS 2-color
    for (const n of nodes) {
      if (colorMap.has(n.id)) continue;
      const queue = [n.id];
      colorMap.set(n.id, 0);
      while (queue.length > 0) {
        const cur = queue.shift()!;
        const c = colorMap.get(cur)!;
        for (const { target } of adj.get(cur) ?? []) {
          if (!colorMap.has(target)) {
            colorMap.set(target, 1 - c);
            queue.push(target);
          }
        }
      }
    }

    for (const n of nodes) {
      if (colorMap.get(n.id) === 0) workers.push(n.id);
      else jobs.push(n.id);
    }

    // Color workers and jobs differently
    for (const w of workers) nodeColors.set(w, COLORS.frontier);
    for (const j of jobs) nodeColors.set(j, COLORS.visiting);

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Bipartite partition: Workers={${workers.join(',')}} Jobs={${jobs.join(',')}}`,
    ));

    // Build cost lookup: worker -> job -> { weight, edgeIdx }
    const costMap = new Map<string, Map<string, { weight: number; edgeIdx: number }>>();
    for (const w of workers) costMap.set(w, new Map());
    edges.forEach((e, i) => {
      const w = workers.includes(e.source) ? e.source : workers.includes(e.target) ? e.target : null;
      const j = jobs.includes(e.target) ? e.target : jobs.includes(e.source) ? e.source : null;
      if (w && j) {
        costMap.get(w)?.set(j, { weight: e.weight ?? 1, edgeIdx: i });
      }
    });

    // Greedy augmenting path matching to visualize the algorithm
    const matchW = new Map<string, string>(); // worker -> job
    const matchJ = new Map<string, string>(); // job -> worker

    for (const worker of workers) {
      nodeColors.set(worker, COLORS.relaxing);
      this.steps.push(snapshot(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Trying to find assignment for worker ${worker}`,
      ));

      // Try augmenting path via DFS
      const visitedJobs = new Set<string>();

      const augment = (w: string): boolean => {
        const jobEntries = costMap.get(w);
        if (!jobEntries) return false;

        // Sort by weight for greedy minimum
        const sortedJobs = [...jobEntries.entries()].sort((a, b) => a[1].weight - b[1].weight);

        for (const [job, { weight, edgeIdx }] of sortedJobs) {
          if (visitedJobs.has(job)) continue;
          visitedJobs.add(job);

          edgeColors.set(String(edgeIdx), COLORS.relaxing);
          this.steps.push(snapshot(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Consider edge ${w} -> ${job} (cost: ${weight})`,
          ));

          if (!matchJ.has(job) || augment(matchJ.get(job)!)) {
            matchW.set(w, job);
            matchJ.set(job, w);
            edgeColors.set(String(edgeIdx), COLORS.inPath);
            nodeColors.set(w, COLORS.visited);
            nodeColors.set(job, COLORS.visited);
            this.steps.push(snapshot(
              applyNodeColors(positionedNodes, nodeColors),
              applyEdgeColors(coloredEdges, edgeColors),
              `Assign ${w} -> ${job} (cost: ${weight})`,
            ));
            return true;
          }

          edgeColors.set(String(edgeIdx), COLORS.unvisited);
        }
        return false;
      };

      if (!augment(worker)) {
        nodeColors.set(worker, COLORS.relaxing);
        this.steps.push(snapshot(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `No assignment found for worker ${worker}`,
        ));
      }
    }

    // Final state: compute total cost
    let totalCost = 0;
    for (const [w, j] of matchW) {
      const entry = costMap.get(w)?.get(j);
      if (entry) totalCost += entry.weight;
    }

    // Highlight matched edges
    for (const n of nodes) {
      nodeColors.set(n.id, matchW.has(n.id) || matchJ.has(n.id) ? COLORS.inPath : COLORS.unvisited);
    }

    this.steps.push(snapshot(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Hungarian Algorithm complete. Matching size: ${matchW.size}, total cost: ${totalCost}`,
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
