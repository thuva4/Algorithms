import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  found: '#3b82f6',
  building: '#a855f7',
};

interface SegNode {
  id: string;
  value: number;
  rangeLeft: number;
  rangeRight: number;
  left: SegNode | null;
  right: SegNode | null;
}

let nodeCounter = 0;

function segToTreeNodeData(node: SegNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const label = node.rangeLeft === node.rangeRight
    ? `${node.value}`
    : `${node.value}`;
  return {
    id: node.id,
    value: label,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: segToTreeNodeData(node.left, colorMap),
    right: segToTreeNodeData(node.right, colorMap),
  };
}

function cloneSegNode(node: SegNode | null): SegNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    rangeLeft: node.rangeLeft,
    rangeRight: node.rangeRight,
    left: cloneSegNode(node.left),
    right: cloneSegNode(node.right),
  };
}

export class SegmentTreeVisualization implements TreeVisualizationEngine {
  name = 'Segment Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: SegNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: segToTreeNodeData(cloneSegNode(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private buildTree(arr: number[], lo: number, hi: number): SegNode {
    const id = `seg-${nodeCounter++}`;
    if (lo === hi) {
      const node: SegNode = { id, value: arr[lo], rangeLeft: lo, rangeRight: hi, left: null, right: null };
      return node;
    }
    const mid = Math.floor((lo + hi) / 2);
    const left = this.buildTree(arr, lo, mid);
    const right = this.buildTree(arr, mid + 1, hi);
    const node: SegNode = {
      id,
      value: left.value + right.value,
      rangeLeft: lo,
      rangeRight: hi,
      left,
      right,
    };
    return node;
  }

  private recordBuild(node: SegNode, root: SegNode): void {
    if (node.left) this.recordBuild(node.left, root);
    if (node.right) this.recordBuild(node.right, root);

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.building);
    const rangeStr = node.rangeLeft === node.rangeRight
      ? `leaf [${node.rangeLeft}]`
      : `range [${node.rangeLeft}, ${node.rangeRight}]`;
    this.addStep(root, colorMap, [node.id],
      `Built node for ${rangeStr} with sum = ${node.value}`);
  }

  private queryRange(node: SegNode | null, lo: number, hi: number, qLo: number, qHi: number, root: SegNode): number {
    if (!node) return 0;

    if (qLo <= lo && hi <= qHi) {
      // Fully within range
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.found);
      this.addStep(root, colorMap, [node.id],
        `Node [${lo}, ${hi}] fully within query [${qLo}, ${qHi}]: contributing sum = ${node.value}`);
      return node.value;
    }

    if (hi < qLo || lo > qHi) {
      // Outside range
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.default);
      this.addStep(root, colorMap, [node.id],
        `Node [${lo}, ${hi}] outside query [${qLo}, ${qHi}]: skipping`);
      return 0;
    }

    // Partial overlap
    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.visiting);
    this.addStep(root, colorMap, [node.id],
      `Node [${lo}, ${hi}] partially overlaps query [${qLo}, ${qHi}]: descending`);

    const mid = Math.floor((lo + hi) / 2);
    const leftSum = this.queryRange(node.left, lo, mid, qLo, qHi, root);
    const rightSum = this.queryRange(node.right, mid + 1, hi, qLo, qHi, root);

    const resultMap = new Map<string, string>();
    resultMap.set(node.id, COLORS.visited);
    this.addStep(root, resultMap, [node.id],
      `Node [${lo}, ${hi}]: combined result = ${leftSum + rightSum}`);

    return leftSum + rightSum;
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    if (values.length === 0) {
      this.steps.push({
        root: null,
        highlightedNodes: [],
        stepDescription: 'No values provided for Segment Tree',
      });
      return this.steps[0];
    }

    // Initial state
    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Segment Tree for array: [${values.join(', ')}]`,
    });

    // Build the tree
    const root = this.buildTree(values, 0, values.length - 1);

    // Record build steps (post-order to show bottom-up construction)
    this.recordBuild(root, root);

    // Show completed tree
    this.addStep(root, new Map(), [],
      `Segment Tree built. Root sum = ${root.value}`);

    // Demonstrate a range query
    const qLo = 0;
    const qHi = Math.min(Math.floor(values.length / 2), values.length - 1);
    this.addStep(root, new Map(), [],
      `--- Range Sum Query [${qLo}, ${qHi}] ---`);

    const result = this.queryRange(root, 0, values.length - 1, qLo, qHi, root);

    // Final query result
    const resultMap = new Map<string, string>();
    this.addStep(root, resultMap, [],
      `Query result: sum of range [${qLo}, ${qHi}] = ${result}`);

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
