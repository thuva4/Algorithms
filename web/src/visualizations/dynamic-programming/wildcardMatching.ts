import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class WildcardMatchingVisualization implements DPVisualizationEngine {
  name = 'Wildcard Matching';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text = input.text1 ?? 'adceb';
    const pattern = input.text2 ?? '*a*b';
    const m = text.length;
    const n = pattern.length;

    const rowLabels = ['', ...pattern.split('')];
    const colLabels = ['', ...text.split('')];

    // dp[i][j] = does pattern[0..i-1] match text[0..j-1]?
    const dp: boolean[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(false));
    const cellColors: string[][] = Array.from({ length: n + 1 }, () => new Array(m + 1).fill(COLORS.empty));

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
      stepDescription: `Wildcard Matching: does pattern "${pattern}" match text "${text}"? (* = any sequence, ? = any single char)`,
    });

    // Base case: empty pattern matches empty text
    dp[0][0] = true;
    cellColors[0][0] = COLORS.computed;

    // Pattern of only *'s matches empty text
    for (let i = 1; i <= n; i++) {
      if (pattern[i - 1] === '*') {
        dp[i][0] = dp[i - 1][0];
      }
      cellColors[i][0] = COLORS.computed;
    }
    // Empty pattern vs non-empty text
    for (let j = 1; j <= m; j++) {
      cellColors[0][j] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base cases: empty pattern matches empty text. Leading *s can match empty text.',
    });

    // Fill table
    for (let i = 1; i <= n; i++) {
      for (let j = 1; j <= m; j++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];
        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;

        if (pattern[i - 1] === '*') {
          // * matches zero chars (dp[i-1][j]) or one more char (dp[i][j-1])
          depColors[i - 1][j] = COLORS.dependency;
          depColors[i][j - 1] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i - 1, j] });
          arrows.push({ from: [i, j], to: [i, j - 1] });
          dp[i][j] = dp[i - 1][j] || dp[i][j - 1];

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : (v ? 'T' : 'F'),
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `p[${i}]='*', t[${j}]='${text[j - 1]}': skip *=${dp[i - 1][j] ? 'T' : 'F'} OR match char=${dp[i][j - 1] ? 'T' : 'F'}. Result: ${dp[i][j] ? 'T' : 'F'}.`,
          });
        } else if (pattern[i - 1] === '?' || pattern[i - 1] === text[j - 1]) {
          depColors[i - 1][j - 1] = COLORS.dependency;
          arrows.push({ from: [i, j], to: [i - 1, j - 1] });
          dp[i][j] = dp[i - 1][j - 1];

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : (v ? 'T' : 'F'),
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `p[${i}]='${pattern[i - 1]}' ${pattern[i - 1] === '?' ? 'matches any' : `== t[${j}]='${text[j - 1]}'`}: dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i][j] ? 'T' : 'F'}.`,
          });
        } else {
          dp[i][j] = false;

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : (v ? 'T' : 'F'),
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows: [],
            stepDescription: `p[${i}]='${pattern[i - 1]}' != t[${j}]='${text[j - 1]}': dp[${i}][${j}] = F.`,
          });
        }

        cellColors[i][j] = COLORS.computed;
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[n][m] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({
        value: v ? 'T' : 'F',
        color: finalColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [n, m],
      arrows: [],
      stepDescription: dp[n][m]
        ? `Pattern "${pattern}" MATCHES text "${text}".`
        : `Pattern "${pattern}" does NOT match text "${text}".`,
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
