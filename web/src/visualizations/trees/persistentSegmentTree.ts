import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface PSTNode {
  id: string;
  value: number;
  rangeLeft: number;
  rangeRight: number;
  left: PSTNode | null;
  right: PSTNode | null;
  version: number;
}

let nodeCounter = 0;

function clonePST(node: PSTNode | null): PSTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    rangeLeft: node.rangeLeft,
    rangeRight: node.rangeRight,
    left: clonePST(node.left),
    right: clonePST(node.right),
    version: node.version,
  };
}

function pstToTreeNodeData(node: PSTNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: `${node.value} v${node.version}`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: pstToTreeNodeData(node.left, colorMap),
    right: pstToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Persistent Segment Tree visualization.
 * Creates new versions of nodes on update instead of modifying in place,
 * allowing queries on any historical version.
 */
export class PersistentSegmentTreeVisualization implements TreeVisualizationEngine {
  name = 'Persistent Segment Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: PSTNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: pstToTreeNodeData(clonePST(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private buildTree(arr: number[], lo: number, hi: number, version: number): PSTNode {
    const id = `pst-${nodeCounter++}`;
    if (lo === hi) {
      return { id, value: arr[lo], rangeLeft: lo, rangeRight: hi, left: null, right: null, version };
    }
    const mid = Math.floor((lo + hi) / 2);
    const left = this.buildTree(arr, lo, mid, version);
    const right = this.buildTree(arr, mid + 1, hi, version);
    return {
      id,
      value: left.value + right.value,
      rangeLeft: lo,
      rangeRight: hi,
      left,
      right,
      version,
    };
  }

  private update(
    prev: PSTNode | null,
    lo: number,
    hi: number,
    idx: number,
    val: number,
    version: number,
    root: PSTNode
  ): PSTNode {
    if (!prev) {
      return { id: `pst-${nodeCounter++}`, value: val, rangeLeft: lo, rangeRight: hi, left: null, right: null, version };
    }

    if (lo === hi) {
      const newNode: PSTNode = {
        id: `pst-${nodeCounter++}`,
        value: val,
        rangeLeft: lo,
        rangeRight: hi,
        left: null,
        right: null,
        version,
      };
      const colorMap = new Map<string, string>();
      colorMap.set(newNode.id, COLORS.inserted);
      colorMap.set(prev.id, COLORS.removed);
      this.addStep(root, colorMap, [newNode.id],
        `Created new leaf v${version} at [${lo}]: ${prev.value} -> ${val}`);
      return newNode;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(prev.id, COLORS.compared);
    this.addStep(root, colorMap, [prev.id],
      `Traversing [${lo},${hi}] to update index ${idx}`);

    const mid = Math.floor((lo + hi) / 2);
    let newLeft: PSTNode | null;
    let newRight: PSTNode | null;

    if (idx <= mid) {
      newLeft = this.update(prev.left, lo, mid, idx, val, version, root);
      newRight = prev.right; // Share old right subtree
    } else {
      newLeft = prev.left; // Share old left subtree
      newRight = this.update(prev.right, mid + 1, hi, idx, val, version, root);
    }

    const newNode: PSTNode = {
      id: `pst-${nodeCounter++}`,
      value: (newLeft?.value ?? 0) + (newRight?.value ?? 0),
      rangeLeft: lo,
      rangeRight: hi,
      left: newLeft,
      right: newRight,
      version,
    };

    const newColorMap = new Map<string, string>();
    newColorMap.set(newNode.id, COLORS.highlighted);
    this.addStep(root, newColorMap, [newNode.id],
      `Created new internal node v${version} for [${lo},${hi}], sum=${newNode.value}`);

    return newNode;
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
      stepDescription: `Building Persistent Segment Tree for array: [${values.join(', ')}]`,
    });

    // Build initial version (v0)
    const versions: PSTNode[] = [];
    const v0 = this.buildTree(values, 0, values.length - 1, 0);
    versions.push(v0);

    this.addStep(v0, new Map(), [],
      `Version 0: initial segment tree built. Root sum = ${v0.value}`);

    // Perform some point updates to create new versions
    const n = values.length;
    const numUpdates = Math.min(3, n);

    for (let u = 0; u < numUpdates; u++) {
      const idx = u % n;
      const newVal = values[idx] + 10 * (u + 1);
      const version = u + 1;

      this.addStep(versions[versions.length - 1], new Map(), [],
        `--- Creating Version ${version}: update index ${idx} to ${newVal} ---`);

      const newRoot = this.update(
        versions[versions.length - 1],
        0,
        n - 1,
        idx,
        newVal,
        version,
        versions[versions.length - 1]
      );
      versions.push(newRoot);

      this.addStep(newRoot, new Map(), [],
        `Version ${version} created. Root sum = ${newRoot.value}. Old versions still accessible.`);
    }

    // Show that we can query any version
    for (let v = 0; v < versions.length; v++) {
      const colorMap = new Map<string, string>();
      colorMap.set(versions[v].id, COLORS.highlighted);
      this.addStep(versions[v], colorMap, [versions[v].id],
        `Querying Version ${v}: root sum = ${versions[v].value}`);
    }

    this.addStep(versions[versions.length - 1], new Map(), [],
      `Persistent Segment Tree complete. ${versions.length} versions available.`);

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
