import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  testing: '#3b82f6',
  coprime: '#22c55e',
  notCoprime: '#ef4444',
  primeFactor: '#eab308',
  result: '#a855f7',
};

export class EulerTotientVisualization implements AlgorithmVisualization {
  name = "Euler's Totient";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private gcd(a: number, b: number): number {
    while (b !== 0) {
      const t = b;
      b = a % b;
      a = t;
    }
    return a;
  }

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.max(2, Math.min(30, Math.abs(data[0] || 12)));

    // Show both methods: counting coprimes and using the formula

    // Method 1: Direct counting - show each number from 1 to n
    // Mark as coprime or not
    const coprimeFlags: number[] = new Array(n).fill(0); // 0 = untested, 1 = coprime, -1 = not coprime
    let count = 0;

    this.steps.push({
      data: Array.from({ length: n }, (_, i) => i + 1),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Computing Euler's totient phi(${n}): counting integers 1..${n} coprime to ${n}`,
    });

    for (let i = 1; i <= n; i++) {
      const g = this.gcd(i, n);
      const isCoprime = g === 1;

      if (isCoprime) {
        count++;
        coprimeFlags[i - 1] = 1;
      } else {
        coprimeFlags[i - 1] = -1;
      }

      const highlights: { index: number; color: string; label?: string }[] = [
        { index: i - 1, color: isCoprime ? COLORS.coprime : COLORS.notCoprime, label: `gcd(${i},${n})=${g}` },
      ];

      // Show previously determined coprimes
      const sortedIndices: number[] = [];
      for (let j = 0; j < i; j++) {
        if (coprimeFlags[j] === 1) sortedIndices.push(j);
      }

      this.steps.push({
        data: Array.from({ length: n }, (_, idx) => idx + 1),
        highlights,
        comparisons: [],
        swaps: [],
        sorted: sortedIndices,
        stepDescription: `Testing ${i}: gcd(${i}, ${n}) = ${g} -> ${isCoprime ? 'coprime' : 'NOT coprime'}. Count so far: ${count}`,
      });
    }

    // Show all coprimes highlighted
    const coprimeIndices: number[] = [];
    const coprimeValues: number[] = [];
    for (let i = 0; i < n; i++) {
      if (coprimeFlags[i] === 1) {
        coprimeIndices.push(i);
        coprimeValues.push(i + 1);
      }
    }

    this.steps.push({
      data: Array.from({ length: n }, (_, i) => i + 1),
      highlights: coprimeIndices.map(idx => ({
        index: idx,
        color: COLORS.coprime,
        label: `${idx + 1}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: coprimeIndices,
      stepDescription: `Coprimes to ${n}: {${coprimeValues.join(', ')}}. phi(${n}) = ${count}`,
    });

    // Method 2: Show the formula approach via prime factorization
    // phi(n) = n * product(1 - 1/p) for each prime factor p of n
    let phiFormula = n;
    let temp = n;
    const primeFactors: number[] = [];

    this.steps.push({
      data: [n, phiFormula],
      highlights: [
        { index: 0, color: COLORS.primeFactor, label: `n=${n}` },
        { index: 1, color: COLORS.result, label: `phi=${phiFormula}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Formula method: phi(${n}) = ${n} * product(1 - 1/p) for prime factors p`,
    });

    for (let p = 2; p * p <= temp; p++) {
      if (temp % p === 0) {
        primeFactors.push(p);
        while (temp % p === 0) temp /= p;
        phiFormula -= Math.floor(phiFormula / p);

        this.steps.push({
          data: [n, phiFormula, p],
          highlights: [
            { index: 2, color: COLORS.primeFactor, label: `p=${p}` },
            { index: 1, color: COLORS.result, label: `phi=${phiFormula}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Prime factor ${p}: phi *= (1 - 1/${p}) -> phi = ${phiFormula}`,
        });
      }
    }

    if (temp > 1) {
      primeFactors.push(temp);
      phiFormula -= Math.floor(phiFormula / temp);

      this.steps.push({
        data: [n, phiFormula, temp],
        highlights: [
          { index: 2, color: COLORS.primeFactor, label: `p=${temp}` },
          { index: 1, color: COLORS.result, label: `phi=${phiFormula}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Prime factor ${temp}: phi *= (1 - 1/${temp}) -> phi = ${phiFormula}`,
      });
    }

    // Final
    this.steps.push({
      data: [n, phiFormula],
      highlights: [
        { index: 1, color: COLORS.result, label: `phi(${n})=${phiFormula}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [1],
      stepDescription: `phi(${n}) = ${phiFormula}. Prime factors: {${primeFactors.join(', ')}}. Formula: ${n} * ${primeFactors.map(p => `(1-1/${p})`).join(' * ')} = ${phiFormula}`,
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
