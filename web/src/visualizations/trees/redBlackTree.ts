import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
  rbRed: '#ef4444',
  rbBlack: '#1e293b',
};

interface RBNode {
  id: string;
  key: number;
  left: RBNode | null;
  right: RBNode | null;
  parent: RBNode | null;
  isRed: boolean;
}

let nodeCounter = 0;

function createRBNode(key: number): RBNode {
  return { id: `rb-${nodeCounter++}`, key, left: null, right: null, parent: null, isRed: true };
}

function cloneRB(node: RBNode | null): RBNode | null {
  if (!node) return null;
  const cloned: RBNode = {
    id: node.id,
    key: node.key,
    left: null,
    right: null,
    parent: null,
    isRed: node.isRed,
  };
  cloned.left = cloneRB(node.left);
  cloned.right = cloneRB(node.right);
  return cloned;
}

function rbToTreeNodeData(node: RBNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const defaultColor = node.isRed ? COLORS.rbRed : COLORS.rbBlack;
  return {
    id: node.id,
    value: `${node.key}${node.isRed ? '(R)' : '(B)'}`,
    color: colorMap.get(node.id) ?? defaultColor,
    left: rbToTreeNodeData(node.left, colorMap),
    right: rbToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Red-Black Tree visualization.
 * Demonstrates insertion with recoloring and rotations to maintain RB properties.
 */
export class RedBlackTreeVisualization implements TreeVisualizationEngine {
  name = 'Red-Black Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;
  private root: RBNode | null = null;

  private addStep(colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: rbToTreeNodeData(cloneRB(this.root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private rotateLeft(x: RBNode): void {
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

  private rotateRight(x: RBNode): void {
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

  private fixInsert(z: RBNode): void {
    while (z.parent && z.parent.isRed) {
      const gp = z.parent.parent!;
      if (z.parent === gp.left) {
        const uncle = gp.right;
        if (uncle && uncle.isRed) {
          // Case 1: Uncle is red - recolor
          z.parent.isRed = false;
          uncle.isRed = false;
          gp.isRed = true;

          const colorMap = new Map<string, string>();
          colorMap.set(z.parent.id, COLORS.highlighted);
          colorMap.set(uncle.id, COLORS.highlighted);
          colorMap.set(gp.id, COLORS.compared);
          this.addStep(colorMap, [z.parent.id, uncle.id, gp.id],
            `Recolor: parent ${z.parent.key} and uncle ${uncle.key} to black, grandparent ${gp.key} to red`);

          z = gp;
        } else {
          if (z === z.parent.right) {
            // Case 2: z is right child - left rotate
            z = z.parent;
            const colorMap = new Map<string, string>();
            colorMap.set(z.id, COLORS.compared);
            this.addStep(colorMap, [z.id], `Left rotation at ${z.key} (Left-Right case)`);
            this.rotateLeft(z);
          }
          // Case 3: z is left child - right rotate
          z.parent!.isRed = false;
          z.parent!.parent!.isRed = true;

          const colorMap = new Map<string, string>();
          colorMap.set(z.parent!.id, COLORS.highlighted);
          colorMap.set(z.parent!.parent!.id, COLORS.compared);
          this.addStep(colorMap, [z.parent!.id, z.parent!.parent!.id],
            `Right rotation at ${z.parent!.parent!.key}, recolor`);
          this.rotateRight(z.parent!.parent!);
        }
      } else {
        const uncle = gp.left;
        if (uncle && uncle.isRed) {
          z.parent.isRed = false;
          uncle.isRed = false;
          gp.isRed = true;

          const colorMap = new Map<string, string>();
          colorMap.set(z.parent.id, COLORS.highlighted);
          colorMap.set(uncle.id, COLORS.highlighted);
          colorMap.set(gp.id, COLORS.compared);
          this.addStep(colorMap, [z.parent.id, uncle.id, gp.id],
            `Recolor: parent ${z.parent.key} and uncle ${uncle.key} to black, grandparent ${gp.key} to red`);

          z = gp;
        } else {
          if (z === z.parent.left) {
            z = z.parent;
            const colorMap = new Map<string, string>();
            colorMap.set(z.id, COLORS.compared);
            this.addStep(colorMap, [z.id], `Right rotation at ${z.key} (Right-Left case)`);
            this.rotateRight(z);
          }
          z.parent!.isRed = false;
          z.parent!.parent!.isRed = true;

          const colorMap = new Map<string, string>();
          colorMap.set(z.parent!.id, COLORS.highlighted);
          colorMap.set(z.parent!.parent!.id, COLORS.compared);
          this.addStep(colorMap, [z.parent!.id, z.parent!.parent!.id],
            `Left rotation at ${z.parent!.parent!.key}, recolor`);
          this.rotateLeft(z.parent!.parent!);
        }
      }
    }
    this.root!.isRed = false;
  }

  private insert(key: number): void {
    let y: RBNode | null = null;
    let x = this.root;
    while (x) {
      y = x;
      const colorMap = new Map<string, string>();
      colorMap.set(x.id, COLORS.compared);
      this.addStep(colorMap, [x.id], `Inserting ${key}: comparing with ${x.key}`);
      if (key < x.key) x = x.left;
      else if (key > x.key) x = x.right;
      else return; // duplicate
    }

    const node = createRBNode(key);
    node.parent = y;
    if (!y) this.root = node;
    else if (key < y.key) y.left = node;
    else y.right = node;

    const insertMap = new Map<string, string>();
    insertMap.set(node.id, COLORS.inserted);
    this.addStep(insertMap, [node.id], `Inserted ${key} as red node`);

    this.fixInsert(node);

    this.addStep(new Map(), [], `Tree after inserting ${key} (root is always black)`);
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;
    this.root = null;

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Red-Black Tree with values: [${values.join(', ')}]`,
    });

    for (const value of values) {
      this.addStep(new Map(), [], `--- Inserting ${value} ---`);
      this.insert(value);
    }

    this.addStep(new Map(), [],
      `Red-Black Tree complete with ${values.length} nodes`);

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
