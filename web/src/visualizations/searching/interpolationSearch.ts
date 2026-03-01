import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { probe: '#eab308', found: '#22c55e', range: '#3b82f6', eliminated: '#94a3b8' };

export class InterpolationSearchVisualization implements AlgorithmVisualization {
  name = 'Interpolation Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data].sort((a, b) => a - b);
    const n = arr.length;
    const target = arr[Math.floor(Math.random() * n)];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Interpolation search for ${target} in uniformly distributed sorted array`,
    });

    let lo = 0, hi = n - 1;
    let iterations = 0;
    while (lo <= hi && target >= arr[lo] && target <= arr[hi] && iterations < n) {
      iterations++;
      let pos: number;
      if (arr[hi] === arr[lo]) {
        pos = lo;
      } else {
        pos = lo + Math.floor(((target - arr[lo]) * (hi - lo)) / (arr[hi] - arr[lo]));
      }
      pos = Math.max(lo, Math.min(hi, pos));

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: lo, color: COLORS.range, label: 'lo' },
          { index: hi, color: COLORS.range, label: 'hi' },
          { index: pos, color: COLORS.probe, label: `probe=${arr[pos]}` },
        ],
        comparisons: [[lo, hi]],
        swaps: [],
        sorted: [],
        stepDescription: `Interpolated position ${pos}: ${arr[pos]} vs ${target}`,
      });

      if (arr[pos] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: pos, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [pos],
          stepDescription: `Found ${target} at index ${pos}!`,
        });
        return this.steps[0];
      } else if (arr[pos] < target) {
        lo = pos + 1;
      } else {
        hi = pos - 1;
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
