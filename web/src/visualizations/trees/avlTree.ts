import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  found: '#3b82f6',
  rotating: '#ef4444',
  inserted: '#a855f7',
};

interface AVLNode {
  id: string;
  value: number;
  height: number;
  left: AVLNode | null;
  right: AVLNode | null;
}

let nodeCounter = 0;

function createAVLNode(value: number): AVLNode {
  return { id: `avl-${nodeCounter++}`, value, height: 1, left: null, right: null };
}

function height(node: AVLNode | null): number {
  return node ? node.height : 0;
}

function updateHeight(node: AVLNode): void {
  node.height = 1 + Math.max(height(node.left), height(node.right));
}

function balanceFactor(node: AVLNode): number {
  return height(node.left) - height(node.right);
}

function cloneAVL(node: AVLNode | null): AVLNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    height: node.height,
    left: cloneAVL(node.left),
    right: cloneAVL(node.right),
  };
}

function avlToTreeNodeData(node: AVLNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: avlToTreeNodeData(node.left, colorMap),
    right: avlToTreeNodeData(node.right, colorMap),
  };
}

export class AVLTreeVisualization implements TreeVisualizationEngine {
  name = 'AVL Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: AVLNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: avlToTreeNodeData(cloneAVL(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private rotateRight(node: AVLNode, root: AVLNode): { rotated: AVLNode; root: AVLNode } {
    const newRoot = node.left!;
    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.rotating);
    colorMap.set(newRoot.id, COLORS.rotating);
    this.addStep(root, colorMap, [node.id, newRoot.id],
      `Right rotation at node ${node.value}: ${newRoot.value} becomes new parent`);

    node.left = newRoot.right;
    newRoot.right = node;
    updateHeight(node);
    updateHeight(newRoot);

    // Update root reference if the rotated node was the root
    const updatedRoot = root === node ? newRoot : root;
    return { rotated: newRoot, root: updatedRoot };
  }

  private rotateLeft(node: AVLNode, root: AVLNode): { rotated: AVLNode; root: AVLNode } {
    const newRoot = node.right!;
    const colorMap = new Map<string, string>();
    colorMap.set(node.id, COLORS.rotating);
    colorMap.set(newRoot.id, COLORS.rotating);
    this.addStep(root, colorMap, [node.id, newRoot.id],
      `Left rotation at node ${node.value}: ${newRoot.value} becomes new parent`);

    node.right = newRoot.left;
    newRoot.left = node;
    updateHeight(node);
    updateHeight(newRoot);

    const updatedRoot = root === node ? newRoot : root;
    return { rotated: newRoot, root: updatedRoot };
  }

  private insertAndRecord(root: AVLNode | null, value: number, treeRoot: AVLNode | null): { node: AVLNode; treeRoot: AVLNode } {
    if (!root) {
      const newNode = createAVLNode(value);
      const colorMap = new Map<string, string>();
      colorMap.set(newNode.id, COLORS.inserted);
      const effectiveRoot = treeRoot ?? newNode;
      this.addStep(effectiveRoot === newNode ? newNode : treeRoot!, colorMap, [newNode.id],
        `Inserted new node with value ${value}`);
      return { node: newNode, treeRoot: treeRoot ?? newNode };
    }

    // Show visiting current node
    const visitMap = new Map<string, string>();
    visitMap.set(root.id, COLORS.visiting);
    this.addStep(treeRoot!, visitMap, [root.id],
      `Inserting ${value}: comparing with node ${root.value}`);

    if (value < root.value) {
      const result = this.insertAndRecord(root.left, value, treeRoot!);
      root.left = result.node;
    } else if (value > root.value) {
      const result = this.insertAndRecord(root.right, value, treeRoot!);
      root.right = result.node;
    } else {
      // Duplicate value, skip
      return { node: root, treeRoot: treeRoot! };
    }

    updateHeight(root);
    const bf = balanceFactor(root);

    // Check for imbalance and apply rotations
    if (bf > 1 && root.left && value < root.left.value) {
      // Left-Left case
      const imbalanceMap = new Map<string, string>();
      imbalanceMap.set(root.id, COLORS.rotating);
      this.addStep(treeRoot!, imbalanceMap, [root.id],
        `Imbalance detected at node ${root.value} (balance factor: ${bf}). Left-Left case.`);
      const result = this.rotateRight(root, treeRoot!);
      this.addStep(result.root, new Map(), [],
        `Balanced after right rotation at ${root.value}`);
      return { node: result.rotated, treeRoot: result.root };
    }

    if (bf < -1 && root.right && value > root.right.value) {
      // Right-Right case
      const imbalanceMap = new Map<string, string>();
      imbalanceMap.set(root.id, COLORS.rotating);
      this.addStep(treeRoot!, imbalanceMap, [root.id],
        `Imbalance detected at node ${root.value} (balance factor: ${bf}). Right-Right case.`);
      const result = this.rotateLeft(root, treeRoot!);
      this.addStep(result.root, new Map(), [],
        `Balanced after left rotation at ${root.value}`);
      return { node: result.rotated, treeRoot: result.root };
    }

    if (bf > 1 && root.left && value > root.left.value) {
      // Left-Right case
      const imbalanceMap = new Map<string, string>();
      imbalanceMap.set(root.id, COLORS.rotating);
      this.addStep(treeRoot!, imbalanceMap, [root.id],
        `Imbalance detected at node ${root.value} (balance factor: ${bf}). Left-Right case.`);
      const leftResult = this.rotateLeft(root.left, treeRoot!);
      root.left = leftResult.rotated;
      const rightResult = this.rotateRight(root, leftResult.root);
      this.addStep(rightResult.root, new Map(), [],
        `Balanced after left-right rotation at ${root.value}`);
      return { node: rightResult.rotated, treeRoot: rightResult.root };
    }

    if (bf < -1 && root.right && value < root.right.value) {
      // Right-Left case
      const imbalanceMap = new Map<string, string>();
      imbalanceMap.set(root.id, COLORS.rotating);
      this.addStep(treeRoot!, imbalanceMap, [root.id],
        `Imbalance detected at node ${root.value} (balance factor: ${bf}). Right-Left case.`);
      const rightResult = this.rotateRight(root.right, treeRoot!);
      root.right = rightResult.rotated;
      const leftResult = this.rotateLeft(root, rightResult.root);
      this.addStep(leftResult.root, new Map(), [],
        `Balanced after right-left rotation at ${root.value}`);
      return { node: leftResult.rotated, treeRoot: leftResult.root };
    }

    return { node: root, treeRoot: treeRoot! };
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Starting AVL Tree construction with values: [${values.join(', ')}]`,
    });

    let root: AVLNode | null = null;

    for (const value of values) {
      this.addStep(root, new Map(), [],
        `--- Inserting value ${value} ---`);

      const result = this.insertAndRecord(root, value, root);
      root = result.node;

      // Show tree after this insertion
      this.addStep(root, new Map(), [],
        `Tree after inserting ${value} (height: ${height(root)})`);
    }

    // Final state
    this.addStep(root, new Map(), [],
      `AVL Tree construction complete. Final height: ${height(root)}`);

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
