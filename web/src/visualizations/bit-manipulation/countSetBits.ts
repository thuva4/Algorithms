import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { counting: '#eab308', done: '#22c55e' };

export class CountSetBitsVisualization implements AlgorithmVisualization {
  name = 'Count Set Bits';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const nums = data.slice(0, Math.min(data.length, 10)).map(v => Math.abs(v) % 256);

    this.steps.push({
      data: [...nums],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Count set bits (1s) in each number using Brian Kernighan's algorithm`,
    });

    const results: number[] = [...nums];
    for (let i = 0; i < nums.length; i++) {
      let n = nums[i];
      let count = 0;

      this.steps.push({
        data: [...results],
        highlights: [{ index: i, color: COLORS.counting, label: `${n} = ${n.toString(2)}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Processing ${n} (binary: ${n.toString(2)})`,
      });

      while (n > 0) {
        n = n & (n - 1); // Clear lowest set bit
        count++;
        this.steps.push({
          data: [...results],
          highlights: [{ index: i, color: COLORS.counting, label: `bits=${count}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `n & (n-1) = ${n} (${n.toString(2) || '0'}), count = ${count}`,
        });
      }

      results[i] = count;
      this.steps.push({
        data: [...results],
        highlights: [{ index: i, color: COLORS.done, label: `${count} bits` }],
        comparisons: [],
        swaps: [],
        sorted: [i],
        stepDescription: `${nums[i]} has ${count} set bits`,
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
