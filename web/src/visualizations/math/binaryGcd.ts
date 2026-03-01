import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  active: '#3b82f6',
  even: '#eab308',
  odd: '#22c55e',
  result: '#a855f7',
  shift: '#ef4444',
};

export class BinaryGcdVisualization implements AlgorithmVisualization {
  name = 'Binary GCD';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    let a = Math.abs(data[0] || 48);
    let b = Math.abs(data[1] || 18);
    const origA = a;
    const origB = b;

    // Use data array to represent [a, b, shift, gcd]
    const makeData = (aVal: number, bVal: number, shift: number, gcd: number): number[] =>
      [aVal, bVal, shift, gcd];

    this.steps.push({
      data: makeData(a, b, 0, 0),
      highlights: [
        { index: 0, color: COLORS.active, label: `a=${a}` },
        { index: 1, color: COLORS.active, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Binary GCD: computing GCD(${origA}, ${origB}) using Stein's algorithm`,
    });

    // Handle zero cases
    if (a === 0) {
      this.steps.push({
        data: makeData(a, b, 0, b),
        highlights: [{ index: 3, color: COLORS.result, label: `GCD=${b}` }],
        comparisons: [],
        swaps: [],
        sorted: [3],
        stepDescription: `a is 0, so GCD(0, ${b}) = ${b}`,
      });
      return this.steps[0];
    }
    if (b === 0) {
      this.steps.push({
        data: makeData(a, b, 0, a),
        highlights: [{ index: 3, color: COLORS.result, label: `GCD=${a}` }],
        comparisons: [],
        swaps: [],
        sorted: [3],
        stepDescription: `b is 0, so GCD(${a}, 0) = ${a}`,
      });
      return this.steps[0];
    }

    // Phase 1: Extract common factors of 2
    let shift = 0;
    while (((a | b) & 1) === 0) {
      a >>= 1;
      b >>= 1;
      shift++;
      this.steps.push({
        data: makeData(a, b, shift, 0),
        highlights: [
          { index: 0, color: COLORS.even, label: `a=${a}` },
          { index: 1, color: COLORS.even, label: `b=${b}` },
          { index: 2, color: COLORS.shift, label: `shift=${shift}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Both even: divide both by 2. a=${a}, b=${b}, common factor 2^${shift}`,
      });
    }

    // Phase 2: Remove remaining factors of 2 from a
    while ((a & 1) === 0) {
      a >>= 1;
      this.steps.push({
        data: makeData(a, b, shift, 0),
        highlights: [
          { index: 0, color: COLORS.even, label: `a=${a}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `a is even: divide a by 2. a=${a}`,
      });
    }

    this.steps.push({
      data: makeData(a, b, shift, 0),
      highlights: [
        { index: 0, color: COLORS.odd, label: `a=${a} (odd)` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `a is now odd (${a}). Begin main loop.`,
    });

    // Phase 3: Main loop
    while (b !== 0) {
      // Remove factors of 2 from b
      while ((b & 1) === 0) {
        b >>= 1;
        this.steps.push({
          data: makeData(a, b, shift, 0),
          highlights: [
            { index: 1, color: COLORS.even, label: `b=${b}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `b is even: divide b by 2. b=${b}`,
        });
      }

      // Compare and possibly swap
      this.steps.push({
        data: makeData(a, b, shift, 0),
        highlights: [
          { index: 0, color: COLORS.odd, label: `a=${a}` },
          { index: 1, color: COLORS.odd, label: `b=${b}` },
        ],
        comparisons: [[0, 1]],
        swaps: [],
        sorted: [],
        stepDescription: `Both odd: comparing a=${a} and b=${b}`,
      });

      if (a > b) {
        const tmp = a;
        a = b;
        b = tmp;
        this.steps.push({
          data: makeData(a, b, shift, 0),
          highlights: [
            { index: 0, color: COLORS.shift, label: `a=${a}` },
            { index: 1, color: COLORS.shift, label: `b=${b}` },
          ],
          comparisons: [],
          swaps: [[0, 1]],
          sorted: [],
          stepDescription: `a > b, swap: a=${a}, b=${b}`,
        });
      }

      b = b - a;
      this.steps.push({
        data: makeData(a, b, shift, 0),
        highlights: [
          { index: 1, color: COLORS.active, label: `b=${b}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Subtract: b = b - a = ${b}`,
      });
    }

    // Result
    const gcd = a << shift;
    this.steps.push({
      data: makeData(a, 0, shift, gcd),
      highlights: [
        { index: 3, color: COLORS.result, label: `GCD=${gcd}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [3],
      stepDescription: `Done! GCD(${origA}, ${origB}) = ${a} * 2^${shift} = ${gcd}`,
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
