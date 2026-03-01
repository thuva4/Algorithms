import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { left: '#3b82f6', right: '#8b5cf6', cross: '#eab308', best: '#22c55e' };

export class MaximumSubarrayDivideConquerVisualization implements AlgorithmVisualization {
  name = 'Maximum Subarray (D&C)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = data.map(v => v - Math.floor(Math.max(...data) / 2)); // ensure some negatives

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Find maximum subarray using divide and conquer`,
    });

    const result = this.maxSubarray(arr, 0, arr.length - 1);
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Maximum subarray sum = ${result}`,
    });
    return this.steps[0];
  }

  private maxSubarray(arr: number[], lo: number, hi: number): number {
    if (lo === hi) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: lo, color: COLORS.best, label: `${arr[lo]}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Base case: element at ${lo} = ${arr[lo]}`,
      });
      return arr[lo];
    }

    const mid = Math.floor((lo + hi) / 2);

    this.steps.push({
      data: [...arr],
      highlights: [
        ...Array.from({ length: mid - lo + 1 }, (_, i) => ({ index: lo + i, color: COLORS.left })),
        ...Array.from({ length: hi - mid }, (_, i) => ({ index: mid + 1 + i, color: COLORS.right })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Divide [${lo}-${hi}] at mid=${mid}`,
    });

    const leftMax = this.maxSubarray(arr, lo, mid);
    const rightMax = this.maxSubarray(arr, mid + 1, hi);

    // Cross sum
    let leftSum = -Infinity, sum = 0;
    for (let i = mid; i >= lo; i--) {
      sum += arr[i];
      if (sum > leftSum) leftSum = sum;
    }
    let rightSum = -Infinity;
    sum = 0;
    for (let i = mid + 1; i <= hi; i++) {
      sum += arr[i];
      if (sum > rightSum) rightSum = sum;
    }
    const crossMax = leftSum + rightSum;

    this.steps.push({
      data: [...arr],
      highlights: Array.from({ length: hi - lo + 1 }, (_, i) => ({
        index: lo + i,
        color: COLORS.cross,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `[${lo}-${hi}]: left=${leftMax}, right=${rightMax}, cross=${crossMax}`,
    });

    return Math.max(leftMax, rightMax, crossMax);
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
