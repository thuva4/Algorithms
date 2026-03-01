import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class PartitionProblemVisualization implements DPVisualizationEngine {
  name = 'Partition Problem';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;
    const totalSum = arr.reduce((a, b) => a + b, 0);
    const halfSum = Math.floor(totalSum / 2);

    const rowLabels = ['0', ...arr.map(v => String(v))];
    const colLabels = Array.from({ length: halfSum + 1 }, (_, j) => String(j));

    // dp[i][j] = can we achieve sum j using first i elements?
    const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(halfSum + 1).fill(false));
    const cellColors: string[][] = Array.from({ length: n + 1 }, () => new Array(halfSum + 1).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : (v ? 'T' : 'F'),
        color: cellColors[i][j],
      })));

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Partition Problem: can [${arr.join(', ')}] (sum=${totalSum}) be split into two equal-sum subsets? Target sum = ${halfSum}.`,
    });

    // Base case: sum 0 is always achievable
    for (let i = 0; i <= n; i++) {
      dp[i][0] = true;
      cellColors[i][0] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: sum 0 is achievable with any subset (empty subset).',
    });

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= halfSum; j++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;

        // Exclude current element
        depColors[i - 1][j] = COLORS.dependency;
        arrows.push({ from: [i, j], to: [i - 1, j] });

        let canInclude = false;
        if (arr[i - 1] <= j) {
          depColors[i - 1][j - arr[i - 1]] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i - 1, j - arr[i - 1]] });
          canInclude = dp[i - 1][j - arr[i - 1]];
        }

        dp[i][j] = dp[i - 1][j] || canInclude;

        // Only show step for key cells (limit steps for large tables)
        if (j <= 10 || j === halfSum || dp[i][j] !== dp[i - 1][j]) {
          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : (v ? 'T' : 'F'),
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `Item ${arr[i - 1]}, sum ${j}: exclude=${dp[i - 1][j] ? 'T' : 'F'}${arr[i - 1] <= j ? `, include=${canInclude ? 'T' : 'F'}` : ' (too large)'}. Result: ${dp[i][j] ? 'T' : 'F'}.`,
          });
        }

        cellColors[i][j] = COLORS.computed;
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[n][halfSum] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({
        value: v ? 'T' : 'F',
        color: finalColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [n, halfSum],
      arrows: [],
      stepDescription: dp[n][halfSum]
        ? `Equal partition IS possible. Each subset sums to ${halfSum}.`
        : `Equal partition is NOT possible (total sum ${totalSum} is ${totalSum % 2 === 0 ? 'even but no valid split' : 'odd'}).`,
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
