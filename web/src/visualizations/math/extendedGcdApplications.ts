import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  computing: '#3b82f6',
  gcdStep: '#eab308',
  inverse: '#22c55e',
  error: '#ef4444',
  result: '#a855f7',
};

export class ExtendedGcdApplicationsVisualization implements AlgorithmVisualization {
  name = 'Extended GCD Applications';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private extGcd(a: number, b: number): [number, number, number] {
    if (a === 0) return [b, 0, 1];
    const [g, x1, y1] = this.extGcd(b % a, a);
    return [g, y1 - Math.floor(b / a) * x1, x1];
  }

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Application: compute modular inverse of a mod m
    // a^(-1) mod m exists iff gcd(a, m) = 1
    const m = Math.max(3, Math.min(97, Math.abs(data[0] || 26)));
    let a = Math.max(1, Math.min(m - 1, Math.abs(data[1] || 7)));
    // Ensure coprime for a valid example
    const gcdCheck = this.gcd(a, m);
    if (gcdCheck !== 1) {
      // Find nearest coprime
      for (let d = 1; d < m; d++) {
        if (this.gcd(a + d, m) === 1) { a = a + d; break; }
        if (a - d > 0 && this.gcd(a - d, m) === 1) { a = a - d; break; }
      }
    }

    // data: [a, m, gcd, x(inverse), y, verification]
    const makeData = (aV: number, mV: number, g: number, x: number, y: number, ver: number): number[] =>
      [aV, mV, g, x, y, ver];

    this.steps.push({
      data: makeData(a, m, 0, 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.computing, label: `a=${a}` },
        { index: 1, color: COLORS.computing, label: `m=${m}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Modular inverse: finding ${a}^(-1) mod ${m} using Extended GCD`,
    });

    // Show the Extended GCD computation step by step
    // Forward pass: Euclidean divisions
    const divisions: { a: number; b: number; q: number; r: number }[] = [];
    let aVal = a;
    let bVal = m;

    // We compute gcd(a, m) via Euclidean algorithm
    // But for ext-gcd we need gcd(m, a) to get coefficients right
    aVal = m;
    bVal = a;

    this.steps.push({
      data: makeData(a, m, 0, 0, 0, 0),
      highlights: [
        { index: 0, color: COLORS.computing, label: `Computing gcd(${m}, ${a})` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 1: Run Euclidean algorithm on gcd(${m}, ${a})`,
    });

    while (bVal !== 0) {
      const q = Math.floor(aVal / bVal);
      const r = aVal % bVal;

      this.steps.push({
        data: makeData(aVal, bVal, 0, q, r, 0),
        highlights: [
          { index: 0, color: COLORS.gcdStep, label: `${aVal}` },
          { index: 1, color: COLORS.gcdStep, label: `${bVal}` },
          { index: 3, color: COLORS.computing, label: `q=${q}` },
          { index: 4, color: COLORS.computing, label: `r=${r}` },
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

    const gcdResult = aVal;

    this.steps.push({
      data: makeData(a, m, gcdResult, 0, 0, 0),
      highlights: [
        { index: 2, color: gcdResult === 1 ? COLORS.inverse : COLORS.error, label: `gcd=${gcdResult}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `GCD(${m}, ${a}) = ${gcdResult}. ${gcdResult === 1 ? 'Inverse exists!' : 'Inverse does NOT exist (gcd != 1)'}`,
    });

    if (gcdResult !== 1) {
      this.steps.push({
        data: makeData(a, m, gcdResult, 0, 0, 0),
        highlights: [{ index: 2, color: COLORS.error, label: `No inverse` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `${a}^(-1) mod ${m} does not exist because gcd(${a}, ${m}) = ${gcdResult} != 1`,
      });
      return this.steps[0];
    }

    // Back-substitution to find Bezout coefficients
    this.steps.push({
      data: makeData(a, m, 1, 0, 0, 0),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Step 2: Back-substitute to find x, y where ${m}*x + ${a}*y = 1`,
    });

    let x = 1;
    let y = 0;

    for (let i = divisions.length - 1; i >= 0; i--) {
      const div = divisions[i];
      const newX = y;
      const newY = x - div.q * y;

      this.steps.push({
        data: makeData(div.a, div.b, 1, newX, newY, 0),
        highlights: [
          { index: 3, color: COLORS.computing, label: `x=${newX}` },
          { index: 4, color: COLORS.computing, label: `y=${newY}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Back-sub: 1 = ${newX}*${div.a} + ${newY}*${div.b}. (x'=y_prev, y'=x_prev-${div.q}*y_prev)`,
      });

      x = newX;
      y = newY;
    }

    // The coefficient of 'a' in m*x + a*y = 1 is the modular inverse
    // x is coefficient of m, y is coefficient of a
    // So a * y ≡ 1 (mod m)
    const rawInverse = y;
    const inverse = ((rawInverse % m) + m) % m;

    this.steps.push({
      data: makeData(a, m, 1, rawInverse, 0, inverse),
      highlights: [
        { index: 3, color: COLORS.inverse, label: `raw=${rawInverse}` },
        { index: 5, color: COLORS.inverse, label: `inv=${inverse}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Coefficient of ${a} is ${rawInverse}. Modular inverse = ${rawInverse} mod ${m} = ${inverse}`,
    });

    // Verification
    const verification = (a * inverse) % m;

    this.steps.push({
      data: makeData(a, m, 1, 0, 0, inverse),
      highlights: [
        { index: 5, color: COLORS.result, label: `${a}^(-1)=${inverse}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [5],
      stepDescription: `Verification: ${a} * ${inverse} = ${a * inverse} ≡ ${verification} (mod ${m}). ${a}^(-1) mod ${m} = ${inverse}`,
    });

    return this.steps[0];
  }

  private gcd(a: number, b: number): number {
    while (b !== 0) { const t = b; b = a % b; a = t; }
    return a;
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
