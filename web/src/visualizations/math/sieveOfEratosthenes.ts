import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  prime: '#22c55e',
  composite: '#ef4444',
  marking: '#eab308',
  current: '#3b82f6',
};

export class SieveOfEratosthenesVisualization implements AlgorithmVisualization {
  name = 'Sieve of Eratosthenes';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const limit = Math.min(Math.max(Math.abs(data[0] || 30), 10), 50);
    // Display numbers 2..limit
    const numbers = Array.from({ length: limit - 1 }, (_, i) => i + 2);
    const isPrime: boolean[] = new Array(limit + 1).fill(true);
    isPrime[0] = isPrime[1] = false;
    const markedComposite: Set<number> = new Set();

    this.steps.push({
      data: [...numbers],
      highlights: numbers.map((n, i) => ({ index: i, color: '#94a3b8', label: `${n}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Sieve of Eratosthenes: find all primes up to ${limit}. Start with all numbers marked as potentially prime.`,
    });

    const sqrtLimit = Math.floor(Math.sqrt(limit));

    for (let p = 2; p <= sqrtLimit; p++) {
      if (!isPrime[p]) continue;

      // Highlight current prime
      this.steps.push({
        data: [...numbers],
        highlights: numbers.map((n, i) => {
          if (n === p) return { index: i, color: COLORS.current, label: `${n} (prime)` };
          if (markedComposite.has(n)) return { index: i, color: COLORS.composite, label: `${n}` };
          return { index: i, color: '#94a3b8', label: `${n}` };
        }),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `${p} is prime. Now mark all multiples of ${p} starting from ${p}^2 = ${p * p}`,
      });

      // Mark multiples
      const newlyMarked: number[] = [];
      for (let j = p * p; j <= limit; j += p) {
        if (isPrime[j]) {
          isPrime[j] = false;
          markedComposite.add(j);
          newlyMarked.push(j);
        }
      }

      if (newlyMarked.length > 0) {
        this.steps.push({
          data: [...numbers],
          highlights: numbers.map((n, i) => {
            if (newlyMarked.includes(n)) return { index: i, color: COLORS.marking, label: `${n} X` };
            if (n === p) return { index: i, color: COLORS.prime, label: `${n}` };
            if (markedComposite.has(n)) return { index: i, color: COLORS.composite, label: `${n}` };
            if (isPrime[n]) return { index: i, color: COLORS.prime, label: `${n}` };
            return { index: i, color: '#94a3b8', label: `${n}` };
          }),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Marked ${newlyMarked.length} multiples of ${p}: [${newlyMarked.join(', ')}]`,
        });
      }
    }

    // Show all primes found
    const primes = numbers.filter((n) => isPrime[n]);

    this.steps.push({
      data: [...numbers],
      highlights: numbers.map((n, i) => ({
        index: i,
        color: isPrime[n] ? COLORS.prime : COLORS.composite,
        label: `${n}${isPrime[n] ? ' P' : ''}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: numbers.map((n, i) => (isPrime[n] ? i : -1)).filter((i) => i >= 0),
      stepDescription: `Sieve complete! Found ${primes.length} primes up to ${limit}: [${primes.join(', ')}]`,
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
