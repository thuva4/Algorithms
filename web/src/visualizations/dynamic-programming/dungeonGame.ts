import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class DungeonGameVisualization implements DPVisualizationEngine {
  name = 'Dungeon Game';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Build a grid from values. Default 3x3 dungeon.
    const vals = input.values ?? [-2, -3, 3, -5, -10, 1, 10, 30, -5];
    const cols = input.target ?? 3;
    const rows = Math.ceil(vals.length / cols);
    const grid: number[][] = [];
    for (let i = 0; i < rows; i++) {
      const row: number[] = [];
      for (let j = 0; j < cols; j++) {
        row.push(vals[i * cols + j] ?? 0);
      }
      grid.push(row);
    }
    const m = grid.length;
    const n = grid[0].length;

    const rowLabels = Array.from({ length: m }, (_, i) => `R${i}`);
    const colLabels = Array.from({ length: n }, (_, j) => `C${j}`);

    // dp[i][j] = min health needed at (i,j) to reach princess alive
    const dp: number[][] = Array.from({ length: m }, () => new Array(n).fill(0));
    const cellColors: string[][] = Array.from({ length: m }, () => new Array(n).fill(COLORS.empty));

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : v,
        color: cellColors[i][j],
      })));

    // Show dungeon grid
    this.steps.push({
      table: grid.map((row) => row.map((v) => ({
        value: v,
        color: v < 0 ? '#fecaca' : v > 0 ? '#bbf7d0' : COLORS.empty,
      }))),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Dungeon Game: ${m}x${n} grid. Find min initial health to reach bottom-right. Negative = damage, positive = health orbs.`,
    });

    // Fill bottom-right to top-left
    dp[m - 1][n - 1] = Math.max(1 - grid[m - 1][n - 1], 1);
    cellColors[m - 1][n - 1] = COLORS.computed;

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [m - 1, n - 1],
      arrows: [],
      stepDescription: `Base: dp[${m - 1}][${n - 1}] = max(1 - (${grid[m - 1][n - 1]}), 1) = ${dp[m - 1][n - 1]}. Need at least 1 HP to survive.`,
    });

    // Fill last row
    for (let j = n - 2; j >= 0; j--) {
      dp[m - 1][j] = Math.max(dp[m - 1][j + 1] - grid[m - 1][j], 1);
      cellColors[m - 1][j] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [m - 1, j],
        arrows: [{ from: [m - 1, j], to: [m - 1, j + 1] }],
        stepDescription: `dp[${m - 1}][${j}] = max(${dp[m - 1][j + 1]} - (${grid[m - 1][j]}), 1) = ${dp[m - 1][j]}.`,
      });
    }

    // Fill last column
    for (let i = m - 2; i >= 0; i--) {
      dp[i][n - 1] = Math.max(dp[i + 1][n - 1] - grid[i][n - 1], 1);
      cellColors[i][n - 1] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [i, n - 1],
        arrows: [{ from: [i, n - 1], to: [i + 1, n - 1] }],
        stepDescription: `dp[${i}][${n - 1}] = max(${dp[i + 1][n - 1]} - (${grid[i][n - 1]}), 1) = ${dp[i][n - 1]}.`,
      });
    }

    // Fill rest
    for (let i = m - 2; i >= 0; i--) {
      for (let j = n - 2; j >= 0; j--) {
        const fromRight = dp[i][j + 1];
        const fromBelow = dp[i + 1][j];
        const minNext = Math.min(fromRight, fromBelow);

        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;
        depColors[i][j + 1] = COLORS.dependency;
        depColors[i + 1][j] = COLORS.dependency;

        this.steps.push({
          table: dp.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : v,
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [
            { from: [i, j], to: [i, j + 1] },
            { from: [i, j], to: [i + 1, j] },
          ],
          stepDescription: `dp[${i}][${j}]: min(right=${fromRight}, below=${fromBelow}) = ${minNext}, need max(${minNext} - (${grid[i][j]}), 1).`,
        });

        dp[i][j] = Math.max(minNext - grid[i][j], 1);
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

    // Traceback path
    const finalColors = cellColors.map(row => [...row]);
    let ci = 0, cj = 0;
    finalColors[0][0] = COLORS.optimal;
    while (ci < m - 1 || cj < n - 1) {
      if (ci === m - 1) {
        cj++;
      } else if (cj === n - 1) {
        ci++;
      } else if (dp[ci + 1][cj] <= dp[ci][cj + 1]) {
        ci++;
      } else {
        cj++;
      }
      finalColors[ci][cj] = COLORS.optimal;
    }

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({ value: v, color: finalColors[ri][ci] }))),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      arrows: [],
      stepDescription: `Minimum initial health = ${dp[0][0]}. Green path shows the optimal route.`,
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
