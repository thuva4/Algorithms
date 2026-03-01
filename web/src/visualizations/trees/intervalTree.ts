import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface Interval {
  lo: number;
  hi: number;
}

interface ITNode {
  id: string;
  interval: Interval;
  max: number;
  left: ITNode | null;
  right: ITNode | null;
}

let nodeCounter = 0;

function createITNode(lo: number, hi: number): ITNode {
  return {
    id: `it-${nodeCounter++}`,
    interval: { lo, hi },
    max: hi,
    left: null,
    right: null,
  };
}

function updateMax(node: ITNode): void {
  node.max = node.interval.hi;
  if (node.left) node.max = Math.max(node.max, node.left.max);
  if (node.right) node.max = Math.max(node.max, node.right.max);
}

function cloneIT(node: ITNode | null): ITNode | null {
  if (!node) return null;
  return {
    id: node.id,
    interval: { ...node.interval },
    max: node.max,
    left: cloneIT(node.left),
    right: cloneIT(node.right),
  };
}

function itToTreeNodeData(node: ITNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: `[${node.interval.lo},${node.interval.hi}] m=${node.max}`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: itToTreeNodeData(node.left, colorMap),
    right: itToTreeNodeData(node.right, colorMap),
  };
}

function overlaps(a: Interval, b: Interval): boolean {
  return a.lo <= b.hi && b.lo <= a.hi;
}

/**
 * Interval Tree visualization.
 * Builds an augmented BST of intervals and demonstrates overlap queries.
 */
export class IntervalTreeVisualization implements TreeVisualizationEngine {
  name = 'Interval Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: ITNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: itToTreeNodeData(cloneIT(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private insert(root: ITNode | null, lo: number, hi: number, treeRoot: ITNode | null): ITNode {
    if (!root) {
      const newNode = createITNode(lo, hi);
      const colorMap = new Map<string, string>();
      colorMap.set(newNode.id, COLORS.inserted);
      const effectiveRoot = treeRoot ?? newNode;
      this.addStep(effectiveRoot === newNode ? newNode : treeRoot!, colorMap, [newNode.id],
        `Inserted interval [${lo}, ${hi}]`);
      return newNode;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(root.id, COLORS.compared);
    this.addStep(treeRoot!, colorMap, [root.id],
      `Comparing [${lo}, ${hi}] with node [${root.interval.lo}, ${root.interval.hi}]`);

    if (lo < root.interval.lo) {
      root.left = this.insert(root.left, lo, hi, treeRoot!);
    } else {
      root.right = this.insert(root.right, lo, hi, treeRoot!);
    }

    updateMax(root);
    return root;
  }

  private searchOverlap(root: ITNode | null, query: Interval, treeRoot: ITNode): void {
    if (!root) return;

    const colorMap = new Map<string, string>();
    colorMap.set(root.id, COLORS.compared);
    this.addStep(treeRoot, colorMap, [root.id],
      `Checking node [${root.interval.lo}, ${root.interval.hi}] (max=${root.max}) against query [${query.lo}, ${query.hi}]`);

    if (overlaps(root.interval, query)) {
      const foundMap = new Map<string, string>();
      foundMap.set(root.id, COLORS.inserted);
      this.addStep(treeRoot, foundMap, [root.id],
        `Overlap found: [${root.interval.lo}, ${root.interval.hi}] overlaps [${query.lo}, ${query.hi}]`);
    }

    if (root.left && root.left.max >= query.lo) {
      this.searchOverlap(root.left, query, treeRoot);
    }
    if (root.right && root.interval.lo <= query.hi) {
      this.searchOverlap(root.right, query, treeRoot);
    }
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    // Create intervals from consecutive pairs of values
    const intervals: Interval[] = [];
    for (let i = 0; i < values.length - 1; i += 2) {
      const lo = Math.min(values[i], values[i + 1]);
      const hi = Math.max(values[i], values[i + 1]);
      intervals.push({ lo, hi });
    }
    if (values.length % 2 === 1) {
      const v = values[values.length - 1];
      intervals.push({ lo: v, hi: v + 5 });
    }

    if (intervals.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Interval Tree with ${intervals.length} intervals: ${intervals.map(i => `[${i.lo},${i.hi}]`).join(', ')}`,
    });

    let root: ITNode | null = null;
    for (const interval of intervals) {
      root = this.insert(root, interval.lo, interval.hi, root);
    }

    this.addStep(root, new Map(), [],
      `Interval Tree built with ${intervals.length} intervals`);

    // Demonstrate overlap query
    const queryLo = intervals[0].lo;
    const queryHi = intervals[0].lo + Math.ceil((intervals[intervals.length - 1].hi - intervals[0].lo) / 3);
    const query: Interval = { lo: queryLo, hi: queryHi };

    this.addStep(root, new Map(), [],
      `--- Overlap Query: find intervals overlapping [${query.lo}, ${query.hi}] ---`);
    this.searchOverlap(root, query, root!);

    this.addStep(root, new Map(), [],
      `Interval Tree query complete`);

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
