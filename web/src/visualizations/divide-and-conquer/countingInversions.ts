import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { comparing: '#eab308', inversion: '#ef4444', merged: '#22c55e', range: '#3b82f6' };

export class CountingInversionsVisualization implements AlgorithmVisualization {
  name = 'Counting Inversions';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Count inversions in [${arr.join(', ')}] using merge sort`,
    });

    const count = this.mergeSort(arr, 0, arr.length - 1);
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: arr.map((_, i) => i),
      stepDescription: `Total inversions: ${count}. Array is now sorted.`,
    });
    return this.steps[0];
  }

  private mergeSort(arr: number[], lo: number, hi: number): number {
    if (lo >= hi) return 0;
    const mid = Math.floor((lo + hi) / 2);
    let count = 0;
    count += this.mergeSort(arr, lo, mid);
    count += this.mergeSort(arr, mid + 1, hi);
    count += this.merge(arr, lo, mid, hi);
    return count;
  }

  private merge(arr: number[], lo: number, mid: number, hi: number): number {
    const left = arr.slice(lo, mid + 1);
    const right = arr.slice(mid + 1, hi + 1);
    let i = 0, j = 0, k = lo, inversions = 0;

    this.steps.push({
      data: [...arr],
      highlights: [
        ...Array.from({ length: mid - lo + 1 }, (_, x) => ({ index: lo + x, color: COLORS.range, label: 'L' })),
        ...Array.from({ length: hi - mid }, (_, x) => ({ index: mid + 1 + x, color: COLORS.range, label: 'R' })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Merge [${lo}-${mid}] and [${mid + 1}-${hi}]`,
    });

    while (i < left.length && j < right.length) {
      if (left[i] <= right[j]) {
        arr[k] = left[i];
        i++;
      } else {
        const inv = left.length - i;
        inversions += inv;
        this.steps.push({
          data: [...arr],
          highlights: [{ index: k, color: COLORS.inversion, label: `+${inv} inv` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${right[j]} < ${left[i]}: ${inv} inversion(s) found (total in merge: ${inversions})`,
        });
        arr[k] = right[j];
        j++;
      }
      k++;
    }
    while (i < left.length) { arr[k++] = left[i++]; }
    while (j < right.length) { arr[k++] = right[j++]; }

    return inversions;
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
