import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface BTNode {
  id: string;
  value: number;
  left: BTNode | null;
  right: BTNode | null;
}

let nodeCounter = 0;

function createNode(value: number): BTNode {
  return { id: `bn-${nodeCounter++}`, value, left: null, right: null };
}

function cloneTree(node: BTNode | null): BTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneTree(node.left),
    right: cloneTree(node.right),
  };
}

function toTreeNodeData(node: BTNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: toTreeNodeData(node.left, colorMap),
    right: toTreeNodeData(node.right, colorMap),
  };
}

/**
 * Binary Tree visualization: builds a complete binary tree by level-order
 * insertion, then demonstrates inorder, preorder, and postorder traversals.
 */
export class BinaryTreeVisualization implements TreeVisualizationEngine {
  name = 'Binary Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: BTNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: toTreeNodeData(cloneTree(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private inorder(node: BTNode | null, root: BTNode, visited: Set<string>): void {
    if (!node) return;
    this.inorder(node.left, root, visited);
    visited.add(node.id);
    const colorMap = new Map<string, string>();
    for (const id of visited) colorMap.set(id, COLORS.inserted);
    colorMap.set(node.id, COLORS.highlighted);
    this.addStep(root, colorMap, [node.id], `Inorder visit: ${node.value}`);
    this.inorder(node.right, root, visited);
  }

  private preorder(node: BTNode | null, root: BTNode, visited: Set<string>): void {
    if (!node) return;
    visited.add(node.id);
    const colorMap = new Map<string, string>();
    for (const id of visited) colorMap.set(id, COLORS.inserted);
    colorMap.set(node.id, COLORS.compared);
    this.addStep(root, colorMap, [node.id], `Preorder visit: ${node.value}`);
    this.preorder(node.left, root, visited);
    this.preorder(node.right, root, visited);
  }

  private postorder(node: BTNode | null, root: BTNode, visited: Set<string>): void {
    if (!node) return;
    this.postorder(node.left, root, visited);
    this.postorder(node.right, root, visited);
    visited.add(node.id);
    const colorMap = new Map<string, string>();
    for (const id of visited) colorMap.set(id, COLORS.inserted);
    colorMap.set(node.id, COLORS.removed);
    this.addStep(root, colorMap, [node.id], `Postorder visit: ${node.value}`);
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building Binary Tree with values: [${values.join(', ')}]`,
    });

    if (values.length === 0) return this.steps[0];

    // Build complete binary tree via level-order insertion
    const nodes: BTNode[] = [];
    for (const value of values) {
      const newNode = createNode(value);
      nodes.push(newNode);
      const n = nodes.length;
      if (n > 1) {
        const parentIdx = Math.floor((n - 2) / 2);
        if (n % 2 === 0) {
          nodes[parentIdx].left = newNode;
        } else {
          nodes[parentIdx].right = newNode;
        }
      }
      const colorMap = new Map<string, string>();
      colorMap.set(newNode.id, COLORS.inserted);
      this.addStep(nodes[0], colorMap, [newNode.id],
        `Inserted ${value} at level ${Math.floor(Math.log2(n))}`);
    }

    const root = nodes[0];

    this.addStep(root, new Map(), [], `Binary Tree built with ${values.length} nodes`);

    // Inorder traversal
    this.addStep(root, new Map(), [], `--- Inorder Traversal (Left, Root, Right) ---`);
    this.inorder(root, root, new Set());

    // Preorder traversal
    this.addStep(root, new Map(), [], `--- Preorder Traversal (Root, Left, Right) ---`);
    this.preorder(root, root, new Set());

    // Postorder traversal
    this.addStep(root, new Map(), [], `--- Postorder Traversal (Left, Right, Root) ---`);
    this.postorder(root, root, new Set());

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
