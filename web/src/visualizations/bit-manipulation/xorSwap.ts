import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { a: '#3b82f6', b: '#ef4444', xor: '#eab308', done: '#22c55e' };

export class XorSwapVisualization implements AlgorithmVisualization {
  name = 'XOR Swap';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `XOR swap: swap adjacent pairs without a temporary variable`,
    });

    for (let i = 0; i + 1 < arr.length; i += 2) {
      const origA = arr[i], origB = arr[i + 1];

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.a, label: `a=${arr[i]}` },
          { index: i + 1, color: COLORS.b, label: `b=${arr[i + 1]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Swap a=${arr[i]} and b=${arr[i + 1]} at indices ${i},${i + 1}`,
      });

      // Step 1: a = a ^ b
      arr[i] = arr[i] ^ arr[i + 1];
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.xor, label: `a^b=${arr[i]}` },
          { index: i + 1, color: COLORS.b, label: `b=${arr[i + 1]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Step 1: a = a XOR b = ${origA} ^ ${origB} = ${arr[i]}`,
      });

      // Step 2: b = a ^ b
      arr[i + 1] = arr[i] ^ arr[i + 1];
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.xor, label: `a=${arr[i]}` },
          { index: i + 1, color: COLORS.xor, label: `b=${arr[i + 1]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Step 2: b = a XOR b = ${arr[i]} ^ ${origB} = ${arr[i + 1]} (original a)`,
      });

      // Step 3: a = a ^ b
      arr[i] = arr[i] ^ arr[i + 1];
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.done, label: `${arr[i]}` },
          { index: i + 1, color: COLORS.done, label: `${arr[i + 1]}` },
        ],
        comparisons: [],
        swaps: [[i, i + 1]],
        sorted: [i, i + 1],
        stepDescription: `Step 3: a = a XOR b = ${arr[i]}. Swap complete: ${origA}<->${origB}`,
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
