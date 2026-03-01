import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  multiplying: '#eab308',
  accumulated: '#22c55e',
  result: '#a855f7',
};

export class FactorialVisualization implements AlgorithmVisualization {
  name = 'Factorial';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.min(Math.max(Math.abs(data[0] || 7), 1), 12);

    // Build array representing the multiplication sequence: [1, 2, 3, ..., n]
    const factors = Array.from({ length: n }, (_, i) => i + 1);

    this.steps.push({
      data: [...factors],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Computing ${n}! = ${factors.join(' x ')}`,
    });

    // Base case
    if (n === 0 || n === 1) {
      this.steps.push({
        data: [1],
        highlights: [{ index: 0, color: COLORS.result, label: `${n}!=1` }],
        comparisons: [],
        swaps: [],
        sorted: [0],
        stepDescription: `${n}! = 1 (base case)`,
      });
      return this.steps[0];
    }

    // Iterative buildup
    let result = 1;
    // Show accumulation array: each position shows the running product after including that factor
    const accumulation: number[] = new Array(n).fill(0);

    for (let i = 0; i < n; i++) {
      const factor = i + 1;
      const prevResult = result;
      result *= factor;
      accumulation[i] = result;

      // Show the current multiplication
      this.steps.push({
        data: [...accumulation],
        highlights: [
          { index: i, color: COLORS.multiplying, label: `${prevResult}x${factor}` },
        ],
        comparisons: i > 0 ? [[i - 1, i]] : [],
        swaps: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        stepDescription: `Step ${i + 1}: ${prevResult} x ${factor} = ${result}`,
      });

      // Show the accumulated result
      this.steps.push({
        data: [...accumulation],
        highlights: [
          { index: i, color: COLORS.accumulated, label: `=${result}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        stepDescription: `After factor ${factor}: running product = ${result} (${Array.from({ length: i + 1 }, (_, k) => k + 1).join('x')})`,
      });
    }

    // Final result
    this.steps.push({
      data: [...accumulation],
      highlights: [
        { index: n - 1, color: COLORS.result, label: `${n}!=${result}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Result: ${n}! = ${result}. Computed via iterative multiplication of ${n} factors.`,
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
