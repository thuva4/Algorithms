import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface PruferNode {
  id: string;
  value: number;
  children: PruferNode[];
}

function clonePrufer(node: PruferNode | null): PruferNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    children: node.children.map(c => clonePrufer(c)!),
  };
}

function pruferToTreeNodeData(node: PruferNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => pruferToTreeNodeData(c, colorMap))
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
 * Prufer Code visualization.
 * Demonstrates encoding a labeled tree into a Prufer sequence (by repeatedly
 * removing the smallest leaf) and decoding back to a tree.
 */
export class PruferCodeVisualization implements TreeVisualizationEngine {
  name = 'Prufer Code';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private buildVisualTree(adj: Map<number, Set<number>>, root: number, parent: number): PruferNode {
    const node: PruferNode = { id: `pf-${root}`, value: root, children: [] };
    const neighbors = adj.get(root) ?? new Set();
    for (const child of Array.from(neighbors).sort((a, b) => a - b)) {
      if (child !== parent) {
        node.children.push(this.buildVisualTree(adj, child, root));
      }
    }
    return node;
  }

  private addStep(root: PruferNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: pruferToTreeNodeData(clonePrufer(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Use values to determine tree size; build a labeled tree on nodes 0..n-1
    const n = Math.max(4, Math.min(values.length + 2, 10));
    // Build a random-ish tree using values as parent hints
    const adj: Map<number, Set<number>> = new Map();
    for (let i = 0; i < n; i++) adj.set(i, new Set());

    for (let i = 1; i < n; i++) {
      const parent = values.length > 0
        ? Math.abs(values[(i - 1) % values.length]) % i
        : Math.floor(Math.random() * i);
      adj.get(parent)!.add(i);
      adj.get(i)!.add(parent);
    }

    const originalTree = this.buildVisualTree(adj, 0, -1);

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Prufer Code: encoding a labeled tree with ${n} nodes (0 to ${n - 1})`,
    });

    this.addStep(originalTree, new Map(), [],
      `Original labeled tree`);

    // --- ENCODING: Tree -> Prufer Sequence ---
    this.addStep(originalTree, new Map(), [],
      `--- Encoding: Tree to Prufer Sequence ---`);

    const degree = new Map<number, number>();
    for (let i = 0; i < n; i++) {
      degree.set(i, (adj.get(i) ?? new Set()).size);
    }

    const pruferSeq: number[] = [];
    const removed = new Set<number>();
    const adjCopy: Map<number, Set<number>> = new Map();
    for (const [k, v] of adj) adjCopy.set(k, new Set(v));

    for (let step = 0; step < n - 2; step++) {
      // Find smallest leaf
      let leaf = -1;
      for (let i = 0; i < n; i++) {
        if (!removed.has(i) && degree.get(i) === 1) {
          leaf = i;
          break;
        }
      }
      if (leaf === -1) break;

      // Find its neighbor
      const neighbors = adjCopy.get(leaf) ?? new Set();
      let neighbor = -1;
      for (const nb of neighbors) {
        if (!removed.has(nb)) {
          neighbor = nb;
          break;
        }
      }
      if (neighbor === -1) break;

      pruferSeq.push(neighbor);
      removed.add(leaf);
      degree.set(neighbor, (degree.get(neighbor) ?? 1) - 1);
      adjCopy.get(leaf)?.delete(neighbor);
      adjCopy.get(neighbor)?.delete(leaf);

      // Show step
      const currentTree = this.buildVisualTree(adjCopy, this.findRoot(adjCopy, removed, n), -1);
      const colorMap = new Map<string, string>();
      colorMap.set(`pf-${leaf}`, COLORS.removed);
      colorMap.set(`pf-${neighbor}`, COLORS.highlighted);
      this.addStep(originalTree, colorMap, [`pf-${leaf}`, `pf-${neighbor}`],
        `Remove leaf ${leaf} (neighbor ${neighbor}). Prufer sequence so far: [${pruferSeq.join(', ')}]`);
    }

    this.addStep(originalTree, new Map(), [],
      `Encoding complete. Prufer sequence: [${pruferSeq.join(', ')}]`);

    // --- DECODING: Prufer Sequence -> Tree ---
    this.addStep(null, new Map(), [],
      `--- Decoding: Prufer Sequence [${pruferSeq.join(', ')}] back to Tree ---`);

    const decodeDegree = new Array(n).fill(1);
    for (const v of pruferSeq) decodeDegree[v]++;

    const decodeAdj: Map<number, Set<number>> = new Map();
    for (let i = 0; i < n; i++) decodeAdj.set(i, new Set());

    for (const v of pruferSeq) {
      // Find smallest node with degree 1
      let leaf = -1;
      for (let i = 0; i < n; i++) {
        if (decodeDegree[i] === 1) {
          leaf = i;
          break;
        }
      }
      if (leaf === -1) break;

      decodeAdj.get(leaf)!.add(v);
      decodeAdj.get(v)!.add(leaf);
      decodeDegree[leaf]--;
      decodeDegree[v]--;

      const decodeTree = this.buildVisualTree(decodeAdj, this.findDecodeRoot(decodeAdj, n), -1);
      const colorMap = new Map<string, string>();
      colorMap.set(`pf-${leaf}`, COLORS.inserted);
      colorMap.set(`pf-${v}`, COLORS.highlighted);
      this.addStep(decodeTree, colorMap, [`pf-${leaf}`, `pf-${v}`],
        `Connect leaf ${leaf} to ${v}. Remaining degrees: [${decodeDegree.join(',')}]`);
    }

    // Connect the last two nodes with degree 1
    const remaining: number[] = [];
    for (let i = 0; i < n; i++) {
      if (decodeDegree[i] === 1) remaining.push(i);
    }
    if (remaining.length === 2) {
      decodeAdj.get(remaining[0])!.add(remaining[1]);
      decodeAdj.get(remaining[1])!.add(remaining[0]);

      const finalTree = this.buildVisualTree(decodeAdj, this.findDecodeRoot(decodeAdj, n), -1);
      const colorMap = new Map<string, string>();
      colorMap.set(`pf-${remaining[0]}`, COLORS.inserted);
      colorMap.set(`pf-${remaining[1]}`, COLORS.inserted);
      this.addStep(finalTree, colorMap, [`pf-${remaining[0]}`, `pf-${remaining[1]}`],
        `Connect last two nodes: ${remaining[0]} and ${remaining[1]}`);
    }

    const decodedTree = this.buildVisualTree(decodeAdj, this.findDecodeRoot(decodeAdj, n), -1);
    this.addStep(decodedTree, new Map(), [],
      `Decoding complete. Tree reconstructed from Prufer sequence.`);

    return this.steps[0];
  }

  private findRoot(adj: Map<number, Set<number>>, removed: Set<number>, n: number): number {
    for (let i = 0; i < n; i++) {
      if (!removed.has(i) && (adj.get(i)?.size ?? 0) > 0) return i;
    }
    return 0;
  }

  private findDecodeRoot(adj: Map<number, Set<number>>, n: number): number {
    // BFS to find a good root (node with most connections)
    let bestRoot = 0;
    let maxDeg = 0;
    for (let i = 0; i < n; i++) {
      const deg = adj.get(i)?.size ?? 0;
      if (deg > maxDeg) { maxDeg = deg; bestRoot = i; }
    }
    return bestRoot;
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
