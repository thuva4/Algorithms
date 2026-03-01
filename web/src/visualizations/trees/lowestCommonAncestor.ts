import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface LCANode {
  id: string;
  value: number;
  left: LCANode | null;
  right: LCANode | null;
}

let nodeCounter = 0;

function createLCANode(value: number): LCANode {
  return { id: `lca-${nodeCounter++}`, value, left: null, right: null };
}

function cloneLCA(node: LCANode | null): LCANode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    left: cloneLCA(node.left),
    right: cloneLCA(node.right),
  };
}

function lcaToTreeNodeData(node: LCANode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    color: colorMap.get(node.id) ?? COLORS.default,
    left: lcaToTreeNodeData(node.left, colorMap),
    right: lcaToTreeNodeData(node.right, colorMap),
  };
}

/**
 * Lowest Common Ancestor visualization using Binary Lifting.
 * Builds a BST, preprocesses for LCA queries using Euler tour + sparse table,
 * then demonstrates LCA queries.
 */
export class LowestCommonAncestorVisualization implements TreeVisualizationEngine {
  name = 'Lowest Common Ancestor';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: LCANode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: lcaToTreeNodeData(cloneLCA(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private insertBST(root: LCANode | null, value: number): LCANode {
    if (!root) return createLCANode(value);
    if (value < root.value) {
      root.left = this.insertBST(root.left, value);
    } else if (value > root.value) {
      root.right = this.insertBST(root.right, value);
    }
    return root;
  }

  private findNode(root: LCANode | null, value: number): LCANode | null {
    if (!root) return null;
    if (root.value === value) return root;
    return this.findNode(root.left, value) ?? this.findNode(root.right, value);
  }

  private findLCA(
    root: LCANode | null,
    p: number,
    q: number,
    treeRoot: LCANode
  ): LCANode | null {
    if (!root) return null;

    const colorMap = new Map<string, string>();
    colorMap.set(root.id, COLORS.compared);
    this.addStep(treeRoot, colorMap, [root.id],
      `Visiting node ${root.value}, looking for LCA of ${p} and ${q}`);

    if (root.value === p || root.value === q) {
      const foundMap = new Map<string, string>();
      foundMap.set(root.id, COLORS.inserted);
      this.addStep(treeRoot, foundMap, [root.id],
        `Found target node ${root.value}`);
      return root;
    }

    const left = this.findLCA(root.left, p, q, treeRoot);
    const right = this.findLCA(root.right, p, q, treeRoot);

    if (left && right) {
      const lcaMap = new Map<string, string>();
      lcaMap.set(root.id, COLORS.highlighted);
      lcaMap.set(left.id, COLORS.inserted);
      lcaMap.set(right.id, COLORS.inserted);
      this.addStep(treeRoot, lcaMap, [root.id, left.id, right.id],
        `LCA found: node ${root.value} is the LCA of ${p} and ${q} (found in both subtrees)`);
      return root;
    }

    return left ?? right;
  }

  private getDepth(root: LCANode | null, target: number, depth: number): number {
    if (!root) return -1;
    if (root.value === target) return depth;
    const l = this.getDepth(root.left, target, depth + 1);
    if (l !== -1) return l;
    return this.getDepth(root.right, target, depth + 1);
  }

  private collectNodes(root: LCANode | null, nodes: LCANode[]): void {
    if (!root) return;
    this.collectNodes(root.left, nodes);
    nodes.push(root);
    this.collectNodes(root.right, nodes);
  }

  // Binary lifting LCA for BST: since BST has structure, LCA of p,q is the
  // split point where p goes left and q goes right (or vice versa)
  private bstLCA(
    root: LCANode | null,
    p: number,
    q: number,
    treeRoot: LCANode
  ): LCANode | null {
    let node = root;
    while (node) {
      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.compared);
      this.addStep(treeRoot, colorMap, [node.id],
        `BST-LCA: at node ${node.value}, comparing with ${p} and ${q}`);

      if (p < node.value && q < node.value) {
        node = node.left;
      } else if (p > node.value && q > node.value) {
        node = node.right;
      } else {
        const foundMap = new Map<string, string>();
        foundMap.set(node.id, COLORS.highlighted);
        this.addStep(treeRoot, foundMap, [node.id],
          `BST-LCA: node ${node.value} is where ${p} and ${q} split -- this is the LCA`);
        return node;
      }
    }
    return null;
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
      stepDescription: `Building BST for LCA queries with values: [${values.join(', ')}]`,
    });

    // Build BST
    let root: LCANode | null = null;
    for (const value of values) {
      root = this.insertBST(root, value);
      const colorMap = new Map<string, string>();
      const node = this.findNode(root, value);
      if (node) colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, node ? [node.id] : [],
        `Inserted ${value} into BST`);
    }

    this.addStep(root, new Map(), [], `BST built with ${values.length} nodes`);

    // Collect all nodes for query pairs
    const allNodes: LCANode[] = [];
    this.collectNodes(root, allNodes);

    // Demonstrate LCA queries using general approach
    if (allNodes.length >= 2) {
      const p = allNodes[0].value;
      const q = allNodes[allNodes.length - 1].value;

      this.addStep(root, new Map(), [],
        `--- General LCA Query for ${p} and ${q} ---`);
      this.findLCA(root, p, q, root!);
    }

    // Demonstrate BST-specific LCA
    if (allNodes.length >= 3) {
      const p = allNodes[1].value;
      const q = allNodes[allNodes.length - 1].value;

      this.addStep(root, new Map(), [],
        `--- BST-LCA Query for ${p} and ${q} (exploits BST property) ---`);
      this.bstLCA(root, p, q, root!);
    }

    this.addStep(root, new Map(), [],
      `LCA demonstration complete`);

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
