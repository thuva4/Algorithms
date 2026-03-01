import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface CDNode {
  id: string;
  value: number;
  children: CDNode[];
}

function cloneCD(node: CDNode | null): CDNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    children: node.children.map(c => cloneCD(c)!),
  };
}

function cdToTreeNodeData(node: CDNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => cdToTreeNodeData(c, colorMap))
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
 * Centroid Decomposition visualization.
 * Builds a tree from input values, then decomposes it by repeatedly
 * finding centroids and removing them to build the centroid tree.
 */
export class CentroidDecompositionVisualization implements TreeVisualizationEngine {
  name = 'Centroid Decomposition';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: CDNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: cdToTreeNodeData(cloneCD(root), colorMap),
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

    // Build adjacency list for a tree (chain-like, then add some branches)
    const adj: number[][] = Array.from({ length: n }, () => []);
    // Build a balanced-ish tree structure
    for (let i = 1; i < n; i++) {
      const parent = Math.floor((i - 1) / 2);
      adj[parent].push(i);
      adj[i].push(parent);
    }

    // Show original tree
    const originalTree = this.buildVisualTree(0, -1, adj, values);
    this.addStep(originalTree, new Map(), [],
      `Original tree with ${n} nodes: [${values.join(', ')}]`);

    // Compute subtree sizes
    const subtreeSize = new Array(n).fill(0);
    const removed = new Array(n).fill(false);

    const computeSize = (v: number, parent: number): number => {
      subtreeSize[v] = 1;
      for (const u of adj[v]) {
        if (u !== parent && !removed[u]) {
          subtreeSize[v] += computeSize(u, v);
        }
      }
      return subtreeSize[v];
    };

    const findCentroid = (v: number, parent: number, treeSize: number): number => {
      for (const u of adj[v]) {
        if (u !== parent && !removed[u] && subtreeSize[u] > treeSize / 2) {
          return findCentroid(u, v, treeSize);
        }
      }
      return v;
    };

    // Build centroid decomposition tree
    const centroidTree: CDNode[] = Array.from({ length: n }, (_, i) => ({
      id: `cd-${i}`,
      value: values[i],
      children: [],
    }));

    let centroidRoot: CDNode | null = null;

    const decompose = (v: number, depth: number): CDNode => {
      const sz = computeSize(v, -1);
      const centroid = findCentroid(v, -1, sz);
      removed[centroid] = true;

      const colorMap = new Map<string, string>();
      colorMap.set(`cd-${centroid}`, COLORS.highlighted);

      // Show finding centroid
      if (centroidRoot) {
        this.addStep(centroidRoot, colorMap, [`cd-${centroid}`],
          `Found centroid: node ${values[centroid]} (index ${centroid}) at depth ${depth}, subtree size ${sz}`);
      }

      const node = centroidTree[centroid];

      for (const u of adj[centroid]) {
        if (!removed[u]) {
          const child = decompose(u, depth + 1);
          node.children.push(child);
        }
      }

      return node;
    };

    centroidRoot = decompose(0, 0);

    // Show steps of centroid tree being built
    this.addStep(centroidRoot, new Map(), [],
      `--- Centroid Decomposition Tree ---`);

    // Highlight each level
    const highlightLevel = (node: CDNode, level: number, targetLevel: number, colorMap: Map<string, string>): void => {
      if (level === targetLevel) {
        colorMap.set(node.id, COLORS.inserted);
      }
      for (const child of node.children) {
        highlightLevel(child, level + 1, targetLevel, colorMap);
      }
    };

    const getMaxDepth = (node: CDNode, depth: number): number => {
      let max = depth;
      for (const child of node.children) {
        max = Math.max(max, getMaxDepth(child, depth + 1));
      }
      return max;
    };

    const maxDepth = getMaxDepth(centroidRoot, 0);
    for (let level = 0; level <= maxDepth; level++) {
      const colorMap = new Map<string, string>();
      highlightLevel(centroidRoot, 0, level, colorMap);
      this.addStep(centroidRoot, colorMap, [],
        `Centroid tree level ${level}`);
    }

    this.addStep(centroidRoot, new Map(), [],
      `Centroid Decomposition complete. Tree depth: ${maxDepth + 1}`);

    return this.steps[0];
  }

  private buildVisualTree(v: number, parent: number, adj: number[][], values: number[]): CDNode {
    const node: CDNode = {
      id: `cd-${v}`,
      value: values[v],
      children: [],
    };
    for (const u of adj[v]) {
      if (u !== parent) {
        node.children.push(this.buildVisualTree(u, v, adj, values));
      }
    }
    return node;
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
