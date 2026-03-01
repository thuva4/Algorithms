import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface LazySegNode {
  id: string;
  value: number;
  lazy: number;
  rangeLeft: number;
  rangeRight: number;
  left: LazySegNode | null;
  right: LazySegNode | null;
}

let nodeCounter = 0;

function cloneLazy(node: LazySegNode | null): LazySegNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    lazy: node.lazy,
    rangeLeft: node.rangeLeft,
    rangeRight: node.rangeRight,
    left: cloneLazy(node.left),
    right: cloneLazy(node.right),
  };
}

function lazyToTreeNodeData(node: LazySegNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const lazyStr = node.lazy !== 0 ? ` +${node.lazy}` : '';
  return {
    id: node.id,
    value: `${node.value}${lazyStr}`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: lazyToTreeNodeData(node.left, colorMap),
    right: lazyToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Segment Tree with Lazy Propagation visualization.
 * Supports range updates and range queries with deferred propagation.
 */
export class SegmentTreeLazyVisualization implements TreeVisualizationEngine {
  name = 'Segment Tree (Lazy Propagation)';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: LazySegNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: lazyToTreeNodeData(cloneLazy(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private buildTree(arr: number[], lo: number, hi: number): LazySegNode {
    const id = `lseg-${nodeCounter++}`;
    if (lo === hi) {
      return { id, value: arr[lo], lazy: 0, rangeLeft: lo, rangeRight: hi, left: null, right: null };
    }
    const mid = Math.floor((lo + hi) / 2);
    const left = this.buildTree(arr, lo, mid);
    const right = this.buildTree(arr, mid + 1, hi);
    return {
      id,
      value: left.value + right.value,
      lazy: 0,
      rangeLeft: lo,
      rangeRight: hi,
      left,
      right,
    };
  }

  private pushDown(node: LazySegNode, root: LazySegNode): void {
    if (node.lazy !== 0 && node.left && node.right) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.compared);
      this.addStep(root, colorMap, [node.id],
        `Pushing lazy value ${node.lazy} from [${node.rangeLeft},${node.rangeRight}] to children`);

      const leftLen = node.left.rangeRight - node.left.rangeLeft + 1;
      const rightLen = node.right.rangeRight - node.right.rangeLeft + 1;

      node.left.value += node.lazy * leftLen;
      node.left.lazy += node.lazy;
      node.right.value += node.lazy * rightLen;
      node.right.lazy += node.lazy;
      node.lazy = 0;

      const pushMap = new Map<string, string>();
      pushMap.set(node.left.id, COLORS.inserted);
      pushMap.set(node.right.id, COLORS.inserted);
      this.addStep(root, pushMap, [node.left.id, node.right.id],
        `Lazy propagated to children: left=${node.left.value}, right=${node.right.value}`);
    }
  }

  private rangeUpdate(
    node: LazySegNode | null,
    lo: number,
    hi: number,
    uLo: number,
    uHi: number,
    val: number,
    root: LazySegNode
  ): void {
    if (!node || lo > uHi || hi < uLo) return;

    if (uLo <= lo && hi <= uHi) {
      const rangeLen = hi - lo + 1;
      node.value += val * rangeLen;
      node.lazy += val;

      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, [node.id],
        `Range update: [${lo},${hi}] fully in [${uLo},${uHi}], add ${val}. New sum=${node.value}, lazy=${node.lazy}`);
      return;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.compared);
    this.addStep(root, colorMap, [node.id],
      `Partial overlap at [${lo},${hi}] for update [${uLo},${uHi}]`);

    this.pushDown(node, root);

    const mid = Math.floor((lo + hi) / 2);
    this.rangeUpdate(node.left, lo, mid, uLo, uHi, val, root);
    this.rangeUpdate(node.right, mid + 1, hi, uLo, uHi, val, root);

    node.value = (node.left?.value ?? 0) + (node.right?.value ?? 0);
  }

  private rangeQuery(
    node: LazySegNode | null,
    lo: number,
    hi: number,
    qLo: number,
    qHi: number,
    root: LazySegNode
  ): number {
    if (!node || lo > qHi || hi < qLo) return 0;

    if (qLo <= lo && hi <= qHi) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.highlighted);
      this.addStep(root, colorMap, [node.id],
        `Query: [${lo},${hi}] fully in [${qLo},${qHi}], contributing sum=${node.value}`);
      return node.value;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.compared);
    this.addStep(root, colorMap, [node.id],
      `Query: partial overlap at [${lo},${hi}] for [${qLo},${qHi}]`);

    this.pushDown(node, root);

    const mid = Math.floor((lo + hi) / 2);
    return this.rangeQuery(node.left, lo, mid, qLo, qHi, root) +
           this.rangeQuery(node.right, mid + 1, hi, qLo, qHi, root);
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
      stepDescription: `Building Segment Tree with Lazy Propagation for: [${values.join(', ')}]`,
    });

    const root = this.buildTree(values, 0, values.length - 1);
    this.addStep(root, new Map(), [],
      `Segment Tree built. Root sum = ${root.value}`);

    // Range update
    const n = values.length;
    const uLo = 0;
    const uHi = Math.min(Math.floor(n / 2), n - 1);
    const addVal = 5;

    this.addStep(root, new Map(), [],
      `--- Range Update: add ${addVal} to range [${uLo}, ${uHi}] ---`);
    this.rangeUpdate(root, 0, n - 1, uLo, uHi, addVal, root);

    this.addStep(root, new Map(), [],
      `Range update complete. Some nodes have pending lazy values.`);

    // Range query (will trigger lazy propagation)
    const qLo = 0;
    const qHi = n - 1;
    this.addStep(root, new Map(), [],
      `--- Range Query: sum of [${qLo}, ${qHi}] ---`);
    const result = this.rangeQuery(root, 0, n - 1, qLo, qHi, root);

    this.addStep(root, new Map(), [],
      `Query result: sum of [${qLo},${qHi}] = ${result}`);

    // Another update + query to show propagation
    if (n >= 3) {
      const uLo2 = Math.floor(n / 2);
      const uHi2 = n - 1;
      this.addStep(root, new Map(), [],
        `--- Range Update: add 3 to range [${uLo2}, ${uHi2}] ---`);
      this.rangeUpdate(root, 0, n - 1, uLo2, uHi2, 3, root);

      this.addStep(root, new Map(), [],
        `--- Range Query: sum of [0, ${Math.floor(n / 2)}] (triggers lazy propagation) ---`);
      const result2 = this.rangeQuery(root, 0, n - 1, 0, Math.floor(n / 2), root);
      this.addStep(root, new Map(), [],
        `Query result: sum of [0,${Math.floor(n / 2)}] = ${result2}`);
    }

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
