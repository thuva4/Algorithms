import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface TreapNode {
  id: string;
  key: number;
  priority: number;
  left: TreapNode | null;
  right: TreapNode | null;
}

let nodeCounter = 0;

function createTreapNode(key: number, priority: number): TreapNode {
  return { id: `tp-${nodeCounter++}`, key, priority, left: null, right: null };
}

function cloneTreap(node: TreapNode | null): TreapNode | null {
  if (!node) return null;
  return {
    id: node.id,
    key: node.key,
    priority: node.priority,
    left: cloneTreap(node.left),
    right: cloneTreap(node.right),
  };
}

function treapToTreeNodeData(node: TreapNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: `${node.key}(p${node.priority})`,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: treapToTreeNodeData(node.left, colorMap),
    right: treapToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Treap visualization.
 * A randomized BST that maintains BST property on keys and
 * min-heap (or max-heap) property on priorities.
 * Uses rotations after insertion to restore heap property.
 */
export class TreapVisualization implements TreeVisualizationEngine {
  name = 'Treap';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: TreapNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: treapToTreeNodeData(cloneTreap(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private rotateRight(node: TreapNode): TreapNode {
    const newRoot = node.left!;
    node.left = newRoot.right;
    newRoot.right = node;
    return newRoot;
  }

  private rotateLeft(node: TreapNode): TreapNode {
    const newRoot = node.right!;
    node.right = newRoot.left;
    newRoot.left = node;
    return newRoot;
  }

  private insert(root: TreapNode | null, key: number, priority: number, treeRoot: { ref: TreapNode | null }): TreapNode {
    if (!root) {
      const newNode = createTreapNode(key, priority);
      if (!treeRoot.ref) treeRoot.ref = newNode;
      const colorMap = new Map<string, string>();
      colorMap.set(newNode.id, COLORS.inserted);
      this.addStep(treeRoot.ref, colorMap, [newNode.id],
        `Inserted key=${key} with priority=${priority}`);
      return newNode;
    }

    const colorMap = new Map<string, string>();
    colorMap.set(root.id, COLORS.compared);
    this.addStep(treeRoot.ref!, colorMap, [root.id],
      `Comparing key ${key} with node ${root.key}`);

    if (key < root.key) {
      root.left = this.insert(root.left, key, priority, treeRoot);
      // Fix heap property: if left child has higher priority (lower value = higher priority in min-heap)
      if (root.left && root.left.priority < root.priority) {
        const rotMap = new Map<string, string>();
        rotMap.set(root.id, COLORS.compared);
        rotMap.set(root.left.id, COLORS.highlighted);
        this.addStep(treeRoot.ref!, rotMap, [root.id, root.left.id],
          `Right rotation: child priority ${root.left.priority} < parent priority ${root.priority}`);
        root = this.rotateRight(root);
      }
    } else if (key > root.key) {
      root.right = this.insert(root.right, key, priority, treeRoot);
      if (root.right && root.right.priority < root.priority) {
        const rotMap = new Map<string, string>();
        rotMap.set(root.id, COLORS.compared);
        rotMap.set(root.right.id, COLORS.highlighted);
        this.addStep(treeRoot.ref!, rotMap, [root.id, root.right.id],
          `Left rotation: child priority ${root.right.priority} < parent priority ${root.priority}`);
        root = this.rotateLeft(root);
      }
    }

    return root;
  }

  private search(root: TreapNode | null, key: number, treeRoot: TreapNode): boolean {
    if (!root) return false;

    const colorMap = new Map<string, string>();
    colorMap.set(root.id, COLORS.compared);
    this.addStep(treeRoot, colorMap, [root.id],
      `Searching for ${key}: at node ${root.key}`);

    if (key === root.key) {
      const foundMap = new Map<string, string>();
      foundMap.set(root.id, COLORS.inserted);
      this.addStep(treeRoot, foundMap, [root.id],
        `Found ${key}!`);
      return true;
    }
    if (key < root.key) return this.search(root.left, key, treeRoot);
    return this.search(root.right, key, treeRoot);
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    if (values.length === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    // Generate random priorities using a simple PRNG seeded from values
    const priorities: number[] = [];
    let seed = values.reduce((a, b) => a + b, 0) || 42;
    for (let i = 0; i < values.length; i++) {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      priorities.push(seed % 100);
    }

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Treap with keys: [${values.join(', ')}], priorities: [${priorities.join(', ')}]`,
    });

    const treeRoot: { ref: TreapNode | null } = { ref: null };
    let root: TreapNode | null = null;

    for (let i = 0; i < values.length; i++) {
      this.addStep(root, new Map(), [], `--- Inserting key=${values[i]}, priority=${priorities[i]} ---`);
      root = this.insert(root, values[i], priorities[i], treeRoot);
      treeRoot.ref = root;
      this.addStep(root, new Map(), [],
        `Tree after inserting ${values[i]}`);
    }

    this.addStep(root, new Map(), [],
      `Treap built. BST property on keys, min-heap property on priorities.`);

    // Demonstrate search
    if (values.length >= 2) {
      const searchKey = values[Math.floor(values.length / 2)];
      this.addStep(root, new Map(), [], `--- Searching for ${searchKey} ---`);
      this.search(root, searchKey, root!);
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
