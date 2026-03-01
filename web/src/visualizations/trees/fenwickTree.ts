import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  found: '#3b82f6',
  building: '#a855f7',
};

/**
 * Fenwick Tree (Binary Indexed Tree) visualization.
 *
 * Because a BIT is stored as a flat array (not a pointer-based tree),
 * we visualize it as a logical tree where each node i is responsible
 * for a range determined by the lowest set bit of i.
 *
 * The tree structure is: node i's parent is i - (i & -i) + (parent's range).
 * We build a visual tree where node i covers indices [i - lowbit(i) + 1, i].
 */

interface BITNode {
  id: string;
  index: number;
  value: number;
  rangeLo: number;
  rangeHi: number;
  children: BITNode[];
}

function lowbit(x: number): number {
  return x & (-x);
}

function buildBITTree(bit: number[], n: number): BITNode | null {
  if (n === 0) return null;

  // Build a map of parent relationships.
  // Node i's parent in the BIT tree is i + lowbit(i) if it exists.
  const childrenMap = new Map<number, number[]>();
  const roots: number[] = [];

  for (let i = 1; i <= n; i++) {
    const parent = i + lowbit(i);
    if (parent <= n) {
      if (!childrenMap.has(parent)) childrenMap.set(parent, []);
      childrenMap.get(parent)!.push(i);
    } else {
      roots.push(i);
    }
  }

  function buildNode(idx: number): BITNode {
    const lo = idx - lowbit(idx) + 1;
    const kids = childrenMap.get(idx) ?? [];
    return {
      id: `bit-${idx}`,
      index: idx,
      value: bit[idx],
      rangeLo: lo,
      rangeHi: idx,
      children: kids.sort((a, b) => a - b).map(buildNode),
    };
  }

  // If there's a single root, use it; otherwise create a virtual root
  if (roots.length === 1) {
    return buildNode(roots[0]);
  }

  // Multiple roots: create a virtual wrapper
  return {
    id: 'bit-root',
    index: 0,
    value: bit.reduce((a, b) => a + b, 0),
    rangeLo: 1,
    rangeHi: n,
    children: roots.sort((a, b) => a - b).map(buildNode),
  };
}

function bitNodeToTreeNodeData(node: BITNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children.map(c => bitNodeToTreeNodeData(c, colorMap)).filter((c): c is TreeNodeData => c !== null);
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

function cloneBITNode(node: BITNode | null): BITNode | null {
  if (!node) return null;
  return {
    id: node.id,
    index: node.index,
    value: node.value,
    rangeLo: node.rangeLo,
    rangeHi: node.rangeHi,
    children: node.children.map(c => cloneBITNode(c)!),
  };
}

export class FenwickTreeVisualization implements TreeVisualizationEngine {
  name = 'Fenwick Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(
    bitTree: BITNode | null,
    colorMap: Map<string, string>,
    highlighted: string[],
    description: string
  ): void {
    this.steps.push({
      root: bitNodeToTreeNodeData(cloneBITNode(bitTree), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = values.length;
    if (n === 0) {
      this.steps.push({
        root: null,
        highlightedNodes: [],
        stepDescription: 'No values provided for Fenwick Tree',
      });
      return this.steps[0];
    }

    // Initial state
    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Fenwick Tree (BIT) from array: [${values.join(', ')}]`,
    });

    // Build BIT incrementally
    const bit = new Array<number>(n + 1).fill(0);

    for (let i = 0; i < n; i++) {
      const val = values[i];
      // Update BIT for index (i + 1)
      let idx = i + 1;
      const updatedNodes: string[] = [];

      while (idx <= n) {
        bit[idx] += val;
        updatedNodes.push(`bit-${idx}`);
        idx += lowbit(idx);
      }

      // Build tree for current state
      const tree = buildBITTree(bit, n);
      const colorMap = new Map<string, string>();
      for (const nodeId of updatedNodes) {
        colorMap.set(nodeId, COLORS.building);
      }
      this.addStep(tree, colorMap, updatedNodes,
        `Added value ${val} (index ${i}): updated BIT nodes at indices [${updatedNodes.map(id => id.replace('bit-', '')).join(', ')}]`);
    }

    // Show completed tree
    const finalTree = buildBITTree(bit, n);
    this.addStep(finalTree, new Map(), [],
      `Fenwick Tree built. Array: [${values.join(', ')}]`);

    // Demonstrate prefix sum query
    const queryIdx = Math.min(Math.floor(n / 2) + 1, n);
    this.addStep(finalTree, new Map(), [],
      `--- Prefix Sum Query: sum of first ${queryIdx} elements ---`);

    let sum = 0;
    let qi = queryIdx;
    const queryNodes: string[] = [];

    while (qi > 0) {
      sum += bit[qi];
      queryNodes.push(`bit-${qi}`);

      const colorMap = new Map<string, string>();
      for (const nodeId of queryNodes) {
        colorMap.set(nodeId, COLORS.visiting);
      }
      const currentTree = buildBITTree(bit, n);
      this.addStep(currentTree, colorMap, [`bit-${qi}`],
        `Query: adding BIT[${qi}] = ${bit[qi]}, running sum = ${sum}, next index = ${qi - lowbit(qi)}`);

      qi -= lowbit(qi);
    }

    // Show query result
    const resultMap = new Map<string, string>();
    for (const nodeId of queryNodes) {
      resultMap.set(nodeId, COLORS.found);
    }
    const resultTree = buildBITTree(bit, n);
    this.addStep(resultTree, resultMap, queryNodes,
      `Prefix sum query result: sum(1..${queryIdx}) = ${sum}`);

    // Demonstrate point update
    if (n >= 2) {
      const updateIdx = 1; // 0-based index 1 -> BIT index 2
      const updateVal = 5;
      this.addStep(resultTree, new Map(), [],
        `--- Point Update: add ${updateVal} to index ${updateIdx} ---`);

      let ui = updateIdx + 1;
      const updateNodes: string[] = [];

      while (ui <= n) {
        bit[ui] += updateVal;
        updateNodes.push(`bit-${ui}`);

        const colorMap = new Map<string, string>();
        for (const nodeId of updateNodes) {
          colorMap.set(nodeId, COLORS.building);
        }
        const updateTree = buildBITTree(bit, n);
        this.addStep(updateTree, colorMap, [`bit-${ui}`],
          `Update: BIT[${ui}] += ${updateVal}, new value = ${bit[ui]}, next index = ${ui + lowbit(ui)}`);

        ui += lowbit(ui);
      }

      const finalUpdateTree = buildBITTree(bit, n);
      this.addStep(finalUpdateTree, new Map(), [],
        `Point update complete. Added ${updateVal} to index ${updateIdx}.`);
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
