import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  sorted: '#22c55e',
  current: '#3b82f6',
  subarray: '#8b5cf6',
};

export class MergeSortVisualization implements AlgorithmVisualization {
  name = 'Merge Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;

    // Record initial state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    // Run merge sort and record all steps
    this.mergeSort(arr, 0, n - 1);

    // Final sorted state
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: allIndices,
      stepDescription: 'Array is fully sorted',
    });

    return this.steps[0];
  }

  private mergeSort(arr: number[], left: number, right: number): void {
    if (left >= right) return;

    const mid = Math.floor((left + right) / 2);

    // Show the division step
    const leftHighlights = [];
    for (let i = left; i <= mid; i++) {
      leftHighlights.push({ index: i, color: COLORS.current, label: i === left ? 'L' : undefined });
    }
    for (let i = mid + 1; i <= right; i++) {
      leftHighlights.push({ index: i, color: COLORS.subarray, label: i === mid + 1 ? 'R' : undefined });
    }

    this.steps.push({
      data: [...arr],
      highlights: leftHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Dividing subarray [${left}..${right}] into [${left}..${mid}] and [${mid + 1}..${right}]`,
    });

    this.mergeSort(arr, left, mid);
    this.mergeSort(arr, mid + 1, right);
    this.merge(arr, left, mid, right);
  }

  private merge(arr: number[], left: number, mid: number, right: number): void {
    const leftArr = arr.slice(left, mid + 1);
    const rightArr = arr.slice(mid + 1, right + 1);

    // Show the merge starting
    const mergeHighlights = [];
    for (let i = left; i <= mid; i++) {
      mergeHighlights.push({ index: i, color: COLORS.current });
    }
    for (let i = mid + 1; i <= right; i++) {
      mergeHighlights.push({ index: i, color: COLORS.subarray });
    }

    this.steps.push({
      data: [...arr],
      highlights: mergeHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Merging subarrays [${left}..${mid}] (${leftArr.join(', ')}) and [${mid + 1}..${right}] (${rightArr.join(', ')})`,
    });

    let i = 0;
    let j = 0;
    let k = left;

    while (i < leftArr.length && j < rightArr.length) {
      // Comparison step
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: left + i, color: COLORS.comparing, label: `${leftArr[i]}` },
          { index: mid + 1 + j, color: COLORS.comparing, label: `${rightArr[j]}` },
        ],
        comparisons: [[left + i, mid + 1 + j]],
        swaps: [],
        sorted: [],
        stepDescription: `Comparing ${leftArr[i]} (left subarray) with ${rightArr[j]} (right subarray)`,
      });

      if (leftArr[i] <= rightArr[j]) {
        arr[k] = leftArr[i];
        i++;
      } else {
        arr[k] = rightArr[j];
        j++;
      }

      // Placement step
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: k, color: COLORS.sorted, label: `${arr[k]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Placed ${arr[k]} at position ${k}`,
      });

      k++;
    }

    // Copy remaining elements from left subarray
    while (i < leftArr.length) {
      arr[k] = leftArr[i];

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: k, color: COLORS.sorted, label: `${arr[k]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Placed remaining element ${arr[k]} from left subarray at position ${k}`,
      });

      i++;
      k++;
    }

    // Copy remaining elements from right subarray
    while (j < rightArr.length) {
      arr[k] = rightArr[j];

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: k, color: COLORS.sorted, label: `${arr[k]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Placed remaining element ${arr[k]} from right subarray at position ${k}`,
      });

      j++;
      k++;
    }

    // Show merged result
    const mergedHighlights = [];
    for (let idx = left; idx <= right; idx++) {
      mergedHighlights.push({ index: idx, color: COLORS.sorted, label: `${arr[idx]}` });
    }

    this.steps.push({
      data: [...arr],
      highlights: mergedHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Merged subarray [${left}..${right}]: ${arr.slice(left, right + 1).join(', ')}`,
    });
  }

  step(): VisualizationState | null {
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
