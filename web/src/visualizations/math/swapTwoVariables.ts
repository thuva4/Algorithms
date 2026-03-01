import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  varA: '#3b82f6',
  varB: '#ef4444',
  operation: '#eab308',
  done: '#22c55e',
};

export class SwapTwoVariablesVisualization implements AlgorithmVisualization {
  name = 'Swap Two Variables';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    let a = data[0] !== undefined ? data[0] : 42;
    let b = data[1] !== undefined ? data[1] : 17;
    const originalA = a;
    const originalB = b;

    // ====== Method 1: XOR swap ======
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.varA, label: `a=${a}` },
        { index: 1, color: COLORS.varB, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Swap ${a} and ${b}. Method 1: XOR swap (works for integers)`,
    });

    // Step 1: a = a XOR b
    a = a ^ b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.operation, label: `a=${originalA}^${originalB}=${a}` },
        { index: 1, color: COLORS.varB, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 1: a = a XOR b = ${originalA} ^ ${originalB} = ${a} (binary: ${originalA.toString(2)} ^ ${originalB.toString(2)} = ${a.toString(2)})`,
    });

    // Step 2: b = a XOR b
    b = a ^ b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.operation, label: `a=${a}` },
        { index: 1, color: COLORS.operation, label: `b=${a}^${originalB}=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 2: b = a XOR b = ${a} ^ ${originalB} = ${b}. Now b has original a's value!`,
    });

    // Step 3: a = a XOR b
    a = a ^ b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.done, label: `a=${a}` },
        { index: 1, color: COLORS.done, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [[0, 1]],
      sorted: [0, 1],
      stepDescription: `Step 3: a = a XOR b = ${a ^ b ^ b} ^ ${b} = ${a}. XOR swap complete! a=${a}, b=${b}`,
    });

    // ====== Method 2: Arithmetic swap ======
    a = originalA;
    b = originalB;

    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.varA, label: `a=${a}` },
        { index: 1, color: COLORS.varB, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Method 2: Arithmetic swap (addition/subtraction). Reset: a=${a}, b=${b}`,
    });

    // Step 1: a = a + b
    a = a + b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.operation, label: `a=${originalA}+${originalB}=${a}` },
        { index: 1, color: COLORS.varB, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 1: a = a + b = ${originalA} + ${originalB} = ${a}`,
    });

    // Step 2: b = a - b
    b = a - b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.operation, label: `a=${a}` },
        { index: 1, color: COLORS.operation, label: `b=${a}-${originalB}=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 2: b = a - b = ${a} - ${originalB} = ${b}. Now b = original a!`,
    });

    // Step 3: a = a - b
    a = a - b;
    this.steps.push({
      data: [a, b],
      highlights: [
        { index: 0, color: COLORS.done, label: `a=${a}` },
        { index: 1, color: COLORS.done, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [[0, 1]],
      sorted: [0, 1],
      stepDescription: `Step 3: a = a - b = ${a + b} - ${b} = ${a}. Arithmetic swap complete! a=${a}, b=${b}`,
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
