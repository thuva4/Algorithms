import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class PalindromePartitioningVisualization implements DPVisualizationEngine {
  name = 'Palindrome Partitioning';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text = input.text1 ?? 'AABBC';
    const n = text.length;

    // isPalin[i][j] = true if s[i..j] is palindrome
    const isPalin: boolean[][] = Array.from({ length: n }, () => new Array(n).fill(false));
    for (let i = 0; i < n; i++) isPalin[i][i] = true;
    for (let i = 0; i < n - 1; i++) {
      if (text[i] === text[i + 1]) isPalin[i][i + 1] = true;
    }
    for (let len = 3; len <= n; len++) {
      for (let i = 0; i <= n - len; i++) {
        const j = i + len - 1;
        if (text[i] === text[j] && isPalin[i + 1][j - 1]) isPalin[i][j] = true;
      }
    }

    // dp[i] = min cuts for s[0..i]
    const dp: number[] = new Array(n).fill(0);
    const rowLabels = ['char', 'minCuts'];
    const colLabels = text.split('');
    const cellColors: string[][] = [
      new Array(n).fill(COLORS.computed),
      new Array(n).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      text.split('').map((c, j) => ({ value: c, color: cellColors[0][j] })),
      dp.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Palindrome Partitioning: min cuts to partition "${text}" into palindromic substrings.`,
    });

    for (let i = 0; i < n; i++) {
      if (isPalin[0][i]) {
        dp[i] = 0;
        cellColors[1][i] = COLORS.computed;

        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [1, i],
          arrows: [],
          stepDescription: `s[0..${i}] = "${text.substring(0, i + 1)}" is a palindrome. dp[${i}] = 0 cuts.`,
        });
        continue;
      }

      dp[i] = i; // worst case: cut after every character
      let bestJ = -1;

      for (let j = 1; j <= i; j++) {
        if (isPalin[j][i] && dp[j - 1] + 1 < dp[i]) {
          dp[i] = dp[j - 1] + 1;
          bestJ = j - 1;
        }
      }

      const depColors = cellColors.map(row => [...row]);
      depColors[1][i] = COLORS.computing;
      if (bestJ >= 0) depColors[1][bestJ] = COLORS.dependency;

      this.steps.push({
        table: [
          text.split('').map((c, j) => ({ value: c, color: depColors[0][j] })),
          dp.map((v, j) => ({
            value: depColors[1][j] === COLORS.empty ? '' : v,
            color: depColors[1][j],
          })),
        ],
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: bestJ >= 0 ? [{ from: [1, i], to: [1, bestJ] }] : [],
        stepDescription: `dp[${i}] = ${dp[i]}. ${bestJ >= 0 ? `Best split: s[0..${bestJ}] + palindrome s[${bestJ + 1}..${i}]="${text.substring(bestJ + 1, i + 1)}".` : `Worst case: ${i} cuts.`}`,
      });

      cellColors[1][i] = COLORS.computed;
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[1][n - 1] = COLORS.optimal;

    this.steps.push({
      table: [
        text.split('').map((c, j) => ({ value: c, color: finalColors[0][j] })),
        dp.map((v, j) => ({ value: v, color: finalColors[1][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [1, n - 1],
      arrows: [],
      stepDescription: `Minimum palindrome partitioning cuts = ${dp[n - 1]}.`,
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
