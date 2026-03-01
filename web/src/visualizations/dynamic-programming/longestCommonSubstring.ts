import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LongestCommonSubstringVisualization implements DPVisualizationEngine {
  name = 'Longest Common Substring';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text1 = input.text1 ?? 'ABABC';
    const text2 = input.text2 ?? 'BABCA';
    const m = text1.length;
    const n = text2.length;

    const rowLabels = ['', ...text1.split('')];
    const colLabels = ['', ...text2.split('')];

    const dp: number[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));
    const cellColors: string[][] = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({ value: cellColors[i][j] === COLORS.empty ? '' : v, color: cellColors[i][j] })));

    // Initial state
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Finding Longest Common Substring of "${text1}" and "${text2}".`,
    });

    // Initialize first row and column to 0
    for (let i = 0; i <= m; i++) {
      cellColors[i][0] = COLORS.computed;
    }
    for (let j = 0; j <= n; j++) {
      cellColors[0][j] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base cases: first row and column initialized to 0.',
    });

    let maxLen = 0;
    let maxI = 0;
    let maxJ = 0;

    // Fill table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        const depColors = cellColors.map((row) => [...row]);
        depColors[i][j] = COLORS.computing;

        if (text1[i - 1] === text2[j - 1]) {
          depColors[i - 1][j - 1] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i - 1, j - 1] });

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `'${text1[i - 1]}' == '${text2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1 = ${dp[i - 1][j - 1] + 1}.`,
          });

          dp[i][j] = dp[i - 1][j - 1] + 1;
          if (dp[i][j] > maxLen) {
            maxLen = dp[i][j];
            maxI = i;
            maxJ = j;
          }
        } else {
          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows: [],
            stepDescription: `'${text1[i - 1]}' != '${text2[j - 1]}': dp[${i}][${j}] = 0 (substring broken).`,
          });

          dp[i][j] = 0;
        }

        cellColors[i][j] = COLORS.computed;
        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [],
          stepDescription: `dp[${i}][${j}] = ${dp[i][j]}.`,
        });
      }
    }

    // Highlight the longest common substring diagonal
    const finalColors = cellColors.map((row) => [...row]);
    if (maxLen > 0) {
      for (let k = 0; k < maxLen; k++) {
        finalColors[maxI - k][maxJ - k] = COLORS.optimal;
      }
    }

    const substring = maxLen > 0 ? text1.substring(maxI - maxLen, maxI) : '';

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: maxLen > 0 ? [maxI, maxJ] : null,
      arrows: [],
      stepDescription: maxLen > 0
        ? `Longest Common Substring = "${substring}" (length ${maxLen}). Green diagonal shows the match.`
        : 'No common substring found.',
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
