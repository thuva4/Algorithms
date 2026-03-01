import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

const CHAIN_COLORS = ['#3b82f6', '#22c55e', '#eab308', '#ef4444', '#a855f7', '#f97316', '#06b6d4', '#ec4899'];

interface HLDNode {
  id: string;
  value: number;
  children: HLDNode[];
}

function cloneHLD(node: HLDNode | null): HLDNode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    children: node.children.map(c => cloneHLD(c)!),
  };
}

function hldToTreeNodeData(node: HLDNode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => hldToTreeNodeData(c, colorMap))
    .filter((c): c is TreeNodeData => c !== null);
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

/**
 * Heavy-Light Decomposition visualization.
 * Decomposes a tree into heavy and light chains for efficient path queries.
 */
export class HeavyLightDecompositionVisualization implements TreeVisualizationEngine {
  name = 'Heavy-Light Decomposition';
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: HLDNode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: hldToTreeNodeData(cloneHLD(root), colorMap),
      highlightedNodes: highlighted,
      stepDescription: description,
    });
  }

  initialize(values: number[]): TreeVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = values.length;
    if (n === 0) {
      this.steps.push({ root: null, highlightedNodes: [], stepDescription: 'No values provided' });
      return this.steps[0];
    }

    // Build a tree (complete binary tree structure)
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
      const parent = Math.floor((i - 1) / 2);
      adj[parent].push(i);
      adj[i].push(parent);
    }

    // Build visual tree nodes
    const buildVisual = (v: number, parent: number): HLDNode => {
      const node: HLDNode = { id: `hld-${v}`, value: values[v], children: [] };
      for (const u of adj[v]) {
        if (u !== parent) {
          node.children.push(buildVisual(u, v));
        }
      }
      return node;
    };

    const root = buildVisual(0, -1);

    this.addStep(root, new Map(), [],
      `Original tree with ${n} nodes`);

    // Step 1: Compute subtree sizes
    const subtreeSize = new Array(n).fill(1);
    const parentArr = new Array(n).fill(-1);
    const depth = new Array(n).fill(0);
    const childrenOf: number[][] = Array.from({ length: n }, () => []);

    const dfs1 = (v: number, par: number, d: number): void => {
      parentArr[v] = par;
      depth[v] = d;
      for (const u of adj[v]) {
        if (u !== par) {
          childrenOf[v].push(u);
          dfs1(u, v, d + 1);
          subtreeSize[v] += subtreeSize[u];
        }
      }
    };
    dfs1(0, -1, 0);

    // Show subtree sizes
    const sizeColorMap = new Map<string, string>();
    for (let i = 0; i < n; i++) {
      if (subtreeSize[i] > n / 2) sizeColorMap.set(`hld-${i}`, COLORS.highlighted);
    }
    this.addStep(root, sizeColorMap, [],
      `Computed subtree sizes. Largest subtrees highlighted.`);

    // Step 2: Identify heavy children
    const heavyChild = new Array(n).fill(-1);
    for (let v = 0; v < n; v++) {
      let maxSize = 0;
      for (const u of childrenOf[v]) {
        if (subtreeSize[u] > maxSize) {
          maxSize = subtreeSize[u];
          heavyChild[v] = u;
        }
      }
    }

    const heavyColorMap = new Map<string, string>();
    for (let v = 0; v < n; v++) {
      if (heavyChild[v] !== -1) {
        heavyColorMap.set(`hld-${heavyChild[v]}`, COLORS.inserted);
      }
    }
    this.addStep(root, heavyColorMap, [],
      `Identified heavy children (green). Each node's heavy child has the largest subtree.`);

    // Step 3: Build chains
    const chainHead = new Array(n).fill(-1);
    const chainId = new Array(n).fill(-1);
    let chainCount = 0;

    const dfs2 = (v: number, head: number): void => {
      chainHead[v] = head;
      chainId[v] = chainCount;
      if (v === head) chainCount++;

      if (heavyChild[v] !== -1) {
        // Continue heavy chain
        chainId[heavyChild[v]] = chainId[v];
        dfs2(heavyChild[v], head);
      }

      for (const u of childrenOf[v]) {
        if (u !== heavyChild[v]) {
          // Start new light chain
          dfs2(u, u);
        }
      }
    };

    dfs2(0, 0);

    // Show chains with different colors
    const chainColorMap = new Map<string, string>();
    for (let v = 0; v < n; v++) {
      const cid = chainId[v];
      chainColorMap.set(`hld-${v}`, CHAIN_COLORS[cid % CHAIN_COLORS.length]);
    }
    this.addStep(root, chainColorMap, [],
      `Decomposed into ${chainCount} chains. Each color represents a chain.`);

    // Show each chain individually
    for (let c = 0; c < Math.min(chainCount, 6); c++) {
      const cColorMap = new Map<string, string>();
      const chainNodes: string[] = [];
      for (let v = 0; v < n; v++) {
        if (chainId[v] === c) {
          cColorMap.set(`hld-${v}`, CHAIN_COLORS[c % CHAIN_COLORS.length]);
          chainNodes.push(`hld-${v}`);
        }
      }
      const chainValues = [];
      for (let v = 0; v < n; v++) {
        if (chainId[v] === c) chainValues.push(values[v]);
      }
      this.addStep(root, cColorMap, chainNodes,
        `Chain ${c}: nodes [${chainValues.join(', ')}] (head: ${values[chainHead[chainNodes.length > 0 ? parseInt(chainNodes[0].replace('hld-', '')) : 0]]})`);
    }

    // Show path query example
    if (n >= 3) {
      const u = n - 1;
      const v = Math.floor(n / 2);
      this.addStep(root, new Map(), [],
        `--- Path Query from node ${values[u]} to node ${values[v]} ---`);

      // Walk up chains
      let a = u, b = v;
      const pathNodes: string[] = [];
      while (chainHead[a] !== chainHead[b]) {
        if (depth[chainHead[a]] < depth[chainHead[b]]) {
          [a, b] = [b, a];
        }
        // Walk up chain of a
        let cur = a;
        while (cur !== chainHead[a] && cur !== -1) {
          pathNodes.push(`hld-${cur}`);
          cur = parentArr[cur];
        }
        if (cur !== -1) pathNodes.push(`hld-${cur}`);
        a = parentArr[chainHead[a]];
        if (a === -1) break;
      }

      // Walk the common chain
      if (depth[a] > depth[b]) [a, b] = [b, a];
      let cur = b;
      while (cur !== a && cur !== -1) {
        pathNodes.push(`hld-${cur}`);
        cur = parentArr[cur];
      }
      if (cur !== -1) pathNodes.push(`hld-${cur}`);

      const pathColorMap = new Map<string, string>();
      for (const nodeId of pathNodes) {
        pathColorMap.set(nodeId, COLORS.highlighted);
      }
      this.addStep(root, pathColorMap, pathNodes,
        `Path query visits ${pathNodes.length} nodes using HLD chains`);
    }

    this.addStep(root, chainColorMap, [],
      `Heavy-Light Decomposition complete. ${chainCount} chains created.`);

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
