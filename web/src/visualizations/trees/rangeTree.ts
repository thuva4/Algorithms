import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface RTNode {
  id: string;
  value: number; // split value (median)
  rangeLeft: number;
  rangeRight: number;
  sortedY: number[]; // associated structure: sorted y-coordinates
  left: RTNode | null;
  right: RTNode | null;
}

let nodeCounter = 0;

function cloneRT(node: RTNode | null): RTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    rangeLeft: node.rangeLeft,
    rangeRight: node.rangeRight,
    sortedY: [...node.sortedY],
    left: cloneRT(node.left),
    right: cloneRT(node.right),
  };
}

function rtToTreeNodeData(node: RTNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: `${node.value} [${node.rangeLeft}..${node.rangeRight}]`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: rtToTreeNodeData(node.left, colorMap),
    right: rtToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Range Tree visualization (1D version with associated structures).
 * Builds a balanced BST on sorted values, supporting range counting queries.
 */
export class RangeTreeVisualization implements TreeVisualizationEngine {
  name = 'Range Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: RTNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: rtToTreeNodeData(cloneRT(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private buildTree(sorted: number[], lo: number, hi: number, root: { ref: RTNode | null }): RTNode | null {
    if (lo > hi) return null;

    const mid = Math.floor((lo + hi) / 2);
    const node: RTNode = {
      id: `rt-${nodeCounter++}`,
      value: sorted[mid],
      rangeLeft: sorted[lo],
      rangeRight: sorted[hi],
      sortedY: sorted.slice(lo, hi + 1),
      left: null,
      right: null,
    };

    if (!root.ref) root.ref = node;

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.inserted);
    this.addStep(root.ref, colorMap, [node.id],
      `Created node with median ${sorted[mid]}, covering range [${sorted[lo]}..${sorted[hi]}]`);

    node.left = this.buildTree(sorted, lo, mid - 1, root);
    node.right = this.buildTree(sorted, mid + 1, hi, root);

    return node;
  }

  private rangeCount(
    node: RTNode | null,
    lo: number,
    hi: number,
    root: RTNode
  ): number {
    if (!node) return 0;

    if (node.rangeLeft >= lo && node.rangeRight <= hi) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, [node.id],
        `Node ${node.value} [${node.rangeLeft}..${node.rangeRight}] fully in query [${lo}..${hi}]: count = ${node.sortedY.length}`);
      return node.sortedY.length;
    }

    if (node.rangeRight < lo || node.rangeLeft > hi) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.default);
      this.addStep(root, colorMap, [node.id],
        `Node ${node.value} [${node.rangeLeft}..${node.rangeRight}] outside query [${lo}..${hi}]`);
      return 0;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.compared);
    this.addStep(root, colorMap, [node.id],
      `Node ${node.value} [${node.rangeLeft}..${node.rangeRight}] partially overlaps [${lo}..${hi}], descending`);

    // Count this node if it falls within range
    let count = (node.value >= lo && node.value <= hi) ? 1 : 0;
    count += this.rangeCount(node.left, lo, hi, root);
    count += this.rangeCount(node.right, lo, hi, root);

    return count;
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    if (values.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    const sorted = [...new Set(values)].sort((a, b) => a - b);

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Range Tree from sorted unique values: [${sorted.join(', ')}]`,
    });

    const rootRef: { ref: RTNode | null } = { ref: null };
    const root = this.buildTree(sorted, 0, sorted.length - 1, rootRef);

    if (root) {
      this.addStep(root, new Map(), [],
        `Range Tree built with ${sorted.length} nodes`);

      // Demonstrate range counting query
      const qLo = sorted[Math.floor(sorted.length / 4)];
      const qHi = sorted[Math.floor(3 * sorted.length / 4)];

      this.addStep(root, new Map(), [],
        `--- Range Count Query: how many elements in [${qLo}, ${qHi}]? ---`);

      const count = this.rangeCount(root, qLo, qHi, root);

      this.addStep(root, new Map(), [],
        `Query result: ${count} elements in range [${qLo}, ${qHi}]`);
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
