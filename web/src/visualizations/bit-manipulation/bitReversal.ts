import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { active: '#eab308', done: '#22c55e', bit: '#3b82f6' };

export class BitReversalVisualization implements AlgorithmVisualization {
  name = 'Bit Reversal';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const nums = data.slice(0, Math.min(data.length, 8)).map(v => Math.abs(v) % 256);

    this.steps.push({
      data: [...nums],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Bit reversal: reverse the bits of each number (8-bit)`,
    });

    const results: number[] = [...nums];
    for (let i = 0; i < nums.length; i++) {
      let original = nums[i];
      let reversed = 0;
      const bits = 8;

      for (let b = 0; b < bits; b++) {
        reversed = (reversed << 1) | (original & 1);
        original >>= 1;
        const partial = [...results];
        partial[i] = reversed;
        this.steps.push({
          data: partial,
          highlights: [{ index: i, color: COLORS.active, label: `bit ${b}: ${reversed.toString(2).padStart(b + 1, '0')}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Num[${i}]=${nums[i]} (${nums[i].toString(2).padStart(8, '0')}): processing bit ${b}, reversed so far: ${reversed.toString(2).padStart(b + 1, '0')}`,
        });
      }

      results[i] = reversed;
      this.steps.push({
        data: [...results],
        highlights: [{ index: i, color: COLORS.done, label: `${reversed}` }],
        comparisons: [],
        swaps: [],
        sorted: [i],
        stepDescription: `Num[${i}]: ${nums[i]} (${nums[i].toString(2).padStart(8, '0')}) -> ${reversed} (${reversed.toString(2).padStart(8, '0')})`,
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
