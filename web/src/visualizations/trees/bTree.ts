import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

const T = 3; // minimum degree
const MAX_KEYS = 2 * T - 1;

interface BTreeNode {
  id: string;
  keys: number[];
  children: BTreeNode[];
  leaf: boolean;
}

let nodeCounter = 0;

function createBTreeNode(leaf: boolean): BTreeNode {
  return { id: `bt-${nodeCounter++}`, keys: [], children: [], leaf };
}

function cloneBTree(node: BTreeNode | null): BTreeNode | null {
  if (!node) return null;
  return {
    id: node.id,
    keys: [...node.keys],
    children: node.children.map(c => cloneBTree(c)!),
    leaf: node.leaf,
  };
}

function bTreeToTreeNodeData(node: BTreeNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => bTreeToTreeNodeData(c, colorMap))
    .filter((c): c is TreeNodeData => c !== null);
  const result: TreeNodeData = {
    id: node.id,
    value: `[${node.keys.join(', ')}]`,
    color: colorMap.get(node.id) ?? COLORS.default,
  };
  if (childNodes.length > 0) {
    result.children = childNodes;
  }
  return result;
}

export class BTreeVisualization implements TreeVisualizationEngine {
  name = 'B-Tree';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: BTreeNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: bTreeToTreeNodeData(cloneBTree(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  private splitChild(parent: BTreeNode, i: number, root: BTreeNode): void {
    const full = parent.children[i];
    const newNode = createBTreeNode(full.leaf);
    newNode.keys = full.keys.splice(T);
    const median = full.keys.pop()!;

    if (!full.leaf) {
      newNode.children = full.children.splice(T);
    }

    parent.keys.splice(i, 0, median);
    parent.children.splice(i + 1, 0, newNode);

    const colorMap = new Map<string, string>();
    colorMap.set(full.id, COLORS.compared);
    colorMap.set(newNode.id, COLORS.inserted);
    colorMap.set(parent.id, COLORS.highlighted);
    this.addStep(root, colorMap, [parent.id, full.id, newNode.id],
      `Split node: median ${median} promoted. Left keys: [${full.keys.join(', ')}], Right keys: [${newNode.keys.join(', ')}]`);
  }

  private insertNonFull(node: BTreeNode, key: number, root: BTreeNode): void {
    if (node.leaf) {
      let i = node.keys.length - 1;
      node.keys.push(0);
      while (i >= 0 && key < node.keys[i]) {
        node.keys[i + 1] = node.keys[i];
        i--;
      }
      node.keys[i + 1] = key;

      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.inserted);
      this.addStep(root, colorMap, [node.id],
        `Inserted ${key} into leaf node [${node.keys.join(', ')}]`);
    } else {
      let i = node.keys.length - 1;
      while (i >= 0 && key < node.keys[i]) i--;
      i++;

      const colorMap = new Map<string, string>();
      colorMap.set(node.id, COLORS.compared);
      this.addStep(root, colorMap, [node.id],
        `Traversing internal node [${node.keys.join(', ')}], going to child ${i}`);

      if (node.children[i].keys.length === MAX_KEYS) {
        this.splitChild(node, i, root);
        if (key > node.keys[i]) i++;
      }
      this.insertNonFull(node.children[i], key, root);
    }
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    nodeCounter = 0;

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Building B-Tree (order ${T}) with values: [${values.join(', ')}]`,
    });

    if (values.length === 0) return this.steps[0];

    let root = createBTreeNode(true);

    for (const value of values) {
      this.addStep(root, new Map(), [], `--- Inserting ${value} ---`);

      if (root.keys.length === MAX_KEYS) {
        const newRoot = createBTreeNode(false);
        newRoot.children.push(root);
        this.splitChild(newRoot, 0, newRoot);
        root = newRoot;
      }
      this.insertNonFull(root, value, root);
    }

    this.addStep(root, new Map(), [],
      `B-Tree construction complete with ${values.length} keys`);

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
