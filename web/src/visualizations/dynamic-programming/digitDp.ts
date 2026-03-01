import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class DigitDpVisualization implements DPVisualizationEngine {
  name = 'Digit DP';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Count numbers from 1 to N whose digit sum equals target
    const N = input.target ?? 8;
    const digitSumTarget = input.values?.[0] ?? 5;
    const digits = String(N).split('').map(Number);
    const numDigits = digits.length;

    // dp[pos][sum][tight] - count of numbers
    // We'll display as a 2D table: rows = digit position, cols = current digit sum
    const maxSum = Math.min(9 * numDigits, digitSumTarget + 9);

    const rowLabels = Array.from({ length: numDigits }, (_, i) => `pos=${i}`);
    const colLabels = Array.from({ length: maxSum + 1 }, (_, j) => `s=${j}`);

    // Flatten: show the "tight=false" layer (general case)
    const table: number[][] = Array.from({ length: numDigits }, () => new Array(maxSum + 1).fill(0));
    const cellColors: string[][] = Array.from({ length: numDigits }, () => new Array(maxSum + 1).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      table.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : v,
        color: cellColors[i][j],
      })));

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Digit DP: count numbers 1..${N} with digit sum = ${digitSumTarget}. Digits of N = [${digits.join(', ')}].`,
    });

    // Solve using memoized digit DP, recording steps
    const memo: Map<string, number> = new Map();

    const solve = (pos: number, sum: number, tight: boolean, started: boolean): number => {
      if (sum > digitSumTarget) return 0;
      if (pos === numDigits) {
        return (started && sum === digitSumTarget) ? 1 : 0;
      }

      const key = `${pos},${sum},${tight ? 1 : 0},${started ? 1 : 0}`;
      if (memo.has(key)) return memo.get(key)!;

      const limit = tight ? digits[pos] : 9;
      let count = 0;

      for (let d = 0; d <= limit; d++) {
        const newStarted = started || d > 0;
        const newSum = newStarted ? sum + d : sum;
        count += solve(pos + 1, newSum, tight && d === limit, newStarted);
      }

      memo.set(key, count);

      // Record in the visualization table (non-tight layer)
      if (!tight && started && sum <= maxSum) {
        table[pos][sum] = count;
        cellColors[pos][sum] = COLORS.computed;
      }

      return count;
    };

    const answer = solve(0, 0, true, false);

    // Generate steps from the filled table
    for (let pos = numDigits - 1; pos >= 0; pos--) {
      for (let s = 0; s <= maxSum; s++) {
        if (cellColors[pos][s] !== COLORS.computed) continue;

        const depColors = cellColors.map(row => [...row]);
        depColors[pos][s] = COLORS.computing;
        const arrows: { from: [number, number]; to: [number, number] }[] = [];

        // Show dependency on next position
        if (pos + 1 < numDigits) {
          for (let d = 0; d <= 9 && s + d <= maxSum; d++) {
            if (cellColors[pos + 1][s + d] === COLORS.computed) {
              arrows.push({ from: [pos, s], to: [pos + 1, s + d] });
              depColors[pos + 1][s + d] = COLORS.dependency;
            }
          }
        }

        this.steps.push({
          table: table.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : v,
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [pos, s],
          arrows: arrows.slice(0, 3), // limit arrows for clarity
          stepDescription: `pos=${pos}, digitSum=${s}: ${table[pos][s]} numbers possible.`,
        });
      }
    }

    // Final
    this.steps.push({
      table: table.map((row, ri) => row.map((v, ci) => ({
        value: cellColors[ri][ci] === COLORS.empty ? '' : v,
        color: ci === digitSumTarget ? COLORS.optimal : cellColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Count of numbers 1..${N} with digit sum = ${digitSumTarget}: ${answer}. Green column shows target sum.`,
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
