import type { TreeVisualizationEngine, TreeVisualizationState, TreeNodeData } from '../types';

const COLORS = {
  default: '#64748b',
  highlighted: '#3b82f6',
  inserted: '#22c55e',
  compared: '#eab308',
  removed: '#ef4444',
};

interface TLCANode {
  id: string;
  value: number;
  children: TLCANode[];
}

function cloneTLCA(node: TLCANode | null): TLCANode | null {
  if (!node) return null;
  return {
    id: node.id,
    value: node.value,
    children: node.children.map(c => cloneTLCA(c)!),
  };
}

function tlcaToTreeNodeData(node: TLCANode | null, colorMap: Map<string, string>): TreeNodeData | null {
  if (!node) return null;
  const childNodes = node.children
    .map(c => tlcaToTreeNodeData(c, colorMap))
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
 * Tarjan's Offline LCA visualization.
 * Uses DFS + Union-Find to answer all LCA queries in O(n * alpha(n)) time.
 * Processes queries offline: all queries are known in advance.
 */
export class TarjansOfflineLCAVisualization implements TreeVisualizationEngine {
  name = "Tarjan's Offline LCA";
  visualizationType = 'tree' as const;
  private steps: TreeVisualizationState[] = [];
  private currentStepIndex = -1;

  private addStep(root: TLCANode | null, colorMap: Map<string, string>, highlighted: string[], description: string): void {
    this.steps.push({
      root: tlcaToTreeNodeData(cloneTLCA(root), colorMap),
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

    // Build tree (complete binary tree shape)
    const adj: number[][] = Array.from({ length: n }, () => []);
    for (let i = 1; i < n; i++) {
      const parent = Math.floor((i - 1) / 2);
      adj[parent].push(i);
    }

    // Build visual tree
    const buildVisual = (v: number): TLCANode => {
      return {
        id: `tlca-${v}`,
        value: values[v],
        children: adj[v].map(c => buildVisual(c)),
      };
    };
    const root = buildVisual(0);

    this.steps.push({
      root: null,
      highlightedNodes: [],
      stepDescription: `Tarjan's Offline LCA on tree with ${n} nodes`,
    });

    this.addStep(root, new Map(), [], `Original tree`);

    // Generate query pairs
    const queries: [number, number][] = [];
    if (n >= 2) queries.push([0, n - 1]);
    if (n >= 3) queries.push([1, n - 1]);
    if (n >= 4) queries.push([Math.floor(n / 2), n - 2]);

    this.addStep(root, new Map(), [],
      `Queries to answer: ${queries.map(([a, b]) => `LCA(${values[a]}, ${values[b]})`).join(', ')}`);

    // Union-Find
    const parent_uf = Array.from({ length: n }, (_, i) => i);
    const rank_uf = new Array(n).fill(0);
    const ancestor = Array.from({ length: n }, (_, i) => i);

    const find = (x: number): number => {
      if (parent_uf[x] !== x) parent_uf[x] = find(parent_uf[x]);
      return parent_uf[x];
    };

    const union = (x: number, y: number): void => {
      const rx = find(x), ry = find(y);
      if (rx === ry) return;
      if (rank_uf[rx] < rank_uf[ry]) { parent_uf[rx] = ry; }
      else if (rank_uf[rx] > rank_uf[ry]) { parent_uf[ry] = rx; }
      else { parent_uf[ry] = rx; rank_uf[rx]++; }
    };

    // Build query map: for each node, which queries involve it
    const queryMap = new Map<number, { other: number; queryIdx: number }[]>();
    for (let q = 0; q < queries.length; q++) {
      const [a, b] = queries[q];
      if (!queryMap.has(a)) queryMap.set(a, []);
      if (!queryMap.has(b)) queryMap.set(b, []);
      queryMap.get(a)!.push({ other: b, queryIdx: q });
      queryMap.get(b)!.push({ other: a, queryIdx: q });
    }

    const visited = new Array(n).fill(false);
    const answers: (number | null)[] = new Array(queries.length).fill(null);

    // Tarjan's DFS
    const dfs = (u: number): void => {
      visited[u] = true;
      ancestor[find(u)] = u;

      const colorMap = new Map<string, string>();
      colorMap.set(`tlca-${u}`, COLORS.compared);
      this.addStep(root, colorMap, [`tlca-${u}`],
        `DFS visiting node ${values[u]} (index ${u})`);

      // Process children
      for (const child of adj[u]) {
        dfs(child);
        union(u, child);
        ancestor[find(u)] = u;

        const unionMap = new Map<string, string>();
        unionMap.set(`tlca-${u}`, COLORS.highlighted);
        unionMap.set(`tlca-${child}`, COLORS.inserted);
        this.addStep(root, unionMap, [`tlca-${u}`, `tlca-${child}`],
          `Union(${values[u]}, ${values[child]}): ancestor of set = ${values[u]}`);
      }

      // Mark as visited (black) and check queries
      visited[u] = true;
      const visitedMap = new Map<string, string>();
      visitedMap.set(`tlca-${u}`, COLORS.inserted);

      // Answer queries involving u
      const uQueries = queryMap.get(u) ?? [];
      for (const { other, queryIdx } of uQueries) {
        if (visited[other] && answers[queryIdx] === null) {
          const lca = ancestor[find(other)];
          answers[queryIdx] = lca;

          const lcaMap = new Map<string, string>();
          lcaMap.set(`tlca-${u}`, COLORS.highlighted);
          lcaMap.set(`tlca-${other}`, COLORS.highlighted);
          lcaMap.set(`tlca-${lca}`, COLORS.inserted);
          this.addStep(root, lcaMap, [`tlca-${u}`, `tlca-${other}`, `tlca-${lca}`],
            `Query answered: LCA(${values[u]}, ${values[other]}) = ${values[lca]}`);
        }
      }
    };

    this.addStep(root, new Map(), [], `--- Running Tarjan's Offline LCA ---`);
    dfs(0);

    // Summary
    const summaryParts: string[] = [];
    for (let q = 0; q < queries.length; q++) {
      const [a, b] = queries[q];
      const lca = answers[q];
      summaryParts.push(`LCA(${values[a]}, ${values[b]}) = ${lca !== null ? values[lca] : '?'}`);
    }
    this.addStep(root, new Map(), [],
      `All queries answered: ${summaryParts.join(', ')}`);

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
