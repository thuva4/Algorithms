import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class RodCuttingVisualization implements DPVisualizationEngine {
  name = 'Rod Cutting';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const prices = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = input.target ?? prices.length;
    const len = Math.min(n, prices.length);

    const rowLabels = ['dp'];
    const colLabels = Array.from({ length: len + 1 }, (_, i) => String(i));

    const dp: number[] = new Array(len + 1).fill(0);
    const cellColors: string[] = new Array(len + 1).fill(COLORS.empty);

    const makeTable = (): DPCell[][] => [
      dp.map((v, j) => ({ value: cellColors[j] === COLORS.empty ? '' : v, color: cellColors[j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Rod Cutting: prices = [${prices.slice(0, len).join(', ')}], rod length = ${len}. Maximize revenue.`,
    });

    cellColors[0] = COLORS.computed;
    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [0, 0],
      arrows: [],
      stepDescription: 'Base case: dp[0] = 0. A rod of length 0 yields no revenue.',
    });

    for (let i = 1; i <= len; i++) {
      let bestVal = -1;
      let bestCut = 0;

      for (let j = 0; j < i; j++) {
        const candidate = prices[j] + dp[i - j - 1];

        const depColors = [...cellColors];
        depColors[i] = COLORS.computing;
        depColors[i - j - 1] = COLORS.dependency;

        this.steps.push({
          table: [dp.map((v, k) => ({
            value: depColors[k] === COLORS.empty ? '' : (k === i ? (bestVal >= 0 ? bestVal : '') : v),
            color: depColors[k],
          }))],
          rowLabels,
          colLabels,
          currentCell: [0, i],
          arrows: [{ from: [0, i], to: [0, i - j - 1] }],
          stepDescription: `Length ${i}, cut=${j + 1}: price[${j + 1}]=${prices[j]} + dp[${i - j - 1}]=${dp[i - j - 1]} = ${candidate}.`,
        });

        if (candidate > bestVal) {
          bestVal = candidate;
          bestCut = j + 1;
        }
      }

      dp[i] = bestVal;
      cellColors[i] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [0, i],
        arrows: [],
        stepDescription: `dp[${i}] = ${dp[i]} (best first cut = ${bestCut}).`,
      });
    }

    // Final result
    const finalColors = [...cellColors];
    finalColors[len] = COLORS.optimal;
    // Traceback
    let rem = len;
    while (rem > 0) {
      let bestCut = 1;
      for (let j = 0; j < rem; j++) {
        if (prices[j] + dp[rem - j - 1] === dp[rem]) {
          bestCut = j + 1;
          break;
        }
      }
      finalColors[rem] = COLORS.optimal;
      rem -= bestCut;
    }
    finalColors[0] = COLORS.optimal;

    this.steps.push({
      table: [dp.map((v, j) => ({ value: v, color: finalColors[j] }))],
      rowLabels,
      colLabels,
      currentCell: [0, len],
      arrows: [],
      stepDescription: `Maximum revenue = ${dp[len]}. Green cells show the traceback path.`,
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
