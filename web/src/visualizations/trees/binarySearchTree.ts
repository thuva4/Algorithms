import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  visiting: '#eab308',
  visited: '#22c55e',
  found: '#3b82f6',
  removed: '#ef4444',
  inserted: '#a855f7',
};

interface BSTNode {
  id: string;
  value: number;
  left: BSTNode | null;
  right: BSTNode | null;
}

let nodeCounter = 0;

function createBSTNode(value: number): BSTNode {
  return { id: `bst-${nodeCounter++}`, value, left: null, right: null };
}

function bstInsert(root: BSTNode | null, value: number): { root: BSTNode; path: string[] } {
  const path: string[] = [];
  if (!root) {
    const node = createBSTNode(value);
    path.push(node.id);
    return { root: node, path };
  }

  function insert(node: BSTNode): BSTNode {
    path.push(node.id);
    if (value < node.value) {
      if (node.left === null) {
        node.left = createBSTNode(value);
        path.push(node.left.id);
      } else {
        node.left = insert(node.left);
      }
    } else {
      if (node.right === null) {
        node.right = createBSTNode(value);
        path.push(node.right.id);
      } else {
        node.right = insert(node.right);
      }
    }
    return node;
  }

  const newRoot = insert(root);
  return { root: newRoot, path };
}

function cloneBST(node: BSTNode | null): BSTNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneBST(node.left),
    right: cloneBST(node.right),
  };
}

function bstToTreeNodeData(
  node: BSTNode | null,
  colorMap: Map<string, string>
): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: bstToTreeNodeData(node.left, colorMap),
    right: bstToTreeNodeData(node.right, colorMap),
  };
}

function getAllNodeIds(node: BSTNode | null): string[] {
  if (!node) return [];
  return [node.id, ...getAllNodeIds(node.left), ...getAllNodeIds(node.right)];
}

export class BinarySearchTreeVisualization implements TreeVisualizationEngine {
  name = 'Binary Search Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    let root: BSTNode | null = null;

    // Initial empty state
    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Starting BST construction with values: [${values.join(', ')}]`,
    });

    // Insert each value and animate the path
    for (const value of values) {
      const prevRoot = cloneBST(root);
      const result = bstInsert(root, value);
      root = result.root;
      const path = result.path;

      // Animate traversal down the tree for each node on the path
      for (let i = 0; i < path.length - 1; i++) {
        const colorMap = new Map<string, string>();
        // Previously visited nodes on this path
        for (let j = 0; j < i; j++) {
          colorMap.set(path[j], COLORS.visited);
        }
        // Current node being visited
        colorMap.set(path[i], COLORS.visiting);

        const treeSnapshot = bstToTreeNodeData(cloneBST(prevRoot)!, colorMap);
        this.steps.push({
          root: treeSnapshot,
          highlightedNodes: [path[i]],
          stepDescription: `Inserting ${value}: visiting node to find insertion point`,
        });
      }

      // Final insertion step — show the node inserted
      const insertColorMap = new Map<string, string>();
      for (let j = 0; j < path.length - 1; j++) {
        insertColorMap.set(path[j], COLORS.visited);
      }
      insertColorMap.set(path[path.length - 1], COLORS.inserted);

      const treeWithInsert = bstToTreeNodeData(cloneBST(root)!, insertColorMap);
      this.steps.push({
        root: treeWithInsert,
        highlightedNodes: [path[path.length - 1]],
        stepDescription: `Inserted ${value} into the BST`,
      });
    }

    // After all insertions, show search for a value
    if (values.length > 0) {
      const searchTarget = values[Math.floor(values.length / 2)];
      const searchPath: string[] = [];

      let current = root;
      while (current) {
        searchPath.push(current.id);
        if (searchTarget === current.value) break;
        if (searchTarget < current.value) {
          current = current.left;
        } else {
          current = current.right;
        }
      }

      // Animate search traversal
      for (let i = 0; i < searchPath.length; i++) {
        const colorMap = new Map<string, string>();
        for (let j = 0; j < i; j++) {
          colorMap.set(searchPath[j], COLORS.visited);
        }
        colorMap.set(searchPath[i], COLORS.visiting);

        this.steps.push({
          root: bstToTreeNodeData(cloneBST(root)!, colorMap),
          highlightedNodes: [searchPath[i]],
          stepDescription: `Searching for ${searchTarget}: visiting node`,
        });
      }

      // Found step
      const foundMap = new Map<string, string>();
      for (const id of searchPath) {
        foundMap.set(id, COLORS.found);
      }
      this.steps.push({
        root: bstToTreeNodeData(cloneBST(root)!, foundMap),
        highlightedNodes: [searchPath[searchPath.length - 1]],
        stepDescription: `Found ${searchTarget} in the BST! Search path highlighted in blue.`,
      });
    }

    // Final state: all nodes default
    const allIds = getAllNodeIds(root);
    const finalMap = new Map<string, string>();
    for (const id of allIds) {
      finalMap.set(id, COLORS.default);
    }
    this.steps.push({
      root: bstToTreeNodeData(cloneBST(root)!, finalMap),
      highlightedNodes: [],
      stepDescription: 'BST construction and search complete',
    });

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
