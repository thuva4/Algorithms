import type { DPVisualizationEngine, DPVisualizationState, DPCell } from '../types';

const COLORS = {
  empty: '#f3f4f6',
  computing: '#fbbf24',
  computed: '#60a5fa',
  optimal: '#34d399',
  dependency: '#f87171',
};

export class LongestSubsetZeroSumVisualization implements DPVisualizationEngine {
  name = 'Longest Subset with Zero Sum';
  visualizationType = 'dp' as const;

  private steps: DPVisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(input: { values?: number[]; text1?: string; text2?: string; target?: number; weights?: number[] }): DPVisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = input.values ?? [1, 5, 8, 9, 10, 17, 17, 20];
    const n = arr.length;

    // Use prefix-sum approach to find longest subarray with zero sum
    // Track prefix sums and first occurrence via a DP-style table
    const prefixSums: number[] = new Array(n + 1).fill(0);
    for (let i = 0; i < n; i++) {
      prefixSums[i + 1] = prefixSums[i] + arr[i];
    }

    const rowLabels = ['arr', 'prefix', 'length'];
    const colLabels = Array.from({ length: n + 1 }, (_, i) => i === 0 ? 'init' : String(i - 1));

    const lengths: (number | string)[] = new Array(n + 1).fill('');
    const cellColors: string[][] = [
      ['', ...arr.map(() => COLORS.computed)] as unknown as string[],
      new Array(n + 1).fill(COLORS.empty),
      new Array(n + 1).fill(COLORS.empty),
    ];

    const makeTable = (): DPCell[][] => [
      [{ value: '-', color: COLORS.empty }, ...arr.map((v) => ({ value: v, color: COLORS.computed }))],
      prefixSums.map((v, j) => ({
        value: cellColors[1][j] === COLORS.empty ? '' : v,
        color: cellColors[1][j],
      })),
      lengths.map((v, j) => ({
        value: cellColors[2][j] === COLORS.empty ? '' : v,
        color: cellColors[2][j],
      })),
    ];

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: `Longest subarray with zero sum in [${arr.join(', ')}]. Use prefix sums to detect matching sums.`,
    });

    // Compute prefix sums step by step
    const seen: Map<number, number> = new Map();
    seen.set(0, 0);
    cellColors[1][0] = COLORS.computed;
    lengths[0] = 0;
    cellColors[2][0] = COLORS.computed;

    this.steps.push({
      table: makeTable(),
      rowLabels,
      colLabels,
      currentCell: [1, 0],
      arrows: [],
      stepDescription: 'Initialize: prefix[0] = 0. Record that sum 0 first seen at index 0.',
    });

    let maxLen = 0;
    let bestStart = 0;
    let bestEnd = -1;

    for (let i = 1; i <= n; i++) {
      cellColors[1][i] = COLORS.computed;

      const curSum = prefixSums[i];

      if (seen.has(curSum)) {
        const prevIdx = seen.get(curSum)!;
        const subLen = i - prevIdx;
        lengths[i] = subLen;
        cellColors[2][i] = COLORS.computed;

        const depColors = cellColors.map(row => [...row]);
        depColors[1][i] = COLORS.computing;
        depColors[1][prevIdx] = COLORS.dependency;

        this.steps.push({
          table: [
            [{ value: '-', color: COLORS.empty }, ...arr.map((v) => ({ value: v, color: COLORS.computed }))],
            prefixSums.map((v, j) => ({
              value: depColors[1][j] === COLORS.empty ? '' : v,
              color: depColors[1][j],
            })),
            lengths.map((v, j) => ({
              value: depColors[2][j] === COLORS.empty ? '' : v,
              color: depColors[2][j],
            })),
          ],
          rowLabels,
          colLabels,
          currentCell: [1, i],
          arrows: [{ from: [1, i], to: [1, prevIdx] }],
          stepDescription: `prefix[${i}] = ${curSum}. Same sum at index ${prevIdx}! Subarray [${prevIdx}..${i - 1}] has zero sum, length = ${subLen}.`,
        });

        if (subLen > maxLen) {
          maxLen = subLen;
          bestStart = prevIdx;
          bestEnd = i - 1;
        }
      } else {
        seen.set(curSum, i);
        lengths[i] = 0;
        cellColors[2][i] = COLORS.computed;

        this.steps.push({
          table: makeTable(),
          rowLabels,
          colLabels,
          currentCell: [1, i],
          arrows: [],
          stepDescription: `prefix[${i}] = ${curSum}. New sum, record first occurrence at index ${i}.`,
        });
      }
    }

    // Final
    const finalColors = cellColors.map(row => [...row]);
    if (maxLen > 0) {
      for (let i = bestStart; i <= bestEnd; i++) {
        finalColors[0][i + 1] = COLORS.optimal;
      }
    }

    this.steps.push({
      table: [
        [{ value: '-', color: COLORS.empty }, ...arr.map((v, i) => ({ value: v, color: finalColors[0][i + 1] }))],
        prefixSums.map((v, j) => ({ value: v, color: finalColors[1][j] })),
        lengths.map((v, j) => ({ value: v, color: finalColors[2][j] })),
      ],
      rowLabels,
      colLabels,
      currentCell: null,
      arrows: [],
      stepDescription: maxLen > 0
        ? `Longest zero-sum subarray has length ${maxLen}, indices [${bestStart}..${bestEnd}].`
        : 'No zero-sum subarray found.',
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
