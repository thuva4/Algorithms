import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class WordBreakVisualization implements DPVisualizationEngine {
  name = 'Word Break';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text = input.text1 ?? 'leetcode';
    const dictStr = input.text2 ?? 'leet,code,lee,t';
    const dict = new Set(dictStr.split(',').map(w => w.trim()));
    const n = text.length;

    // dp[i] = true if s[0..i-1] can be segmented
    const dp: boolean[] = new Array(n + 1).fill(false);
    dp[0] = true;

    const rowLabels = ['char', 'dp'];
    const colLabels = ['""', ...text.split('')];
    const cellColors: string[][] = [
      [COLORS.empty, ...new Array(n).fill(COLORS.computed)],
      new Array(n + 1).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      [{ value: '""', color: COLORS.empty }, ...text.split('').map((c, j) => ({ value: c, color: cellColors[0][j + 1] }))],
      dp.map((v, j) => ({
        value: cellColors[1][j] === COLORS.empty ? '' : (v ? 'T' : 'F'),
        color: cellColors[1][j],
      })),
    ];

    cellColors[1][0] = COLORS.computed;

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Word Break: can "${text}" be segmented into words from {${[...dict].join(', ')}}?`,
    });

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [1, 0],
      arrows: [],
      stepDescription: 'Base case: dp[0] = T. Empty string is trivially segmented.',
    });

    for (let i = 1; i <= n; i++) {
      let foundWord = '';
      let foundJ = -1;

      for (let j = 0; j < i; j++) {
        const word = text.substring(j, i);
        if (dp[j] && dict.has(word)) {
          dp[i] = true;
          foundWord = word;
          foundJ = j;
          break;
        }
      }

      const depColors = cellColors.map(row => [...row]);
      depColors[1][i] = COLORS.computing;
      if (foundJ >= 0) depColors[1][foundJ] = COLORS.dependency;

      this.steps.push({
        table: [
          [{ value: '""', color: COLORS.empty }, ...text.split('').map((c, k) => ({ value: c, color: depColors[0][k + 1] }))],
          dp.map((v, j) => ({
            value: depColors[1][j] === COLORS.empty ? '' : (v ? 'T' : 'F'),
            color: depColors[1][j],
          })),
        ],
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: foundJ >= 0 ? [{ from: [1, i], to: [1, foundJ] }] : [],
        stepDescription: dp[i]
          ? `dp[${i}]: dp[${foundJ}]=T and "${foundWord}" is in dict. dp[${i}] = T.`
          : `dp[${i}]: no valid split found. dp[${i}] = F.`,
      });

      cellColors[1][i] = COLORS.computed;
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[1][n] = COLORS.optimal;

    this.steps.push({
      table: [
        [{ value: '""', color: COLORS.empty }, ...text.split('').map((c, j) => ({ value: c, color: finalColors[0][j + 1] }))],
        dp.map((v, j) => ({ value: v ? 'T' : 'F', color: finalColors[1][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [1, n],
      arrows: [],
      stepDescription: dp[n]
        ? `"${text}" CAN be segmented into dictionary words.`
        : `"${text}" CANNOT be segmented into dictionary words.`,
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
