import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class MatrixChainVisualization implements DPVisualizationEngine {
  name = 'Matrix Chain Multiplication';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // dimensions array: matrix i has dimensions dims[i] x dims[i+1]
    const dims = input.values ?? [30, 35, 15, 5, 10, 20, 25];
    const n = dims.length - 1; // number of matrices

    const labels = Array.from({ length: n }, (_, i) => `M${i + 1}`);
    const rowLabels = labels;
    const colLabels = labels;

    // dp[i][j] = minimum cost to multiply matrices i..j
    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const split: number[][] = Array.from({ length: n }, () => new Array(n).fill(-1));
    const cellColors: string[][] = Array.from({ length: n }, () => new Array(n).fill(COLORS.empty));

    const displayVal = (i: number, j: number): number | string =>
      cellColors[i][j] === COLORS.empty ? '' : (i > j ? '' : dp[i][j]);

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((_, j) => ({
        value: i > j ? '' : displayVal(i, j),
        color: i > j ? '#e5e7eb' : cellColors[i][j],
      })));

    // Initial state
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Matrix Chain Multiplication: ${n} matrices with dimensions [${dims.join(', ')}].`,
    });

    // Base case: single matrices cost 0
    for (let i = 0; i < n; i++) {
      dp[i][i] = 0;
      cellColors[i][i] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: multiplying a single matrix costs 0.',
    });

    // Fill table by chain length
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        dp[i][j] = Infinity;

        cellColors[i][j] = COLORS.computing;

        // Try all split points
        for (let k = i; k < j; k++) {
          const cost = dp[i][k] + dp[k + 1][j] + dims[i] * dims[k + 1] * dims[j + 1];

          const depColors = cellColors.map((row) => [...row]);
          depColors[i][j] = COLORS.computing;
          depColors[i][k] = COLORS.dependency;
          depColors[k + 1][j] = COLORS.dependency;

          const arrows: { from: [number, number]; to: [number, number] }[] = [
            { from: [i, j], to: [i, k] },
            { from: [i, j], to: [k + 1, j] },
          ];

          const isBetter = cost < dp[i][j];

          this.steps.push({
            table: dp.map((row, ri) => row.map((_, ci) => ({
              value: ri > ci ? '' : (depColors[ri][ci] === COLORS.empty ? '' : (dp[ri][ci] === Infinity ? '?' : dp[ri][ci])),
              color: ri > ci ? '#e5e7eb' : depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `Split M${i + 1}..M${j + 1} at k=${k + 1}: cost = ${dp[i][k]} + ${dp[k + 1][j] === Infinity ? '?' : dp[k + 1][j]} + ${dims[i]}*${dims[k + 1]}*${dims[j + 1]} = ${cost}${isBetter ? ' (new min)' : ''}.`,
          });

          if (isBetter) {
            dp[i][j] = cost;
            split[i][j] = k;
          }
        }

        cellColors[i][j] = COLORS.computed;
        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [],
          stepDescription: `dp[${i}][${j}] = ${dp[i][j]} (optimal split at k=${split[i][j] + 1}).`,
        });
      }
    }

    // Mark optimal splits
    const finalColors = cellColors.map((row) => [...row]);
    const markOptimal = (i: number, j: number): void => {
      if (i >= j) return;
      finalColors[i][j] = COLORS.optimal;
      const k = split[i][j];
      if (k >= 0) {
        markOptimal(i, k);
        markOptimal(k + 1, j);
      }
    };
    markOptimal(0, n - 1);

    // Build parenthesization string
    const buildParens = (i: number, j: number): string => {
      if (i === j) return `M${i + 1}`;
      const k = split[i][j];
      return `(${buildParens(i, k)} x ${buildParens(k + 1, j)})`;
    };
    const parens = buildParens(0, n - 1);

    this.steps.push({
      table: dp.map((row, ri) => row.map((_, ci) => ({
        value: ri > ci ? '' : dp[ri][ci],
        color: ri > ci ? '#e5e7eb' : finalColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [0, n - 1],
      arrows: [],
      stepDescription: `Minimum cost = ${dp[0][n - 1]}. Optimal parenthesization: ${parens}.`,
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
