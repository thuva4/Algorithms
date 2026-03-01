import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LongestPalindromicSubsequenceVisualization implements DPVisualizationEngine {
  name = 'Longest Palindromic Subsequence';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text = input.text1 ?? 'BBABCBCAB';
    const n = text.length;

    const rowLabels = text.split('');
    const colLabels = text.split('');

    const dp: number[][] = Array.from({ length: n }, () => new Array(n).fill(0));
    const cellColors: string[][] = Array.from({ length: n }, () => new Array(n).fill(COLORS.empty));

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
      stepDescription: `Longest Palindromic Subsequence of "${text}". dp[i][j] = LPS length for substring s[i..j].`,
    });

    // Base case: single characters
    for (let i = 0; i < n; i++) {
      dp[i][i] = 1;
      cellColors[i][i] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: every single character is a palindrome of length 1.',
    });

    // Fill by increasing substring length
    for (let len = 2; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;

        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;

        if (text[i] === text[j]) {
          dp[i][j] = dp[i + 1][j - 1] + 2;
          if (len > 2) depColors[i + 1][j - 1] = COLORS.dependency;

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows: len > 2 ? [{ from: [i, j], to: [i + 1, j - 1] }] : [],
            stepDescription: `s[${i}]='${text[i]}' == s[${j}]='${text[j]}': dp[${i}][${j}] = dp[${i + 1}][${j - 1}] + 2 = ${dp[i][j]}.`,
          });
        } else {
          depColors[i + 1][j] = COLORS.dependency;
          depColors[i][j - 1] = COLORS.dependency;
          dp[i][j] = Math.max(dp[i + 1][j], dp[i][j - 1]);

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows: [
              { from: [i, j], to: [i + 1, j] },
              { from: [i, j], to: [i, j - 1] },
            ],
            stepDescription: `s[${i}]='${text[i]}' != s[${j}]='${text[j]}': dp[${i}][${j}] = max(dp[${i + 1}][${j}]=${dp[i + 1][j]}, dp[${i}][${j - 1}]=${dp[i][j - 1]}) = ${dp[i][j]}.`,
          });
        }

        cellColors[i][j] = COLORS.computed;
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[0][n - 1] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [0, n - 1],
      arrows: [],
      stepDescription: `Longest Palindromic Subsequence length = ${dp[0][n - 1]}.`,
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
