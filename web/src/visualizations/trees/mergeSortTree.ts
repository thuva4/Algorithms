import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface MSTNode {
  id: string;
  sortedValues: number[];
  rangeLeft: number;
  rangeRight: number;
  left: MSTNode | null;
  right: MSTNode | null;
}

let nodeCounter = 0;

function cloneMST(node: MSTNode | null): MSTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    sortedValues: [...node.sortedValues],
    rangeLeft: node.rangeLeft,
    rangeRight: node.rangeRight,
    left: cloneMST(node.left),
    right: cloneMST(node.right),
  };
}

function mstToTreeNodeData(node: MSTNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: `[${node.sortedValues.join(',')}]`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: mstToTreeNodeData(node.left, colorMap),
    right: mstToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Merge Sort Tree visualization.
 * Each node stores the sorted array of its range, built bottom-up by merging.
 * Supports counting elements in a range that are <= k.
 */
export class MergeSortTreeVisualization implements TreeVisualizationEngine {
  name = 'Merge Sort Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: MSTNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: mstToTreeNodeData(cloneMST(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private merge(a: number[], b: number[]): number[] {
    const result: number[] = [];
    let i = 0, j = 0;
    while (i < a.length && j < b.length) {
      if (a[i] <= b[j]) result.push(a[i++]);
      else result.push(b[j++]);
    }
    while (i < a.length) result.push(a[i++]);
    while (j < b.length) result.push(b[j++]);
    return result;
  }

  private buildTree(arr: number[], lo: number, hi: number, root: { ref: MSTNode | null }): MSTNode {
    const id = `mst-${nodeCounter++}`;
    if (lo === hi) {
      const node: MSTNode = {
        id,
        sortedValues: [arr[lo]],
        rangeLeft: lo,
        rangeRight: hi,
        left: null,
        right: null,
      };
      if (!root.ref) root.ref = node;
      const colorMap = new Map<string, string>();
      colorMap.set(id, COLORS.inserted);
      this.addStep(root.ref, colorMap, [id],
        `Leaf [${lo}]: value = ${arr[lo]}`);
      return node;
    }

    const mid = Math.floor((lo + hi) / 2);
    const node: MSTNode = {
      id,
      sortedValues: [],
      rangeLeft: lo,
      rangeRight: hi,
      left: null,
      right: null,
    };
    if (!root.ref) root.ref = node;

    node.left = this.buildTree(arr, lo, mid, root);
    node.right = this.buildTree(arr, mid + 1, hi, root);

    node.sortedValues = this.merge(node.left.sortedValues, node.right.sortedValues);

    const colorMap = new Map<string, string>();
    colorMap.set(id, COLORS.highlighted);
    if (node.left) colorMap.set(node.left.id, COLORS.compared);
    if (node.right) colorMap.set(node.right.id, COLORS.compared);
    this.addStep(root.ref, colorMap, [id],
      `Merged [${lo},${mid}] and [${mid + 1},${hi}] -> [${node.sortedValues.join(',')}]`);

    return node;
  }

  private countLessOrEqual(node: MSTNode | null, qLo: number, qHi: number, k: number, root: MSTNode): number {
    if (!node || qLo > node.rangeRight || qHi < node.rangeLeft) {
      if (node) {
        const colorMap = new Map<string, string>();
        colorMap.set(node.id, COLORS.default);
        this.addStep(root, colorMap, [node.id],
          `Node [${node.rangeLeft},${node.rangeRight}] outside query range [${qLo},${qHi}]`);
      }
      return 0;
    }

    if (qLo <= node.rangeLeft && node.rangeRight <= qHi) {
      // Binary search for count of elements <= k
      let lo = 0, hi = node.sortedValues.length;
      while (lo < hi) {
        const mid = Math.floor((lo + hi) / 2);
        if (node.sortedValues[mid] <= k) lo = mid + 1;
        else hi = mid;
      }
      const count = lo;

      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, [node.id],
        `Node [${node.rangeLeft},${node.rangeRight}] fully in range: ${count} elements <= ${k}`);
      return count;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.compared);
    this.addStep(root, colorMap, [node.id],
      `Node [${node.rangeLeft},${node.rangeRight}] partially overlaps [${qLo},${qHi}], descending`);

    return this.countLessOrEqual(node.left, qLo, qHi, k, root) +
           this.countLessOrEqual(node.right, qLo, qHi, k, root);
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    if (values.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Merge Sort Tree for array: [${values.join(', ')}]`,
    });

    const rootRef: { ref: MSTNode | null } = { ref: null };
    const root = this.buildTree(values, 0, values.length - 1, rootRef);

    this.addStep(root, new Map(), [],
      `Merge Sort Tree built. Each node stores sorted subarray of its range.`);

    // Demonstrate a query: count elements <= k in range [qLo, qHi]
    const qLo = 0;
    const qHi = Math.min(Math.floor(values.length / 2), values.length - 1);
    const sorted = [...values].sort((a, b) => a - b);
    const k = sorted[Math.floor(sorted.length / 2)];

    this.addStep(root, new Map(), [],
      `--- Query: count elements <= ${k} in range [${qLo}, ${qHi}] ---`);

    const count = this.countLessOrEqual(root, qLo, qHi, k, root);

    this.addStep(root, new Map(), [],
      `Query result: ${count} elements in [${qLo},${qHi}] are <= ${k}`);

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
