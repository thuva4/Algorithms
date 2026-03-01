import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LISVisualization implements DPVisualizationEngine {
  name = 'Longest Increasing Subsequence';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const values = input.values ?? [10, 9, 2, 5, 3, 7, 101, 18];
    const n = values.length;

    const colLabels = values.map(String);
    const rowLabels = ['LIS'];

    const dp: number[] = new Array(n).fill(1);
    const cellColors: string[] = new Array(n).fill(COLORS.empty);

    const makeTable = (): DPCell[][] =>
      [dp.map((v, i) => ({ value: cellColors[i] === COLORS.empty ? '' : v, color: cellColors[i] }))];

    // Initial state
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Finding the Longest Increasing Subsequence in [${values.join(', ')}].`,
    });

    // Each element starts with LIS of 1 (itself)
    for (let i = 0; i < n; i++) {
      cellColors[i] = COLORS.computing;
      dp[i] = 1;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [0, i],
        arrows: [],
        stepDescription: `Initialize dp[${i}] = 1 (element ${values[i]} alone).`,
      });

      // Check all previous elements
      for (let j = 0; j < i; j++) {
        if (values[j] < values[i]) {
          const depColors = [...cellColors];
          depColors[j] = COLORS.dependency;
          depColors[i] = COLORS.computing;

          this.steps.push({
            table: [dp.map((v, k) => ({ value: depColors[k] === COLORS.empty ? '' : v, color: depColors[k] }))],
            rowLabels,
            colLabels,
            currentCell: [0, i],
            arrows: [{ from: [0, i], to: [0, j] }],
            stepDescription: `${values[j]} < ${values[i]}: dp[${i}] = max(dp[${i}], dp[${j}] + 1) = max(${dp[i]}, ${dp[j]} + 1) = ${Math.max(dp[i], dp[j] + 1)}.`,
          });

          dp[i] = Math.max(dp[i], dp[j] + 1);
        }
      }

      cellColors[i] = COLORS.computed;
      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [0, i],
        arrows: [],
        stepDescription: `dp[${i}] = ${dp[i]} (LIS ending at ${values[i]} has length ${dp[i]}).`,
      });
    }

    // Find the LIS and mark optimal path
    const maxLen = Math.max(...dp);
    const finalColors = [...cellColors];

    // Traceback: find one LIS
    const lisIndices: number[] = [];
    let remaining = maxLen;
    for (let i = n - 1; i >= 0 && remaining > 0; i--) {
      if (dp[i] === remaining) {
        if (lisIndices.length === 0 || values[i] < values[lisIndices[lisIndices.length - 1]]) {
          lisIndices.push(i);
          remaining--;
        }
      }
    }

    for (const idx of lisIndices) {
      finalColors[idx] = COLORS.optimal;
    }

    this.steps.push({
      table: [dp.map((v, i) => ({ value: v, color: finalColors[i] }))],
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `LIS length = ${maxLen}. Green cells show one possible longest increasing subsequence.`,
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
