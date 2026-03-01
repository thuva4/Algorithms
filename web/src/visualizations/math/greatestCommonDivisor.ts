import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  dividing: '#3b82f6',
  quotient: '#eab308',
  remainder: '#ef4444',
  zero: '#9ca3af',
  result: '#22c55e',
};

export class GreatestCommonDivisorVisualization implements AlgorithmVisualization {
  name = 'Greatest Common Divisor (Euclidean)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    let a = Math.abs(data[0] || 252);
    let b = Math.abs(data[1] || 105);
    if (a === 0 && b === 0) { a = 252; b = 105; }
    const origA = a;
    const origB = b;

    // data: [a, b, quotient, remainder, step_number]
    const makeData = (aV: number, bV: number, q: number, r: number, step: number): number[] =>
      [aV, bV, q, r, step];

    this.steps.push({
      data: makeData(a, b, 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.dividing, label: `a=${a}` },
        { index: 1, color: COLORS.dividing, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Euclidean GCD: computing GCD(${origA}, ${origB}). Repeatedly divide larger by smaller.`,
    });

    // Handle edge cases
    if (a === 0) {
      this.steps.push({
        data: makeData(0, b, 0, 0, 1),
        highlights: [{ index: 1, color: COLORS.result, label: `GCD=${b}` }],
        comparisons: [],
        swaps: [],
        sorted: [1],
        stepDescription: `a is 0, so GCD(0, ${b}) = ${b}`,
      });
      return this.steps[0];
    }
    if (b === 0) {
      this.steps.push({
        data: makeData(a, 0, 0, 0, 1),
        highlights: [{ index: 0, color: COLORS.result, label: `GCD=${a}` }],
        comparisons: [],
        swaps: [],
        sorted: [0],
        stepDescription: `b is 0, so GCD(${a}, 0) = ${a}`,
      });
      return this.steps[0];
    }

    let step = 0;

    while (b !== 0) {
      step++;
      const q = Math.floor(a / b);
      const r = a % b;

      // Show the division
      this.steps.push({
        data: makeData(a, b, q, r, step),
        highlights: [
          { index: 0, color: COLORS.dividing, label: `${a}` },
          { index: 1, color: COLORS.dividing, label: `${b}` },
          { index: 2, color: COLORS.quotient, label: `q=${q}` },
        ],
        comparisons: [[0, 1]],
        swaps: [],
        sorted: [],
        stepDescription: `Step ${step}: ${a} / ${b} = ${q} quotient`,
      });

      // Show the remainder
      this.steps.push({
        data: makeData(a, b, q, r, step),
        highlights: [
          { index: 3, color: r === 0 ? COLORS.zero : COLORS.remainder, label: `r=${r}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Step ${step}: ${a} = ${q} * ${b} + ${r}. Remainder = ${r}`,
      });

      // Shift: a = b, b = r
      a = b;
      b = r;

      if (b !== 0) {
        this.steps.push({
          data: makeData(a, b, 0, 0, step),
          highlights: [
            { index: 0, color: COLORS.dividing, label: `a=${a}` },
            { index: 1, color: COLORS.dividing, label: `b=${b}` },
          ],
          comparisons: [],
          swaps: [[0, 1]],
          sorted: [],
          stepDescription: `Shift: a = ${a}, b = ${b}. Continue dividing.`,
        });
      }
    }

    // GCD is the last non-zero remainder (which is now in a)
    this.steps.push({
      data: makeData(a, 0, 0, 0, step),
      highlights: [
        { index: 1, color: COLORS.zero, label: `b=0` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Remainder is 0. The algorithm terminates.`,
    });

    this.steps.push({
      data: makeData(a, 0, 0, 0, step),
      highlights: [
        { index: 0, color: COLORS.result, label: `GCD=${a}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: `GCD(${origA}, ${origB}) = ${a}. Found in ${step} division steps.`,
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
