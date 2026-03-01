import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', found: '#22c55e', range: '#3b82f6', eliminated: '#94a3b8' };

export class ModifiedBinarySearchVisualization implements AlgorithmVisualization {
  name = 'Modified Binary Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Search in a rotated sorted array
    const sorted = [...data].sort((a, b) => a - b);
    // Rotate array
    const pivot = Math.floor(sorted.length / 3);
    const arr = [...sorted.slice(pivot), ...sorted.slice(0, pivot)];
    const n = arr.length;
    const target = arr[Math.floor(Math.random() * n)];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Modified binary search for ${target} in rotated sorted array`,
    });

    let lo = 0, hi = n - 1;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: lo, color: COLORS.range, label: 'lo' },
          { index: mid, color: COLORS.current, label: `mid=${arr[mid]}` },
          { index: hi, color: COLORS.range, label: 'hi' },
        ],
        comparisons: [[lo, hi]],
        swaps: [],
        sorted: [],
        stepDescription: `lo=${lo}, mid=${mid}(${arr[mid]}), hi=${hi}: checking which half is sorted`,
      });

      if (arr[mid] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: mid, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [mid],
          stepDescription: `Found ${target} at index ${mid}!`,
        });
        return this.steps[0];
      }

      if (arr[lo] <= arr[mid]) {
        if (target >= arr[lo] && target < arr[mid]) {
          hi = mid - 1;
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Left half [${lo},${mid}] is sorted. Target in left half, narrow right.`,
          });
        } else {
          lo = mid + 1;
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Left half [${lo - mid - 1},${mid}] is sorted. Target not in left, search right.`,
          });
        }
      } else {
        if (target > arr[mid] && target <= arr[hi]) {
          lo = mid + 1;
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Right half [${mid},${hi}] is sorted. Target in right half, narrow left.`,
          });
        } else {
          hi = mid - 1;
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Right half [${mid},${hi + 1}] is sorted. Target not in right, search left.`,
          });
        }
      }
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Target ${target} not found`,
    });
    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
