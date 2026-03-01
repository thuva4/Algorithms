import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { input: '#3b82f6', hashing: '#eab308', done: '#22c55e' };

export class PearsonHashingVisualization implements AlgorithmVisualization {
  name = 'Pearson Hashing';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const input = data.slice(0, Math.min(data.length, 10)).map(v => Math.abs(v) % 256);

    // Pearson lookup table (simplified permutation of 0-255)
    const T: number[] = [];
    for (let i = 0; i < 256; i++) T[i] = (i * 167 + 53) % 256;

    this.steps.push({
      data: [...input],
      highlights: input.map((_, i) => ({ index: i, color: COLORS.input })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Pearson hashing: compute 8-bit hash of [${input.join(', ')}]`,
    });

    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const xorVal = hash ^ input[i];
      hash = T[xorVal];

      this.steps.push({
        data: [...input],
        highlights: [
          { index: i, color: COLORS.hashing, label: `byte=${input[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Step ${i + 1}: hash = T[hash XOR input[${i}]] = T[${xorVal}] = ${hash}`,
      });
    }

    // Show final hash as single-element
    this.steps.push({
      data: [...input, hash],
      highlights: [{ index: input.length, color: COLORS.done, label: `hash=${hash}` }],
      comparisons: [],
      swaps: [],
      sorted: [input.length],
      stepDescription: `Pearson hash = ${hash} (0x${hash.toString(16).padStart(2, '0')})`,
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
