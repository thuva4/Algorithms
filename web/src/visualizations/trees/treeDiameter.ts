import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface TDNode {
  id: string;
  value: number;
  children: TDNode[];
}

function cloneTD(node: TDNode | null): TDNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    children: node.children.map(c => cloneTD(c)!),
  };
}

function tdToTreeNodeData(node: TDNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => tdToTreeNodeData(c, colorMap))
    .filter((c): c is TreeNodeData => c !== null);
  const result: TreeNodeData = {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
  };
  if (childNodes.length > 0) {
    result.children = childNodes;
  }
  return result;
}

/**
 * Tree Diameter visualization.
 * Finds the diameter (longest path between any two nodes) using two BFS passes:
 * 1. BFS from any node to find the farthest node u
 * 2. BFS from u to find the farthest node v
 * The distance from u to v is the diameter.
 */
export class TreeDiameterVisualization implements TreeVisualizationEngine {
  name = 'Tree Diameter';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: TDNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: tdToTreeNodeData(cloneTD(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = values.length;
    if (n === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    // Build adjacency list (complete binary tree shape)
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
      const parent = Math.floor((i - 1) / 2);
      adj[parent].push(i);
      adj[i].push(parent);
    }

    // Build visual tree
    const buildVisual = (v: number, parent: number): TDNode => {
      const node: TDNode = { id: `td-${v}`, value: values[v], children: [] };
      for (const u of adj[v]) {
        if (u !== parent) {
          node.children.push(buildVisual(u, v));
        }
      }
      return node;
    };

    const root = buildVisual(0, -1);

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Finding diameter of tree with ${n} nodes`,
    });

    this.addStep(root, new Map(), [], `Original tree`);

    // BFS function
    const bfs = (start: number, label: string): { farthest: number; dist: number[] } => {
      const dist = new Array(n).fill(-1);
      dist[start] = 0;
      const queue = [start];
      let farthest = start;
      let maxDist = 0;

      this.addStep(root, new Map([[`td-${start}`, COLORS.highlighted]]), [`td-${start}`],
        `${label}: Starting BFS from node ${values[start]}`);

      while (queue.length > 0) {
        const u = queue.shift()!;
        const visited: string[] = [];

        for (const v of adj[u]) {
          if (dist[v] === -1) {
            dist[v] = dist[u] + 1;
            queue.push(v);
            visited.push(`td-${v}`);

            if (dist[v] > maxDist) {
              maxDist = dist[v];
              farthest = v;
            }
          }
        }

        if (visited.length > 0) {
          const colorMap = new Map<string, string>();
          colorMap.set(`td-${u}`, COLORS.compared);
          for (const vid of visited) {
            colorMap.set(vid, COLORS.inserted);
          }
          this.addStep(root, colorMap, [`td-${u}`, ...visited],
            `${label}: From ${values[u]} (dist=${dist[u]}), discovered neighbors at dist=${dist[u] + 1}`);
        }
      }

      // Highlight farthest node
      const resultMap = new Map<string, string>();
      resultMap.set(`td-${farthest}`, COLORS.highlighted);
      // Color all nodes by distance
      for (let i = 0; i < n; i++) {
        if (dist[i] >= 0 && i !== farthest) {
          resultMap.set(`td-${i}`, COLORS.inserted);
        }
      }
      this.addStep(root, resultMap, [`td-${farthest}`],
        `${label}: Farthest node is ${values[farthest]} at distance ${maxDist}`);

      return { farthest, dist };
    };

    // Pass 1: BFS from node 0
    this.addStep(root, new Map(), [], `--- Pass 1: BFS from node ${values[0]} to find farthest endpoint ---`);
    const pass1 = bfs(0, 'Pass 1');

    // Pass 2: BFS from farthest node
    this.addStep(root, new Map(), [], `--- Pass 2: BFS from node ${values[pass1.farthest]} to find diameter ---`);
    const pass2 = bfs(pass1.farthest, 'Pass 2');

    // Find the diameter path
    const diameter = pass2.dist[pass2.farthest];

    // Reconstruct the path
    const path: number[] = [];
    let current = pass2.farthest;
    const parent: number[] = new Array(n).fill(-1);
    // Run BFS again to find parent pointers
    const visited = new Set<number>();
    const q = [pass1.farthest];
    visited.add(pass1.farthest);
    while (q.length > 0) {
      const u = q.shift()!;
      for (const v of adj[u]) {
        if (!visited.has(v)) {
          visited.add(v);
          parent[v] = u;
          q.push(v);
        }
      }
    }

    current = pass2.farthest;
    while (current !== -1) {
      path.push(current);
      current = parent[current];
    }

    // Highlight the diameter path
    const pathMap = new Map<string, string>();
    for (const v of path) {
      pathMap.set(`td-${v}`, COLORS.highlighted);
    }
    const pathIds = path.map(v => `td-${v}`);
    this.addStep(root, pathMap, pathIds,
      `Diameter = ${diameter} (path: ${path.map(v => values[v]).join(' -> ')})`);

    this.addStep(root, pathMap, pathIds,
      `Tree diameter is ${diameter} edges, connecting nodes ${values[pass1.farthest]} and ${values[pass2.farthest]}`);

    return this.steps[0];
  }

  step(): TreeVisualizationState | null {
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
