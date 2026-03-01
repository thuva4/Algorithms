import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class DynamicProgrammingVisualization implements DPVisualizationEngine {
  name = 'Max 1D Range Sum';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Max 1D Range Sum: find max sum of contiguous subarray
    // Uses prefix sums DP approach
    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;

    const rowLabels = ['arr', 'prefix', 'maxEnd', 'maxSoFar'];
    const colLabels = arr.map((_, i) => String(i));

    const prefix: number[] = new Array(n).fill(0);
    const maxEnd: number[] = new Array(n).fill(0);
    const maxSoFar: number[] = new Array(n).fill(0);
    const cellColors: string[][] = [
      new Array(n).fill(COLORS.computed),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      arr.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      prefix.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
      maxEnd.map((v, j) => ({ value: cellColors[2][j] === COLORS.empty ? '' : v, color: cellColors[2][j] })),
      maxSoFar.map((v, j) => ({ value: cellColors[3][j] === COLORS.empty ? '' : v, color: cellColors[3][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Max 1D Range Sum DP: find maximum contiguous subarray sum in [${arr.join(', ')}].`,
    });

    // Compute prefix sums
    for (let i = 0; i < n; i++) {
      prefix[i] = (i > 0 ? prefix[i - 1] : 0) + arr[i];
      cellColors[1][i] = COLORS.computed;
    }

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Prefix sums computed: [${prefix.join(', ')}].`,
    });

    // DP: maxEnd[i] = max subarray ending at i
    let globalMax = -Infinity;
    let bestEnd = 0;
    let bestStart = 0;
    let curStart = 0;

    for (let i = 0; i < n; i++) {
      const extend = (i > 0 ? maxEnd[i - 1] : 0) + arr[i];
      const fresh = arr[i];

      if (extend >= fresh) {
        maxEnd[i] = extend;
      } else {
        maxEnd[i] = fresh;
        curStart = i;
      }

      if (maxEnd[i] > globalMax) {
        globalMax = maxEnd[i];
        bestEnd = i;
        bestStart = curStart;
      }
      maxSoFar[i] = globalMax;

      cellColors[2][i] = COLORS.computed;
      cellColors[3][i] = COLORS.computed;

      const depColors = cellColors.map(row => [...row]);
      depColors[2][i] = COLORS.computing;
      if (i > 0) depColors[2][i - 1] = COLORS.dependency;

      this.steps.push({
        table: [
          arr.map((v, j) => ({ value: v, color: depColors[0][j] })),
          prefix.map((v, j) => ({ value: v, color: depColors[1][j] })),
          maxEnd.map((v, j) => ({
            value: depColors[2][j] === COLORS.empty ? '' : v,
            color: depColors[2][j],
          })),
          maxSoFar.map((v, j) => ({
            value: depColors[3][j] === COLORS.empty ? '' : v,
            color: depColors[3][j],
          })),
        ],
        rowLabels,
        colLabels,
        currentCell: [2, i],
        arrows: i > 0 ? [{ from: [2, i], to: [2, i - 1] }] : [],
        stepDescription: `Index ${i}: max(extend=${extend}, fresh=${fresh}) = ${maxEnd[i]}. Global max = ${maxSoFar[i]}.`,
      });
    }

    // Highlight optimal subarray
    const finalColors = cellColors.map(row => [...row]);
    for (let i = bestStart; i <= bestEnd; i++) {
      finalColors[0][i] = COLORS.optimal;
    }
    finalColors[3][n - 1] = COLORS.optimal;

    this.steps.push({
      table: [
        arr.map((v, j) => ({ value: v, color: finalColors[0][j] })),
        prefix.map((v, j) => ({ value: v, color: finalColors[1][j] })),
        maxEnd.map((v, j) => ({ value: v, color: finalColors[2][j] })),
        maxSoFar.map((v, j) => ({ value: v, color: finalColors[3][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Maximum 1D range sum = ${globalMax}, subarray [${bestStart}..${bestEnd}]. Green cells show the optimal subarray.`,
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
