import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class KnuthOptimizationVisualization implements DPVisualizationEngine {
  name = "Knuth's Optimization";
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Optimal BST-style problem: dp[i][j] = min cost for range [i..j]
    // Knuth's optimization: opt[i][j-1] <= opt[i][j] <= opt[i+1][j]
    const freq = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = freq.length;

    const prefixSum: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) prefixSum[i + 1] = prefixSum[i] + freq[i];
    const rangeSum = (i: number, j: number) => prefixSum[j + 1] - prefixSum[i];

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const opt: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const cellColors: string[][] = Array.from({ length: n }, () => new Array(n).fill(COLORS.empty));

    const rowLabels = Array.from({ length: n }, (_, i) => `i=${i}`);
    const colLabels = Array.from({ length: n }, (_, j) => `j=${j}`);

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
      stepDescription: `Knuth's Optimization: frequencies = [${freq.join(', ')}]. Computes optimal partition in O(n^2) instead of O(n^3).`,
    });

    // Base case: single elements
    for (let i = 0; i < n; i++) {
      dp[i][i] = freq[i];
      opt[i][i] = i;
      cellColors[i][i] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: single-element ranges. dp[i][i] = freq[i], optimal root = i.',
    });

    // Fill by increasing length, using Knuth's optimization
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;
        const sum = rangeSum(i, j);

        const lo = opt[i][j - 1] !== undefined ? opt[i][j - 1] : i;
        const hi = j < n - 1 && opt[i + 1] !== undefined ? (opt[i + 1][j] !== undefined ? opt[i + 1][j] : j) : j;

        for (let r = lo; r <= hi; r++) {
          const leftCost = r > i ? dp[i][r - 1] : 0;
          const rightCost = r < j ? dp[r + 1][j] : 0;
          const cost = leftCost + rightCost + sum;
          if (cost < dp[i][j]) {
            dp[i][j] = cost;
            opt[i][j] = r;
          }
        }

        const bestR = opt[i][j];
        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        if (bestR > i) {
          depColors[i][bestR - 1] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i, bestR - 1] });
        }
        if (bestR < j) {
          depColors[bestR + 1][j] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [bestR + 1, j] });
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
          stepDescription: `Range [${i}..${j}]: Knuth bounds [${lo}..${hi}], best root=${bestR}, dp[${i}][${j}] = ${dp[i][j]}.`,
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
      stepDescription: `Minimum cost = ${dp[0][n - 1]}. Knuth's optimization reduced complexity from O(n^3) to O(n^2).`,
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
