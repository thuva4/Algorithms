import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class EggDropVisualization implements DPVisualizationEngine {
  name = 'Egg Drop Problem';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const eggs = input.values?.[0] ?? 3;
    const floors = input.target ?? 8;

    const rowLabels = Array.from({ length: eggs + 1 }, (_, i) => `${i} egg${i !== 1 ? 's' : ''}`);
    const colLabels = Array.from({ length: floors + 1 }, (_, j) => `${j}`);

    const dp: number[][] = Array.from({ length: eggs + 1 }, () => new Array(floors + 1).fill(0));
    const cellColors: string[][] = Array.from({ length: eggs + 1 }, () => new Array(floors + 1).fill(COLORS.empty));

    const INF = floors + 1;

    const makeTable = (): DPCell[][] =>
      dp.map((row, i) => row.map((v, j) => ({
        value: cellColors[i][j] === COLORS.empty ? '' : (v >= INF ? '\u221E' : v),
        color: cellColors[i][j],
      })));

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Egg Drop Problem: ${eggs} eggs, ${floors} floors. Find min trials in worst case.`,
    });

    // Base cases
    for (let i = 0; i <= eggs; i++) {
      dp[i][0] = 0;
      cellColors[i][0] = COLORS.computed;
      dp[i][1] = 1;
      if (floors >= 1) cellColors[i][1] = COLORS.computed;
    }
    for (let j = 0; j <= floors; j++) {
      dp[1][j] = j;
      cellColors[1][j] = COLORS.computed;
      dp[0][j] = INF;
      cellColors[0][j] = COLORS.computed;
    }
    dp[0][0] = 0;

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: 'Base cases: 1 egg needs j trials for j floors; 0 eggs = impossible; 0 floors = 0 trials.',
    });

    // Fill table
    for (let i = 2; i <= eggs; i++) {
      for (let j = 2; j <= floors; j++) {
        let minTrials = INF;
        let bestFloor = 1;

        const depColors = cellColors.map(row => [...row]);
        depColors[i][j] = COLORS.computing;

        // Try dropping from each floor x
        for (let x = 1; x <= j; x++) {
          const breaks = dp[i - 1][x - 1]; // egg breaks: i-1 eggs, x-1 floors below
          const survives = dp[i][j - x];     // egg survives: i eggs, j-x floors above
          const trials = 1 + Math.max(breaks, survives);
          if (trials < minTrials) {
            minTrials = trials;
            bestFloor = x;
          }
        }

        // Show the comparison step
        depColors[i - 1][bestFloor - 1] = COLORS.dependency;
        depColors[i][j - bestFloor] = COLORS.dependency;

        this.steps.push({
          table: dp.map((row, ri) => row.map((v, ci) => ({
            value: depColors[ri][ci] === COLORS.empty ? '' : (v >= INF ? '\u221E' : v),
            color: depColors[ri][ci],
          }))),
          rowLabels,
          colLabels,
          currentCell: [i, j],
          arrows: [
            { from: [i, j], to: [i - 1, bestFloor - 1] },
            { from: [i, j], to: [i, j - bestFloor] },
          ],
          stepDescription: `${i} eggs, ${j} floors: best drop floor=${bestFloor}, worst case = 1 + max(dp[${i - 1}][${bestFloor - 1}], dp[${i}][${j - bestFloor}]) = ${minTrials}.`,
        });

        dp[i][j] = minTrials;
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

    // Final
    const finalColors = cellColors.map(row => [...row]);
    finalColors[eggs][floors] = COLORS.optimal;

    this.steps.push({
      table: dp.map((row, ri) => row.map((v, ci) => ({
        value: v >= INF ? '\u221E' : v,
        color: finalColors[ri][ci],
      }))),
      rowLabels,
      colLabels,
      currentCell: [eggs, floors],
      arrows: [],
      stepDescription: `Minimum trials in worst case = ${dp[eggs][floors]} for ${eggs} eggs and ${floors} floors.`,
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
