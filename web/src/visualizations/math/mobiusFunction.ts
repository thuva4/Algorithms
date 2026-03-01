import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  factoring: '#3b82f6',
  squareFree: '#22c55e',
  hasSquare: '#ef4444',
  prime: '#eab308',
  result: '#8b5cf6',
};

export class MobiusFunctionVisualization implements AlgorithmVisualization {
  name = 'Mobius Function';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Compute mobius function for a range of numbers
    const maxN = Math.min(Math.max(data.length, 8), 25);
    const numbers = Array.from({ length: maxN }, (_, i) => i + 1);

    this.steps.push({
      data: [...numbers],
      highlights: numbers.map((n, i) => ({ index: i, color: '#94a3b8', label: `${n}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Mobius function: compute mu(n) for n = 1 to ${maxN}. mu(1)=1, mu(n)=0 if n has squared prime factor, else (-1)^k for k distinct prime factors`,
    });

    const results: number[] = [];

    for (let num = 1; num <= maxN; num++) {
      if (num === 1) {
        results.push(1);
        this.steps.push({
          data: [...results],
          highlights: [{ index: 0, color: COLORS.squareFree, label: 'mu(1)=1' }],
          comparisons: [],
          swaps: [],
          sorted: [0],
          stepDescription: `mu(1) = 1 (by definition)`,
        });
        continue;
      }

      // Factorize
      let n = num;
      const primeFactors: number[] = [];
      let hasSquareFactor = false;

      for (let p = 2; p * p <= n; p++) {
        if (n % p === 0) {
          primeFactors.push(p);
          n = Math.floor(n / p);
          if (n % p === 0) {
            hasSquareFactor = true;
            break;
          }
        }
      }
      if (n > 1) primeFactors.push(n);

      // Show factorization
      this.steps.push({
        data: [...primeFactors],
        highlights: primeFactors.map((p, i) => ({ index: i, color: COLORS.prime, label: `${p}` })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Factorize ${num}: prime factors = [${primeFactors.join(', ')}]${hasSquareFactor ? ' (has squared factor!)' : ''}`,
      });

      let mu: number;
      if (hasSquareFactor) {
        mu = 0;
      } else {
        mu = primeFactors.length % 2 === 0 ? 1 : -1;
      }

      results.push(mu);

      const color = mu === 0 ? COLORS.hasSquare : mu === 1 ? COLORS.squareFree : COLORS.result;

      this.steps.push({
        data: [...results],
        highlights: results.map((m, i) => ({
          index: i,
          color: m === 0 ? COLORS.hasSquare : m === 1 ? COLORS.squareFree : COLORS.result,
          label: `mu(${i + 1})=${m}`,
        })),
        comparisons: [],
        swaps: [],
        sorted: results.map((_, i) => i),
        stepDescription: `mu(${num}) = ${mu}${hasSquareFactor ? ' (squared prime factor)' : ` (${primeFactors.length} distinct prime factors, (-1)^${primeFactors.length})`}`,
      });
    }

    // Final summary
    this.steps.push({
      data: [...results],
      highlights: results.map((m, i) => ({
        index: i,
        color: m === 0 ? COLORS.hasSquare : m === 1 ? COLORS.squareFree : COLORS.result,
        label: `mu(${i + 1})=${m}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: results.length }, (_, i) => i),
      stepDescription: `Complete: mu values for 1..${maxN}: [${results.join(', ')}]`,
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
