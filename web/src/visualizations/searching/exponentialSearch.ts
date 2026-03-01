import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { exponential: '#8b5cf6', binary: '#3b82f6', found: '#22c55e', current: '#eab308' };

export class ExponentialSearchVisualization implements AlgorithmVisualization {
  name = 'Exponential Search';
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
      stepDescription: `Exponential search for ${target}`,
    });

    if (arr[0] === target) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: 0, color: COLORS.found, label: 'Found!' }],
        comparisons: [],
        swaps: [],
        sorted: [0],
        stepDescription: `Found ${target} at index 0!`,
      });
      return this.steps[0];
    }

    let bound = 1;
    while (bound < n && arr[bound] <= target) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: bound, color: COLORS.exponential, label: `2^${Math.log2(bound)}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Exponential probe at index ${bound}: ${arr[bound]} ${arr[bound] <= target ? '<=' : '>'} ${target}`,
      });
      bound *= 2;
    }

    const lo = Math.floor(bound / 2);
    const hi = Math.min(bound, n - 1);
    this.steps.push({
      data: [...arr],
      highlights: [
        { index: lo, color: COLORS.binary, label: 'lo' },
        { index: hi, color: COLORS.binary, label: 'hi' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Binary search in range [${lo}, ${hi}]`,
    });

    let left = lo, right = hi;
    while (left <= right) {
      const mid = Math.floor((left + right) / 2);
      this.steps.push({
        data: [...arr],
        highlights: [{ index: mid, color: COLORS.current, label: `mid=${arr[mid]}` }],
        comparisons: [[left, right]],
        swaps: [],
        sorted: [],
        stepDescription: `Binary: mid=${mid}, ${arr[mid]} vs ${target}`,
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
        left = mid + 1;
      } else {
        right = mid - 1;
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
