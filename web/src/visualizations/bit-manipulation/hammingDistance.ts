import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { xor: '#eab308', diff: '#ef4444', same: '#22c55e' };

export class HammingDistanceVisualization implements AlgorithmVisualization {
  name = 'Hamming Distance';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const a = Math.abs(data[0] || 25) % 256;
    const b = Math.abs(data[1] || 30) % 256;
    const xorVal = a ^ b;
    const bits = 8;

    // Show XOR result as array of bits
    const xorBits: number[] = [];
    for (let i = bits - 1; i >= 0; i--) {
      xorBits.push((xorVal >> i) & 1);
    }

    this.steps.push({
      data: xorBits,
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Hamming distance between ${a} (${a.toString(2).padStart(8, '0')}) and ${b} (${b.toString(2).padStart(8, '0')})`,
    });

    this.steps.push({
      data: xorBits,
      highlights: xorBits.map((bit, i) => ({
        index: i,
        color: COLORS.xor,
        label: `${bit}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `XOR = ${xorVal} (${xorVal.toString(2).padStart(8, '0')}): each 1-bit means the numbers differ at that position`,
    });

    let distance = 0;
    for (let i = 0; i < bits; i++) {
      const bit = xorBits[i];
      if (bit === 1) distance++;
      this.steps.push({
        data: xorBits,
        highlights: [
          { index: i, color: bit === 1 ? COLORS.diff : COLORS.same, label: bit === 1 ? 'diff' : 'same' },
        ],
        comparisons: [],
        swaps: [],
        sorted: bit === 1 ? [i] : [],
        stepDescription: `Bit ${7 - i}: ${(a >> (7 - i)) & 1} vs ${(b >> (7 - i)) & 1} — ${bit === 1 ? 'different' : 'same'}. Distance so far: ${distance}`,
      });
    }

    this.steps.push({
      data: xorBits,
      highlights: xorBits.map((bit, i) => ({
        index: i,
        color: bit === 1 ? COLORS.diff : COLORS.same,
      })),
      comparisons: [],
      swaps: [],
      sorted: xorBits.map((b, i) => b === 1 ? i : -1).filter(i => i >= 0),
      stepDescription: `Hamming distance = ${distance}`,
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
