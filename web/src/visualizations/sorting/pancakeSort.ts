import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class PancakeSortVisualization implements AlgorithmVisualization {
  name = 'Pancake Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    function flip(a: number[], k: number): void {
      let left = 0;
      let right = k;
      while (left < right) {
        const temp = a[left];
        a[left] = a[right];
        a[right] = temp;
        left++;
        right--;
      }
    }

    for (let size = n - 1; size > 0; size--) {
      // Find the index of the maximum element in arr[0..size]
      let maxIdx = 0;
      for (let i = 1; i <= size; i++) {
        if (arr[i] > arr[maxIdx]) {
          maxIdx = i;
        }
      }

      // Highlight the search for maximum
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: maxIdx, color: COLORS.current, label: `max=${arr[maxIdx]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Found maximum ${arr[maxIdx]} at position ${maxIdx} in range [0..${size}]`,
      });

      if (maxIdx === size) {
        // Already in place
        sorted.push(size);
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: size, color: COLORS.sorted, label: `${arr[size]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `${arr[size]} is already at position ${size}, no flip needed`,
        });
        continue;
      }

      // First flip: bring max to front
      if (maxIdx > 0) {
        this.steps.push({
          data: [...arr],
          highlights: Array.from({ length: maxIdx + 1 }, (_, i) => ({
            index: i,
            color: COLORS.swapping,
          })),
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Flip [0..${maxIdx}]: bringing ${arr[maxIdx]} to the front`,
        });

        flip(arr, maxIdx);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: 0, color: COLORS.current, label: `${arr[0]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `After flip [0..${maxIdx}]: ${arr[0]} is now at front`,
        });
      }

      // Second flip: bring max to its final position
      this.steps.push({
        data: [...arr],
        highlights: Array.from({ length: size + 1 }, (_, i) => ({
          index: i,
          color: COLORS.swapping,
        })),
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Flip [0..${size}]: moving ${arr[0]} to position ${size}`,
      });

      flip(arr, size);
      sorted.push(size);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: size, color: COLORS.sorted, label: `${arr[size]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `${arr[size]} is now in its final position at index ${size}`,
      });
    }

    // Mark position 0 as sorted
    if (!sorted.includes(0)) sorted.push(0);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: 'Array is fully sorted',
    });

    return this.steps[0];
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
