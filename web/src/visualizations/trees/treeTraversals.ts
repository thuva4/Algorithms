import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  found: '#3b82f6',
};

interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

let nodeCounter = 0;

function createNode(value: number): BSTNode {
  return { id: `trav-${nodeCounter++}`, value, left: null, right: null };
}

function insertBST(root: BSTNode | null, value: number): BSTNode {
  if (!root) return createNode(value);
  if (value < root.value) {
    root.left = insertBST(root.left, value);
  } else {
    root.right = insertBST(root.right, value);
  }
  return root;
}

function cloneNode(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return { id: node.id, value: node.value, left: cloneNode(node.left), right: cloneNode(node.right) };
}

function toTreeNodeData(node: BSTNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: toTreeNodeData(node.left, colorMap),
    right: toTreeNodeData(node.right, colorMap),
  };
}

type TraversalOrder = 'inorder' | 'preorder' | 'postorder';

function getTraversalOrder(node: BSTNode | null, order: TraversalOrder): string[] {
  if (!node) return [];
  switch (order) {
    case 'inorder':
      return [...getTraversalOrder(node.left, order), node.id, ...getTraversalOrder(node.right, order)];
    case 'preorder':
      return [node.id, ...getTraversalOrder(node.left, order), ...getTraversalOrder(node.right, order)];
    case 'postorder':
      return [...getTraversalOrder(node.left, order), ...getTraversalOrder(node.right, order), node.id];
  }
}

function getNodeValue(root: BSTNode | null, id: string): number | undefined {
  if (!root) return undefined;
  if (root.id === id) return root.value;
  return getNodeValue(root.left, id) ?? getNodeValue(root.right, id);
}

const ORDER_LABELS: Record<TraversalOrder, string> = {
  inorder: 'In-order (Left, Root, Right)',
  preorder: 'Pre-order (Root, Left, Right)',
  postorder: 'Post-order (Left, Right, Root)',
};

export class TreeTraversalsVisualization implements TreeVisualizationEngine {
  name = 'Tree Traversals';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    // Build BST from input values
    let root: BSTNode | null = null;
    for (const v of values) {
      root = insertBST(root, v);
    }

    // Initial state
    const emptyMap = new Map<string, string>();
    this.steps.push({
      root: toTreeNodeData(cloneNode(root), emptyMap),
      highlightedNodes: [],
      stepDescription: `BST built from [${values.join(', ')}]. Starting traversals.`,
    });

    // Run all three traversals
    const traversals: TraversalOrder[] = ['inorder', 'preorder', 'postorder'];

    for (const order of traversals) {
      const sequence = getTraversalOrder(root, order);
      const visited: string[] = [];
      const result: number[] = [];

      // Header step
      this.steps.push({
        root: toTreeNodeData(cloneNode(root), new Map()),
        highlightedNodes: [],
        stepDescription: `--- ${ORDER_LABELS[order]} Traversal ---`,
      });

      for (const id of sequence) {
        const colorMap = new Map<string, string>();
        for (const vid of visited) {
          colorMap.set(vid, COLORS.visited);
        }
        colorMap.set(id, COLORS.visiting);

        const val = getNodeValue(root, id);
        this.steps.push({
          root: toTreeNodeData(cloneNode(root), colorMap),
          highlightedNodes: [id],
          stepDescription: `${ORDER_LABELS[order]}: visiting node ${val}`,
        });

        visited.push(id);
        if (val !== undefined) result.push(val);

        // Show visited state
        const visitedMap = new Map<string, string>();
        for (const vid of visited) {
          visitedMap.set(vid, COLORS.visited);
        }
        this.steps.push({
          root: toTreeNodeData(cloneNode(root), visitedMap),
          highlightedNodes: [],
          stepDescription: `${ORDER_LABELS[order]}: visited ${val}. Result so far: [${result.join(', ')}]`,
        });
      }

      // Completed traversal — highlight result path in blue
      const resultMap = new Map<string, string>();
      for (const id of sequence) {
        resultMap.set(id, COLORS.found);
      }
      this.steps.push({
        root: toTreeNodeData(cloneNode(root), resultMap),
        highlightedNodes: [],
        stepDescription: `${ORDER_LABELS[order]} complete: [${result.join(', ')}]`,
      });
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
