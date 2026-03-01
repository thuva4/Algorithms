import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  testing: '#3b82f6',
  divisible: '#ef4444',
  notDivisible: '#22c55e',
  current: '#eab308',
};

export class PrimalityTestsVisualization implements AlgorithmVisualization {
  name = 'Primality Tests';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Test multiple numbers for primality using trial division
    const numbers = data.slice(0, Math.min(data.length, 10)).map((d) => Math.abs(d) % 100 + 2);
    if (numbers.length < 5) {
      numbers.push(2, 7, 12, 17, 25);
    }
    const testNums = numbers.slice(0, 8);

    this.steps.push({
      data: [...testNums],
      highlights: testNums.map((n, i) => ({ index: i, color: '#94a3b8', label: `${n}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Trial Division Primality Test: check each number by testing divisors up to sqrt(n)`,
    });

    const results: boolean[] = [];

    for (let idx = 0; idx < testNums.length; idx++) {
      const n = testNums[idx];

      if (n < 2) {
        results.push(false);
        this.steps.push({
          data: [...testNums],
          highlights: [{ index: idx, color: COLORS.divisible, label: `${n} < 2` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${n} < 2: not prime`,
        });
        continue;
      }

      if (n === 2 || n === 3) {
        results.push(true);
        this.steps.push({
          data: [...testNums],
          highlights: [{ index: idx, color: COLORS.notDivisible, label: `${n} prime` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${n} is prime (base case)`,
        });
        continue;
      }

      if (n % 2 === 0) {
        results.push(false);
        this.steps.push({
          data: [...testNums],
          highlights: [{ index: idx, color: COLORS.divisible, label: `${n}%2=0` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `${n} is even: divisible by 2, not prime`,
        });
        continue;
      }

      let isPrime = true;
      const sqrtN = Math.floor(Math.sqrt(n));
      const divisorsChecked: number[] = [];

      for (let d = 3; d <= sqrtN; d += 2) {
        divisorsChecked.push(d);

        if (n % d === 0) {
          isPrime = false;
          this.steps.push({
            data: [...divisorsChecked],
            highlights: divisorsChecked.map((div, i) => ({
              index: i,
              color: i === divisorsChecked.length - 1 ? COLORS.divisible : COLORS.notDivisible,
              label: `${div}${i === divisorsChecked.length - 1 ? ' divides!' : ''}`,
            })),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Testing ${n}: ${d} divides ${n} (${n}/${d}=${Math.floor(n / d)}). Not prime!`,
          });
          break;
        }

        if (divisorsChecked.length % 3 === 0 || d === sqrtN || d + 2 > sqrtN) {
          this.steps.push({
            data: [...divisorsChecked],
            highlights: divisorsChecked.map((div, i) => ({
              index: i,
              color: COLORS.notDivisible,
              label: `${div}`,
            })),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Testing ${n}: checked divisors up to ${d} of ${sqrtN}, none divide`,
          });
        }
      }

      results.push(isPrime);

      this.steps.push({
        data: [...testNums],
        highlights: testNums.map((num, i) => {
          if (i < results.length) {
            return { index: i, color: results[i] ? COLORS.notDivisible : COLORS.divisible, label: `${num} ${results[i] ? 'P' : 'C'}` };
          }
          return { index: i, color: '#94a3b8', label: `${num}` };
        }),
        comparisons: [],
        swaps: [],
        sorted: results.map((r, i) => (r ? i : -1)).filter((i) => i >= 0),
        stepDescription: `${n} is ${isPrime ? 'PRIME' : 'COMPOSITE'}${!isPrime ? '' : ` (no divisors up to ${sqrtN})`}`,
      });
    }

    // Summary
    this.steps.push({
      data: [...testNums],
      highlights: testNums.map((num, i) => ({
        index: i,
        color: results[i] ? COLORS.notDivisible : COLORS.divisible,
        label: `${num}:${results[i] ? 'P' : 'C'}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: results.map((r, i) => (r ? i : -1)).filter((i) => i >= 0),
      stepDescription: `Results: ${testNums.map((n, i) => `${n}=${results[i] ? 'prime' : 'composite'}`).join(', ')}`,
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
