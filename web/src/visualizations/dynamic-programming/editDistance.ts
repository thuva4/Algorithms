import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class EditDistanceVisualization implements DPVisualizationEngine {
  name = 'Edit Distance (Levenshtein)';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text1 = input.text1 ?? 'kitten';
    const text2 = input.text2 ?? 'sitting';
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
      stepDescription: `Computing edit distance between "${text1}" and "${text2}".`,
    });

    // Initialize first row
    for (let j = 0; j <= n; j++) {
      dp[0][j] = j;
      cellColors[0][j] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: first row = cost of inserting characters (0, 1, 2, ...).',
    });

    // Initialize first column
    for (let i = 0; i <= m; i++) {
      dp[i][0] = i;
      cellColors[i][0] = COLORS.computed;
    }
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base case: first column = cost of deleting characters (0, 1, 2, ...).',
    });

    // Fill table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const depColors = cellColors.map((row) => [...row]);
        depColors[i][j] = COLORS.computing;
        depColors[i - 1][j - 1] = COLORS.dependency;
        depColors[i - 1][j] = COLORS.dependency;
        depColors[i][j - 1] = COLORS.dependency;

        const arrows: { from: [number, number]; to: [number, number] }[] = [
          { from: [i, j], to: [i - 1, j - 1] },
          { from: [i, j], to: [i - 1, j] },
          { from: [i, j], to: [i, j - 1] },
        ];

        if (text1[i - 1] === text2[j - 1]) {
          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `'${text1[i - 1]}' == '${text2[j - 1]}': no edit needed. dp[${i}][${j}] = dp[${i - 1}][${j - 1}] = ${dp[i - 1][j - 1]}.`,
          });
          dp[i][j] = dp[i - 1][j - 1];
        } else {
          const replace = dp[i - 1][j - 1] + 1;
          const del = dp[i - 1][j] + 1;
          const insert = dp[i][j - 1] + 1;
          const minOp = Math.min(replace, del, insert);
          const opName = minOp === replace ? 'replace' : minOp === del ? 'delete' : 'insert';

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `'${text1[i - 1]}' != '${text2[j - 1]}': min(replace=${replace}, delete=${del}, insert=${insert}) = ${minOp} (${opName}).`,
          });
          dp[i][j] = minOp;
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

    // Traceback for optimal path
    const finalColors = cellColors.map((row) => [...row]);
    let ti = m;
    let tj = n;
    finalColors[ti][tj] = COLORS.optimal;
    while (ti > 0 || tj > 0) {
      if (ti > 0 && tj > 0 && text1[ti - 1] === text2[tj - 1]) {
        ti--;
        tj--;
      } else if (ti > 0 && tj > 0 && dp[ti][tj] === dp[ti - 1][tj - 1] + 1) {
        ti--;
        tj--;
      } else if (ti > 0 && dp[ti][tj] === dp[ti - 1][tj] + 1) {
        ti--;
      } else {
        tj--;
      }
      finalColors[ti][tj] = COLORS.optimal;
    }

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [m, n],
      arrows: [],
      stepDescription: `Edit distance = ${dp[m][n]}. Green cells show the optimal alignment path.`,
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
