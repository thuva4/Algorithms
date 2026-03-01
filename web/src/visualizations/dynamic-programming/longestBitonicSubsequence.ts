import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LongestBitonicSubsequenceVisualization implements DPVisualizationEngine {
  name = 'Longest Bitonic Subsequence';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;

    const rowLabels = ['arr', 'LIS', 'LDS', 'bitonic'];
    const colLabels = arr.map((_, i) => String(i));

    const lis: number[] = new Array(n).fill(1);
    const lds: number[] = new Array(n).fill(1);
    const bitonic: number[] = new Array(n).fill(0);
    const cellColors: string[][] = [
      new Array(n).fill(COLORS.computed),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
      new Array(n).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      arr.map((v, j) => ({ value: v, color: cellColors[0][j] })),
      lis.map((v, j) => ({ value: cellColors[1][j] === COLORS.empty ? '' : v, color: cellColors[1][j] })),
      lds.map((v, j) => ({ value: cellColors[2][j] === COLORS.empty ? '' : v, color: cellColors[2][j] })),
      bitonic.map((v, j) => ({ value: cellColors[3][j] === COLORS.empty ? '' : v, color: cellColors[3][j] })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Longest Bitonic Subsequence of [${arr.join(', ')}]. Compute LIS (left-to-right), LDS (right-to-left), then combine.`,
    });

    // Compute LIS
    for (let i = 0; i < n; i++) {
      for (let j = 0; j < i; j++) {
        if (arr[j] < arr[i] && lis[j] + 1 > lis[i]) {
          lis[i] = lis[j] + 1;
        }
      }
      cellColors[1][i] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [1, i],
        arrows: [],
        stepDescription: `LIS[${i}] = ${lis[i]}. Longest increasing subsequence ending at index ${i}.`,
      });
    }

    // Compute LDS (from right)
    for (let i = n - 1; i >= 0; i--) {
      for (let j = n - 1; j > i; j--) {
        if (arr[j] < arr[i] && lds[j] + 1 > lds[i]) {
          lds[i] = lds[j] + 1;
        }
      }
      cellColors[2][i] = COLORS.computed;

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [2, i],
        arrows: [],
        stepDescription: `LDS[${i}] = ${lds[i]}. Longest decreasing subsequence starting at index ${i}.`,
      });
    }

    // Compute bitonic = LIS[i] + LDS[i] - 1
    let maxLen = 0;
    let maxIdx = 0;
    for (let i = 0; i < n; i++) {
      bitonic[i] = lis[i] + lds[i] - 1;
      cellColors[3][i] = COLORS.computed;
      if (bitonic[i] > maxLen) {
        maxLen = bitonic[i];
        maxIdx = i;
      }

      this.steps.push({
        table: makeTable(),
        rowLabels,
        colLabels,
        currentCell: [3, i],
        arrows: [{ from: [3, i], to: [1, i] }, { from: [3, i], to: [2, i] }],
        stepDescription: `bitonic[${i}] = LIS[${i}] + LDS[${i}] - 1 = ${lis[i]} + ${lds[i]} - 1 = ${bitonic[i]}.`,
      });
    }

    // Highlight optimal
    const finalColors = cellColors.map(row => [...row]);
    finalColors[0][maxIdx] = COLORS.optimal;
    finalColors[3][maxIdx] = COLORS.optimal;

    this.steps.push({
      table: [
        arr.map((v, j) => ({ value: v, color: finalColors[0][j] })),
        lis.map((v, j) => ({ value: v, color: finalColors[1][j] })),
        lds.map((v, j) => ({ value: v, color: finalColors[2][j] })),
        bitonic.map((v, j) => ({ value: v, color: finalColors[3][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: [3, maxIdx],
      arrows: [],
      stepDescription: `Longest Bitonic Subsequence length = ${maxLen}, peak at index ${maxIdx} (value ${arr[maxIdx]}).`,
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
