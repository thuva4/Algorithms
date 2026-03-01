import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class OptimalBstVisualization implements DPVisualizationEngine {
  name = 'Optimal Binary Search Tree';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Frequencies / probabilities for keys
    const freq = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = freq.length;

    const rowLabels = Array.from({ length: n }, (_, i) => `i=${i}`);
    const colLabels = Array.from({ length: n }, (_, j) => `j=${j}`);

    // dp[i][j] = minimum cost of optimal BST for keys i..j
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const cellColors: string[][] = Array.from({ length: n }, () => new Array(n).fill(COLORS.empty));

    // Prefix sums for quick range sum
    const prefixSum: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefixSum[i + 1] = prefixSum[i] + freq[i];
    const rangeSum = (i: number, j: number) => prefixSum[j + 1] - prefixSum[i];

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : v,
        color: cellColors[i][j],
      })));

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Optimal BST: frequencies = [${freq.join(', ')}]. Minimize expected search cost.`,
    });

    // Base case: single keys
    for (let i = 0; i < n; i++) {
      dp[i][i] = freq[i];
      cellColors[i][i] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: single key trees. Cost = frequency of that key.',
    });

    // Fill by increasing chain length
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        let bestRoot = i;

        const sum = rangeSum(i, j);

        for (let r = i; r <= j; r++) {
          const leftCost = r > i ? dp[i][r - 1] : 0;
          const rightCost = r < j ? dp[r + 1][j] : 0;
          const cost = leftCost + rightCost + sum;
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            bestRoot = r;
          }
        }

        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        if (bestRoot > i) {
          depColors[i][bestRoot - 1] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i, bestRoot - 1] });
        }
        if (bestRoot < j) {
          depColors[bestRoot + 1][j] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [bestRoot + 1, j] });
        }

        this.steps.push({
          table: dp.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : (v === Infinity ? '' : v),
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows,
          stepDescription: `Keys [${i}..${j}]: best root=${bestRoot}, cost = ${dp[i][j]} (sum of freq=${sum}).`,
        });

        cellColors[i][j] = COLORS.computed;
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[0][n - 1] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({
        value: v === Infinity ? '' : v,
        color: finalColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [0, n - 1],
      arrows: [],
      stepDescription: `Minimum expected search cost = ${dp[0][n - 1]}.`,
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
