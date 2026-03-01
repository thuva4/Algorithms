import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface SplayNode {
  id: string;
  key: number;
  left: SplayNode | null;
  right: SplayNode | null;
  parent: SplayNode | null;
}

let nodeCounter = 0;

function createSplayNode(key: number): SplayNode {
  return { id: `sp-${nodeCounter++}`, key, left: null, right: null, parent: null };
}

function cloneSplay(node: SplayNode | null): SplayNode | null {
  if (!node) return null;
  return {
    id: node.id,
    key: node.key,
    left: cloneSplay(node.left),
    right: cloneSplay(node.right),
    parent: null,
  };
}

function splayToTreeNodeData(node: SplayNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.key,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: splayToTreeNodeData(node.left, colorMap),
    right: splayToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Splay Tree visualization.
 * Self-adjusting BST that moves recently accessed elements to the root
 * via zig, zig-zig, and zig-zag rotations.
 */
export class SplayTreeVisualization implements TreeVisualizationEngine {
  name = 'Splay Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;
  private root: SplayNode | null = null;

  private addStep(colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: splayToTreeNodeData(cloneSplay(this.root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private rotateLeft(x: SplayNode): void {
    const y = x.right!;
    x.right = y.left;
    if (y.left) y.left.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.left) x.parent.left = y;
    else x.parent.right = y;
    y.left = x;
    x.parent = y;
  }

  private rotateRight(x: SplayNode): void {
    const y = x.left!;
    x.left = y.right;
    if (y.right) y.right.parent = x;
    y.parent = x.parent;
    if (!x.parent) this.root = y;
    else if (x === x.parent.right) x.parent.right = y;
    else x.parent.left = y;
    y.right = x;
    x.parent = y;
  }

  private splay(x: SplayNode): void {
    while (x.parent) {
      const p = x.parent;
      const g = p.parent;

      if (!g) {
        // Zig step
        if (x === p.left) {
          const colorMap = new Map<string, string>();
          colorMap.set(x.id, COLORS.highlighted);
          colorMap.set(p.id, COLORS.compared);
          this.addStep(colorMap, [x.id, p.id], `Zig: right rotate at ${p.key}`);
          this.rotateRight(p);
        } else {
          const colorMap = new Map<string, string>();
          colorMap.set(x.id, COLORS.highlighted);
          colorMap.set(p.id, COLORS.compared);
          this.addStep(colorMap, [x.id, p.id], `Zig: left rotate at ${p.key}`);
          this.rotateLeft(p);
        }
      } else if (x === p.left && p === g.left) {
        // Zig-zig (both left children)
        const colorMap = new Map<string, string>();
        colorMap.set(x.id, COLORS.highlighted);
        colorMap.set(p.id, COLORS.compared);
        colorMap.set(g.id, COLORS.removed);
        this.addStep(colorMap, [x.id, p.id, g.id], `Zig-Zig: right rotate at ${g.key}, then ${p.key}`);
        this.rotateRight(g);
        this.rotateRight(p);
      } else if (x === p.right && p === g.right) {
        // Zig-zig (both right children)
        const colorMap = new Map<string, string>();
        colorMap.set(x.id, COLORS.highlighted);
        colorMap.set(p.id, COLORS.compared);
        colorMap.set(g.id, COLORS.removed);
        this.addStep(colorMap, [x.id, p.id, g.id], `Zig-Zig: left rotate at ${g.key}, then ${p.key}`);
        this.rotateLeft(g);
        this.rotateLeft(p);
      } else if (x === p.right && p === g.left) {
        // Zig-zag (left-right)
        const colorMap = new Map<string, string>();
        colorMap.set(x.id, COLORS.highlighted);
        colorMap.set(p.id, COLORS.compared);
        colorMap.set(g.id, COLORS.removed);
        this.addStep(colorMap, [x.id, p.id, g.id], `Zig-Zag: left rotate at ${p.key}, then right rotate at ${g.key}`);
        this.rotateLeft(p);
        this.rotateRight(g);
      } else {
        // Zig-zag (right-left)
        const colorMap = new Map<string, string>();
        colorMap.set(x.id, COLORS.highlighted);
        colorMap.set(p.id, COLORS.compared);
        colorMap.set(g.id, COLORS.removed);
        this.addStep(colorMap, [x.id, p.id, g.id], `Zig-Zag: right rotate at ${p.key}, then left rotate at ${g.key}`);
        this.rotateRight(p);
        this.rotateLeft(g);
      }

      this.addStep(new Map(), [], `After splay step: ${x.key} is ${this.root === x ? 'now root' : 'moving up'}`);
    }
  }

  private insert(key: number): void {
    let y: SplayNode | null = null;
    let x = this.root;

    while (x) {
      y = x;
      const colorMap = new Map<string, string>();
      colorMap.set(x.id, COLORS.compared);
      this.addStep(colorMap, [x.id], `Inserting ${key}: comparing with ${x.key}`);
      if (key < x.key) x = x.left;
      else if (key > x.key) x = x.right;
      else {
        // Duplicate: splay to root
        this.splay(x);
        return;
      }
    }

    const node = createSplayNode(key);
    node.parent = y;
    if (!y) this.root = node;
    else if (key < y.key) y.left = node;
    else y.right = node;

    const insertMap = new Map<string, string>();
    insertMap.set(node.id, COLORS.inserted);
    this.addStep(insertMap, [node.id], `Inserted ${key}, now splaying to root`);

    this.splay(node);
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;
    this.root = null;

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Splay Tree with values: [${values.join(', ')}]`,
    });

    for (const value of values) {
      this.addStep(new Map(), [], `--- Inserting ${value} ---`);
      this.insert(value);
      const rootAfterInsert = this.root as SplayNode | null;
      this.addStep(new Map(), [], `After inserting ${value}: root is ${rootAfterInsert ? rootAfterInsert.key : 'empty'}`);
    }

    // Demonstrate search (access) operation
    if (values.length >= 2) {
      const searchKey = values[0];
      this.addStep(new Map(), [], `--- Accessing ${searchKey} (will splay to root) ---`);

      let node: SplayNode | null = this.root;
      while (node !== null) {
        const current: SplayNode = node;
        const colorMap = new Map<string, string>();
        colorMap.set(current.id, COLORS.compared);
        this.addStep(colorMap, [current.id], `Searching for ${searchKey}: at node ${current.key}`);
        if (searchKey === current.key) {
          this.splay(current);
          this.addStep(new Map(), [], `Found ${searchKey}, splayed to root`);
          break;
        } else if (searchKey < current.key) {
          node = current.left;
        } else {
          node = current.right;
        }
      }
    }

    this.addStep(new Map(), [],
      `Splay Tree operations complete`);

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
