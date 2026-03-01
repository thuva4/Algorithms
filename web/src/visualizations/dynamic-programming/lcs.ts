import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LCSVisualization implements DPVisualizationEngine {
  name = 'Longest Common Subsequence';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const text1 = input.text1 ?? 'ABCBDAB';
    const text2 = input.text2 ?? 'BDCAB';
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
      stepDescription: `Finding LCS of "${text1}" and "${text2}". Table size: ${m + 1} x ${n + 1}.`,
    });

    // Initialize first row and column
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
      stepDescription: 'Base cases: first row and column initialized to 0 (empty subsequence).',
    });

    // Fill table
    for (let i = 1; i <= m; i++) {
      for (let j = 1; j <= n; j++) {
        const arrows: { from: [number, number]; to: [number, number] }[] = [];

        if (text1[i - 1] === text2[j - 1]) {
          // Characters match - show diagonal dependency
          const depColors = cellColors.map((row) => [...row]);
          depColors[i - 1][j - 1] = COLORS.dependency;
          depColors[i][j] = COLORS.computing;

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
            stepDescription: `'${text1[i - 1]}' == '${text2[j - 1]}': dp[${i}][${j}] = dp[${i - 1}][${j - 1}] + 1 = ${dp[i - 1][j - 1]} + 1.`,
          });

          dp[i][j] = dp[i - 1][j - 1] + 1;
        } else {
          // Characters don't match - show top and left dependencies
          const depColors = cellColors.map((row) => [...row]);
          depColors[i - 1][j] = COLORS.dependency;
          depColors[i][j - 1] = COLORS.dependency;
          depColors[i][j] = COLORS.computing;

          arrows.push({ from: [i, j], to: [i - 1, j] });
          arrows.push({ from: [i, j], to: [i, j - 1] });

          this.steps.push({
            table: dp.map((row, ri) => row.map((v, ci) => ({
              value: depColors[ri][ci] === COLORS.empty ? '' : v,
              color: depColors[ri][ci],
            }))),
            rowLabels,
            colLabels,
            currentCell: [i, j],
            arrows,
            stepDescription: `'${text1[i - 1]}' != '${text2[j - 1]}': dp[${i}][${j}] = max(dp[${i - 1}][${j}], dp[${i}][${j - 1}]) = max(${dp[i - 1][j]}, ${dp[i][j - 1]}).`,
          });

          dp[i][j] = Math.max(dp[i - 1][j], dp[i][j - 1]);
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

    // Traceback to find optimal path
    const optimalCells: [number, number][] = [];
    let ti = m;
    let tj = n;
    while (ti > 0 && tj > 0) {
      if (text1[ti - 1] === text2[tj - 1]) {
        optimalCells.push([ti, tj]);
        ti--;
        tj--;
      } else if (dp[ti - 1][tj] >= dp[ti][tj - 1]) {
        ti--;
      } else {
        tj--;
      }
    }

    const finalColors = cellColors.map((row) => [...row]);
    for (const [oi, oj] of optimalCells) {
      finalColors[oi][oj] = COLORS.optimal;
    }

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [m, n],
      arrows: [],
      stepDescription: `LCS length = ${dp[m][n]}. Green cells show where characters matched on the optimal path.`,
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
