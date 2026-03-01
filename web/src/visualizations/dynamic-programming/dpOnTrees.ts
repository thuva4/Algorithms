import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class DpOnTreesVisualization implements DPVisualizationEngine {
  name = 'DP on Trees';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Maximum Independent Set on a tree (rooted at 0)
    // Input: node values. Tree edges derived from values length.
    const vals = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = vals.length;

    // Build a simple binary-like tree: node i's children are 2i+1, 2i+2
    const children: number[][] = Array.from({ length: n }, () => []);
    for (let i = 0; i < n; i++) {
      const left = 2 * i + 1;
      const right = 2 * i + 2;
      if (left < n) children[i].push(left);
      if (right < n) children[i].push(right);
    }

    // dp[node][0] = max independent set NOT including node
    // dp[node][1] = max independent set including node
    const dpInclude: number[] = new Array(n).fill(0);
    const dpExclude: number[] = new Array(n).fill(0);

    const rowLabels = ['value', 'include', 'exclude', 'best'];
    const colLabels = Array.from({ length: n }, (_, i) => `n${i}`);

    const cellColors: string[][] = [
      new Array(n).fill(COLORS.computed),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
    ];
    const best: number[] = new Array(n).fill(0);

    const makeTable = (): DPCell[][] => [
      vals.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      dpInclude.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
      dpExclude.map((v, j) => ({ value: cellColors[2][j] === COLORS.empty ? '' : v, color: cellColors[2][j] })),
      best.map((v, j) => ({ value: cellColors[3][j] === COLORS.empty ? '' : v, color: cellColors[3][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `DP on Trees: Maximum Independent Set. Node values = [${vals.join(', ')}]. Tree rooted at node 0.`,
    });

    // Post-order traversal
    // Use iterative post-order
    const postOrder: number[] = [];
    const dfs = (node: number) => {
      for (const child of children[node]) {
        dfs(child);
      }
      postOrder.push(node);
    };
    dfs(0);

    for (const node of postOrder) {
      dpInclude[node] = vals[node];
      dpExclude[node] = 0;

      for (const child of children[node]) {
        dpInclude[node] += dpExclude[child];
        dpExclude[node] += Math.max(dpInclude[child], dpExclude[child]);
      }

      best[node] = Math.max(dpInclude[node], dpExclude[node]);

      const depColors = cellColors.map(row => [...row]);
      depColors[1][node] = COLORS.computing;
      depColors[2][node] = COLORS.computing;
      const arrows: { from: [number, number]; to: [number, number] }[] = [];
      for (const child of children[node]) {
        depColors[1][child] = COLORS.dependency;
        depColors[2][child] = COLORS.dependency;
        arrows.push({ from: [1, node], to: [2, child] });
        arrows.push({ from: [2, node], to: [3, child] });
      }

      cellColors[1][node] = COLORS.computed;
      cellColors[2][node] = COLORS.computed;
      cellColors[3][node] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [1, node],
        arrows: arrows.slice(0, 4),
        stepDescription: `Node ${node} (val=${vals[node]}): include=${dpInclude[node]} (val + sum exclude children), exclude=${dpExclude[node]} (sum best children). Best=${best[node]}.`,
      });
    }

    // Final - highlight nodes in the optimal set
    const finalColors = cellColors.map(row => [...row]);
    const inSet: boolean[] = new Array(n).fill(false);
    const markOptimal = (node: number, canInclude: boolean) => {
      if (canInclude && dpInclude[node] >= dpExclude[node]) {
        inSet[node] = true;
        finalColors[0][node] = COLORS.optimal;
        finalColors[3][node] = COLORS.optimal;
        for (const child of children[node]) markOptimal(child, false);
      } else {
        for (const child of children[node]) markOptimal(child, true);
      }
    };
    markOptimal(0, true);

    this.steps.push({
      table: [
        vals.map((v, j) => ({ value: v, color: finalColors[0][j] })),
        dpInclude.map((v, j) => ({ value: v, color: finalColors[1][j] })),
        dpExclude.map((v, j) => ({ value: v, color: finalColors[2][j] })),
        best.map((v, j) => ({ value: v, color: finalColors[3][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [3, 0],
      arrows: [],
      stepDescription: `Maximum Independent Set = ${best[0]}. Green nodes are selected.`,
    });

    return this.steps[0];
  }

  step(): DPVisualizationState | null {
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
