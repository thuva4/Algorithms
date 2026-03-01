import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class KadanesVisualization implements DPVisualizationEngine {
  name = "Kadane's Algorithm";
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;

    const rowLabels = ['arr', 'maxHere', 'maxSoFar'];
    const colLabels = arr.map((_, i) => String(i));

    const maxHere: number[] = new Array(n).fill(0);
    const maxSoFar: number[] = new Array(n).fill(0);
    const cellColors: string[][] = [
      new Array(n).fill(COLORS.computed),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      arr.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      maxHere.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
      maxSoFar.map((v, j) => ({ value: cellColors[2][j] === COLORS.empty ? '' : v, color: cellColors[2][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Kadane's Algorithm: find maximum subarray sum in [${arr.join(', ')}].`,
    });

    // Process each element
    let globalBest = -Infinity;
    let bestStart = 0;
    let bestEnd = 0;
    let curStart = 0;

    for (let i = 0; i < n; i++) {
      const extend = (i > 0 ? maxHere[i - 1] : 0) + arr[i];
      const fresh = arr[i];

      const depColors = cellColors.map(row => [...row]);
      depColors[0][i] = COLORS.computing;
      depColors[1][i] = COLORS.computing;
      if (i > 0) depColors[1][i - 1] = COLORS.dependency;

      this.steps.push({
        table: [
          arr.map((v, j) => ({ value: v, color: depColors[0][j] })),
          maxHere.map((v, j) => ({ value: depColors[1][j] === COLORS.empty ? '' : v, color: depColors[1][j] })),
          maxSoFar.map((v, j) => ({ value: depColors[2][j] === COLORS.empty ? '' : v, color: depColors[2][j] })),
        ],
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: i > 0 ? [{ from: [1, i], to: [1, i - 1] }] : [],
        stepDescription: `Index ${i}: extend = ${i > 0 ? maxHere[i - 1] : 0} + ${arr[i]} = ${extend}, start fresh = ${fresh}. Choose ${extend >= fresh ? 'extend' : 'fresh'}.`,
      });

      if (extend >= fresh) {
        maxHere[i] = extend;
      } else {
        maxHere[i] = fresh;
        curStart = i;
      }

      if (maxHere[i] > globalBest) {
        globalBest = maxHere[i];
        bestStart = curStart;
        bestEnd = i;
      }
      maxSoFar[i] = globalBest;

      cellColors[1][i] = COLORS.computed;
      cellColors[2][i] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: [],
        stepDescription: `maxHere[${i}] = ${maxHere[i]}, maxSoFar[${i}] = ${maxSoFar[i]}.`,
      });
    }

    // Highlight optimal subarray
    const finalColors = cellColors.map(row => [...row]);
    for (let i = bestStart; i <= bestEnd; i++) {
      finalColors[0][i] = COLORS.optimal;
      finalColors[1][i] = COLORS.optimal;
    }
    finalColors[2][n - 1] = COLORS.optimal;

    this.steps.push({
      table: [
        arr.map((v, j) => ({ value: v, color: finalColors[0][j] })),
        maxHere.map((v, j) => ({ value: v, color: finalColors[1][j] })),
        maxSoFar.map((v, j) => ({ value: v, color: finalColors[2][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Maximum subarray sum = ${globalBest}, subarray indices [${bestStart}..${bestEnd}].`,
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
