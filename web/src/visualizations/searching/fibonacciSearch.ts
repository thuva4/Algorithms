import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { probe: '#eab308', found: '#22c55e', range: '#3b82f6' };

export class FibonacciSearchVisualization implements AlgorithmVisualization {
  name = 'Fibonacci Search';
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
      stepDescription: `Fibonacci search for ${target}`,
    });

    let fibM2 = 0, fibM1 = 1, fib = fibM2 + fibM1;
    while (fib < n) {
      fibM2 = fibM1;
      fibM1 = fib;
      fib = fibM2 + fibM1;
    }

    let offset = -1;
    while (fib > 1) {
      const i = Math.min(offset + fibM2, n - 1);
      this.steps.push({
        data: [...arr],
        highlights: [{ index: i, color: COLORS.probe, label: `fib probe: ${arr[i]}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Fibonacci probe at index ${i}: ${arr[i]} vs ${target}`,
      });

      if (arr[i] < target) {
        fib = fibM1;
        fibM1 = fibM2;
        fibM2 = fib - fibM1;
        offset = i;
      } else if (arr[i] > target) {
        fib = fibM2;
        fibM1 = fibM1 - fibM2;
        fibM2 = fib - fibM1;
      } else {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: i, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [i],
          stepDescription: `Found ${target} at index ${i}!`,
        });
        return this.steps[0];
      }
    }

    if (fibM1 === 1 && offset + 1 < n && arr[offset + 1] === target) {
      const idx = offset + 1;
      this.steps.push({
        data: [...arr],
        highlights: [{ index: idx, color: COLORS.found, label: 'Found!' }],
        comparisons: [],
        swaps: [],
        sorted: [idx],
        stepDescription: `Found ${target} at index ${idx}!`,
      });
    } else {
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Target ${target} not found`,
      });
    }
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
