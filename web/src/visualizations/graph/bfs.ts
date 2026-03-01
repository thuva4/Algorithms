import type { GraphVisualizationEngine, GraphVisualizationState, GraphNode, GraphEdge, GraphVisualizationStats } from '../types';

const COLORS = {
  unvisited: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  inPath: '#3b82f6',
  relaxing: '#ef4444',
  frontier: '#a855f7',
};

export class BFSVisualization implements GraphVisualizationEngine {
  name = 'Breadth-First Search';
  visualizationType = 'graph' as const;
  private steps: GraphVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(
    nodes: { id: string; label: string; row?: number; col?: number; blocked?: boolean; cost?: number }[],
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
    const target = endNode;
    const snap = (currentNodes: GraphNode[], currentEdges: GraphEdge[], description: string) =>
      snapshot(currentNodes, currentEdges, description, { startNodeId: start, targetNodeId: target });

    if (!start) {
      const emptyState = snap(positionedNodes, coloredEdges, 'No nodes to traverse');
      this.steps.push(emptyState);
      return emptyState;
    }

    // Build adjacency list
    const adj = buildAdjacency(nodes, edges);

    // Initial state
    this.steps.push(snap(
      positionedNodes,
      coloredEdges,
      target
        ? `Initial pathfinding grid. Start at ${start} and search for ${target}`
        : 'Initial graph. Starting BFS from node ' + start,
    ));

    const visited = new Set<string>();
    const queue: string[] = [start];
    const nodeColors = new Map<string, string>();
    const edgeColors = new Map<string, string>();
    const prev = new Map<string, string | null>();

    // Mark start as frontier
    prev.set(start, null);
    nodeColors.set(start, COLORS.frontier);
    this.steps.push(snap(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      `Add node ${start} to the queue`,
    ));

    let foundTarget = false;

    while (queue.length > 0) {
      const current = queue.shift()!;
      visited.add(current);
      nodeColors.set(current, COLORS.visiting);

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Dequeue and visit node ${current}`,
      ));

      if (target && current === target) {
        foundTarget = true;
        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Reached target ${target}. Reconstructing the shortest path.`,
        ));
        break;
      }

      const neighbors = adj.get(current) ?? [];
      for (const { target, edgeIdx } of neighbors) {
        if (visited.has(target) || queue.includes(target)) {
          // Mark edge as considered
          edgeColors.set(edgeIdx, COLORS.relaxing);
          this.steps.push(snap(
            applyNodeColors(positionedNodes, nodeColors),
            applyEdgeColors(coloredEdges, edgeColors),
            `Edge ${current} -> ${target}: already visited or in queue, skip`,
          ));
          edgeColors.set(edgeIdx, COLORS.visited);
          continue;
        }

        edgeColors.set(edgeIdx, COLORS.relaxing);
        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Exploring edge ${current} -> ${target}`,
        ));

        queue.push(target);
        prev.set(target, current);
        nodeColors.set(target, COLORS.frontier);
        edgeColors.set(edgeIdx, COLORS.inPath);

        this.steps.push(snap(
          applyNodeColors(positionedNodes, nodeColors),
          applyEdgeColors(coloredEdges, edgeColors),
          `Add node ${target} to the queue`,
        ));
      }

      nodeColors.set(current, COLORS.visited);
      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Node ${current} fully explored`,
      ));
    }

    if (target && foundTarget) {
      const path: string[] = [];
      let cursor: string | null = target;

      while (cursor !== null) {
        path.unshift(cursor);
        cursor = prev.get(cursor) ?? null;
      }

      for (const node of positionedNodes) {
        if (!node.blocked && nodeColors.get(node.id) !== COLORS.frontier) {
          nodeColors.set(node.id, COLORS.visited);
        }
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
          (edge) =>
            (edge.source === from && edge.target === to) ||
            (!edge.directed && edge.source === to && edge.target === from),
        );
        if (eIdx !== -1) {
          edgeColors.set(String(eIdx), COLORS.inPath);
        }
      }

      this.steps.push(snap(
        applyNodeColors(positionedNodes, nodeColors),
        applyEdgeColors(coloredEdges, edgeColors),
        `Shortest unweighted path: ${path.join(' -> ')}`,
      ));
    }

    // Final state
    this.steps.push(snap(
      applyNodeColors(positionedNodes, nodeColors),
      applyEdgeColors(coloredEdges, edgeColors),
      target && !foundTarget ? `No path found from ${start} to ${target}` : 'BFS traversal complete',
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

// ── Shared helpers ──────────────────────────────────────────────────────

function layoutCircle(nodes: { id: string; label: string; row?: number; col?: number; blocked?: boolean; cost?: number }[]): GraphNode[] {
  const isGridLayout = nodes.every((node) => typeof node.row === 'number' && typeof node.col === 'number');

  if (isGridLayout) {
    const maxRow = Math.max(...nodes.map((node) => node.row ?? 0));
    const maxCol = Math.max(...nodes.map((node) => node.col ?? 0));
    const rows = maxRow + 1;
    const cols = maxCol + 1;
    const cellSize = Math.max(24, Math.min(40, Math.floor(Math.min(540 / cols, 320 / rows))));
    const offsetX = Math.max(24, (600 - cols * cellSize) / 2);
    const offsetY = Math.max(24, (400 - rows * cellSize) / 2);

    return nodes.map((node) => ({
      id: node.id,
      label: node.label,
      x: offsetX + (node.col ?? 0) * cellSize + cellSize / 2,
      y: offsetY + (node.row ?? 0) * cellSize + cellSize / 2,
      color: node.blocked ? '#0f172a' : '#64748b',
      row: node.row,
      col: node.col,
      blocked: node.blocked,
      cost: node.cost,
    }));
  }

  const cx = 300;
  const cy = 200;
  const radius = Math.min(160, 30 * nodes.length);
  return nodes.map((n, i) => {
    const angle = (2 * Math.PI * i) / nodes.length - Math.PI / 2;
    return {
      id: n.id,
      label: n.label,
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
      color: '#64748b',
      row: n.row,
      col: n.col,
      blocked: n.blocked,
      cost: n.cost,
    };
  });
}

interface AdjEntry {
  target: string;
  edgeIdx: string;
}

interface GraphSnapshotMeta {
  startNodeId?: string;
  targetNodeId?: string;
}

function buildAdjacency(
  nodes: { id: string; label: string }[],
  edges: { source: string; target: string; weight?: number; directed?: boolean }[],
): Map<string, AdjEntry[]> {
  const adj = new Map<string, AdjEntry[]>();
  for (const n of nodes) adj.set(n.id, []);
  edges.forEach((e, i) => {
    const key = String(i);
    adj.get(e.source)?.push({ target: e.target, edgeIdx: key });
    if (!e.directed) {
      adj.get(e.target)?.push({ target: e.source, edgeIdx: key });
    }
  });
  return adj;
}

function applyNodeColors(base: GraphNode[], colors: Map<string, string>): GraphNode[] {
  return base.map((n) => ({ ...n, color: colors.get(n.id) ?? n.color }));
}

function applyEdgeColors(base: GraphEdge[], colors: Map<string, string>): GraphEdge[] {
  return base.map((e, i) => ({ ...e, color: colors.get(String(i)) ?? e.color }));
}

function deriveStats(nodes: GraphNode[]): GraphVisualizationStats {
  return {
    visitedCount: nodes.filter((node) => !node.blocked && node.color !== COLORS.unvisited && node.color !== COLORS.frontier).length,
    frontierCount: nodes.filter((node) => node.color === COLORS.frontier).length,
    pathCount: nodes.filter((node) => node.color === COLORS.inPath).length,
  };
}

function snapshot(
  nodes: GraphNode[],
  edges: GraphEdge[],
  stepDescription: string,
  meta?: GraphSnapshotMeta,
): GraphVisualizationState {
  return {
    nodes: nodes.map((n) => ({ ...n })),
    edges: edges.map((e) => ({ ...e })),
    stepDescription,
    startNodeId: meta?.startNodeId,
    targetNodeId: meta?.targetNodeId,
    stats: deriveStats(nodes),
  };
}

export { layoutCircle, buildAdjacency, applyNodeColors, applyEdgeColors, snapshot, COLORS };
export type { AdjEntry, GraphSnapshotMeta };
