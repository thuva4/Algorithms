import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class CoinChangeVisualization implements DPVisualizationEngine {
  name = 'Coin Change';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const coins = input.values ?? [1, 5, 10, 25];
    const amount = input.target ?? 11;

    const rowLabels = coins.map((c) => `c=${c}`);
    const colLabels = Array.from({ length: amount + 1 }, (_, i) => String(i));

    // dp[i][j] = min coins using coins[0..i-1] to make amount j
    const numCoins = coins.length;
    const INF = amount + 1;
    const dp: number[][] = Array.from({ length: numCoins }, () => new Array(amount + 1).fill(INF));
    const cellColors: string[][] = Array.from({ length: numCoins }, () => new Array(amount + 1).fill(COLORS.empty));

    const displayVal = (v: number): number | string => (v >= INF ? '\u221E' : v);

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : displayVal(v),
        color: cellColors[i][j],
      })));

    // Initial state
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Coin Change: make amount ${amount} using coins [${coins.join(', ')}]. Find minimum number of coins.`,
    });

    // Base case: amount 0 needs 0 coins
    for (let i = 0; i < numCoins; i++) {
      dp[i][0] = 0;
      cellColors[i][0] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: 0 coins needed to make amount 0.',
    });

    // Fill table row by row
    for (let i = 0; i < numCoins; i++) {
      for (let j = 1; j <= amount; j++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        const depColors = cellColors.map((row) => [...row]);
        depColors[i][j] = COLORS.computing;

        // Option 1: don't use coin i (take from row above if exists)
        let excludeVal = INF;
        if (i > 0) {
          excludeVal = dp[i - 1][j];
          depColors[i - 1][j] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i - 1, j] });
        }

        // Option 2: use coin i (if it fits)
        let includeVal = INF;
        if (coins[i] <= j && dp[i][j - coins[i]] < INF) {
          includeVal = dp[i][j - coins[i]] + 1;
          depColors[i][j - coins[i]] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i, j - coins[i]] });
        }

        const descParts: string[] = [];
        if (i > 0) {
          descParts.push(`exclude coin ${coins[i]}: ${displayVal(excludeVal)}`);
        }
        if (coins[i] <= j) {
          descParts.push(`use coin ${coins[i]}: ${displayVal(dp[i][j - coins[i]])} + 1 = ${displayVal(includeVal)}`);
        } else {
          descParts.push(`coin ${coins[i]} too large`);
        }

        this.steps.push({
          table: dp.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : displayVal(v),
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows,
          stepDescription: `Amount ${j}, coin ${coins[i]}: ${descParts.join('; ')}.`,
        });

        dp[i][j] = Math.min(excludeVal, includeVal);
        cellColors[i][j] = COLORS.computed;

        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [],
          stepDescription: `dp[${i}][${j}] = ${displayVal(dp[i][j])}.`,
        });
      }
    }

    // Traceback
    const finalColors = cellColors.map((row) => [...row]);
    const result = dp[numCoins - 1][amount];
    let ci = numCoins - 1;
    let cj = amount;
    while (cj > 0 && ci >= 0) {
      finalColors[ci][cj] = COLORS.optimal;
      if (ci > 0 && dp[ci - 1][cj] < dp[ci][cj]) {
        ci--;
      } else if (coins[ci] <= cj) {
        cj -= coins[ci];
      } else {
        ci--;
      }
    }
    if (cj === 0 && ci >= 0) {
      finalColors[ci][0] = COLORS.optimal;
    }

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: displayVal(v), color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [numCoins - 1, amount],
      arrows: [],
      stepDescription: result >= INF
        ? `No solution: cannot make amount ${amount} with given coins.`
        : `Minimum coins needed = ${result}. Green cells show the path.`,
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
