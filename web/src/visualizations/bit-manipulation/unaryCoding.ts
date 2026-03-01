import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { encoding: '#eab308', done: '#22c55e' };

export class UnaryCodingVisualization implements AlgorithmVisualization {
  name = 'Unary Coding';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const nums = data.slice(0, Math.min(data.length, 8)).map(v => Math.max(1, Math.abs(v) % 10));

    this.steps.push({
      data: [...nums],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Unary coding: encode each number n as n ones followed by a zero`,
    });

    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      // Show the unary encoding building up
      for (let b = 1; b <= n; b++) {
        this.steps.push({
          data: [...nums],
          highlights: [{ index: i, color: COLORS.encoding, label: `${'1'.repeat(b)}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Encoding ${n}: adding 1 (${b} of ${n})`,
        });
      }

      this.steps.push({
        data: [...nums],
        highlights: [{ index: i, color: COLORS.done, label: `${'1'.repeat(n)}0` }],
        comparisons: [],
        swaps: [],
        sorted: [i],
        stepDescription: `${n} encoded as ${'1'.repeat(n)}0 (${n + 1} bits)`,
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
