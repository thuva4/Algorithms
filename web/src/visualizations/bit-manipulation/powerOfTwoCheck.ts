import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { yes: '#22c55e', no: '#ef4444', checking: '#eab308' };

export class PowerOfTwoCheckVisualization implements AlgorithmVisualization {
  name = 'Power of Two Check';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const nums = data.slice(0, Math.min(data.length, 10)).map(v => Math.max(1, Math.abs(v)));

    this.steps.push({
      data: [...nums],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Check each number: is it a power of 2? Using n & (n-1) == 0 trick`,
    });

    const results: number[] = [];
    for (let i = 0; i < nums.length; i++) {
      const n = nums[i];
      const nMinus1 = n - 1;
      const result = n > 0 && (n & nMinus1) === 0;

      this.steps.push({
        data: [...nums],
        highlights: [{ index: i, color: COLORS.checking, label: `${n} = ${n.toString(2)}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Check ${n}: binary = ${n.toString(2)}, n-1 = ${nMinus1.toString(2)}`,
      });

      this.steps.push({
        data: [...nums],
        highlights: [{ index: i, color: COLORS.checking, label: `${n}&${nMinus1}=${n & nMinus1}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `${n} & ${nMinus1} = ${n & nMinus1} (${(n & nMinus1).toString(2) || '0'})`,
      });

      this.steps.push({
        data: [...nums],
        highlights: [{ index: i, color: result ? COLORS.yes : COLORS.no, label: result ? 'Yes!' : 'No' }],
        comparisons: [],
        swaps: [],
        sorted: result ? [i] : [],
        stepDescription: `${n} is ${result ? '' : 'NOT '}a power of 2`,
      });

      results.push(result ? 1 : 0);
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
