import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', found: '#22c55e', range: '#3b82f6', eliminated: '#94a3b8' };

export class BinarySearchVisualization implements AlgorithmVisualization {
  name = 'Binary Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data].sort((a, b) => a - b);
    const target = arr[Math.floor(Math.random() * arr.length)];
    let lo = 0, hi = arr.length - 1;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Binary search for ${target} in sorted array`,
    });

    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const highlights = [];
      for (let i = 0; i < arr.length; i++) {
        if (i < lo || i > hi) highlights.push({ index: i, color: COLORS.eliminated });
        else if (i === mid) highlights.push({ index: i, color: COLORS.current, label: `mid=${arr[mid]}` });
        else highlights.push({ index: i, color: COLORS.range });
      }

      this.steps.push({
        data: [...arr],
        highlights,
        comparisons: [[lo, hi]],
        swaps: [],
        sorted: [],
        stepDescription: `Range [${lo},${hi}], mid=${mid}: ${arr[mid]} vs ${target}`,
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
      } else if (arr[mid] < target) {
        lo = mid + 1;
      } else {
        hi = mid - 1;
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
