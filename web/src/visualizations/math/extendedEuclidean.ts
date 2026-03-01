import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  dividing: '#3b82f6',
  remainder: '#eab308',
  coefficient: '#ef4444',
  backtrack: '#a855f7',
  result: '#22c55e',
};

export class ExtendedEuclideanVisualization implements AlgorithmVisualization {
  name = 'Extended Euclidean Algorithm';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    let a = Math.abs(data[0] || 240);
    let b = Math.abs(data[1] || 46);
    if (a < b) { const t = a; a = b; b = t; }
    const origA = a;
    const origB = b;

    // data: [a, b, quotient, remainder, x, y, gcd]
    const makeData = (aV: number, bV: number, q: number, r: number, x: number, y: number, g: number): number[] =>
      [aV, bV, q, r, x, y, g];

    this.steps.push({
      data: makeData(a, b, 0, 0, 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.dividing, label: `a=${a}` },
        { index: 1, color: COLORS.dividing, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Extended Euclidean: find gcd(${a}, ${b}) and Bezout coefficients x, y where ${a}x + ${b}y = gcd`,
    });

    // Forward phase: standard Euclidean divisions
    const divisions: { a: number; b: number; q: number; r: number }[] = [];
    let aVal = a;
    let bVal = b;

    while (bVal !== 0) {
      const q = Math.floor(aVal / bVal);
      const r = aVal % bVal;

      this.steps.push({
        data: makeData(aVal, bVal, q, r, 0, 0, 0),
        highlights: [
          { index: 0, color: COLORS.dividing, label: `${aVal}` },
          { index: 1, color: COLORS.dividing, label: `${bVal}` },
          { index: 2, color: COLORS.coefficient, label: `q=${q}` },
          { index: 3, color: COLORS.remainder, label: `r=${r}` },
        ],
        comparisons: [[0, 1]],
        swaps: [],
        sorted: [],
        stepDescription: `${aVal} = ${q} * ${bVal} + ${r}`,
      });

      divisions.push({ a: aVal, b: bVal, q, r });
      aVal = bVal;
      bVal = r;
    }

    const gcd = aVal;

    this.steps.push({
      data: makeData(aVal, 0, 0, 0, 0, 0, gcd),
      highlights: [
        { index: 6, color: COLORS.result, label: `gcd=${gcd}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Remainder is 0. GCD(${origA}, ${origB}) = ${gcd}. Now back-substitute for Bezout coefficients.`,
    });

    // Back-substitution phase
    // Starting from gcd = last non-zero remainder
    // Work backwards: if a = q*b + r, then r = a - q*b
    // So we substitute to express gcd as a*x + b*y
    let x = 1;
    let y = 0;

    this.steps.push({
      data: makeData(gcd, 0, 0, 0, x, y, gcd),
      highlights: [
        { index: 4, color: COLORS.backtrack, label: `x=${x}` },
        { index: 5, color: COLORS.backtrack, label: `y=${y}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Start back-substitution: ${gcd} = ${gcd}*1 + 0*0. x=1, y=0`,
    });

    // Back-substitute from the second-to-last division upward
    for (let i = divisions.length - 1; i >= 0; i--) {
      const div = divisions[i];
      // r_i = a_i - q_i * b_i
      // We have gcd = x*b_{i} + y*r_{i}  (since b_i became a_{i+1} and r_i became b_{i+1})
      // = x*b_i + y*(a_i - q_i*b_i)
      // = y*a_i + (x - q_i*y)*b_i
      const newX = y;
      const newY = x - div.q * y;

      this.steps.push({
        data: makeData(div.a, div.b, div.q, div.r, newX, newY, gcd),
        highlights: [
          { index: 4, color: COLORS.backtrack, label: `x=${newX}` },
          { index: 5, color: COLORS.backtrack, label: `y=${newY}` },
          { index: 2, color: COLORS.coefficient, label: `q=${div.q}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Back-sub step: ${gcd} = ${newX}*${div.a} + ${newY}*${div.b} (x' = y_prev, y' = x_prev - ${div.q}*y_prev)`,
      });

      x = newX;
      y = newY;
    }

    // Verification
    const verify = origA * x + origB * y;

    this.steps.push({
      data: makeData(origA, origB, 0, 0, x, y, gcd),
      highlights: [
        { index: 4, color: COLORS.result, label: `x=${x}` },
        { index: 5, color: COLORS.result, label: `y=${y}` },
        { index: 6, color: COLORS.result, label: `gcd=${gcd}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [4, 5, 6],
      stepDescription: `Result: gcd(${origA}, ${origB}) = ${gcd}. Bezout: ${origA}*(${x}) + ${origB}*(${y}) = ${verify}`,
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
