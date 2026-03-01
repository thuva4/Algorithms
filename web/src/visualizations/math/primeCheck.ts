import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  testing: '#3b82f6',
  divisor: '#ef4444',
  passed: '#22c55e',
  checking: '#eab308',
};

export class PrimeCheckVisualization implements AlgorithmVisualization {
  name = 'Prime Check';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = Math.abs(data[0] || 97) % 200 + 2;
    const sqrtN = Math.floor(Math.sqrt(n));

    this.steps.push({
      data: [n, sqrtN],
      highlights: [
        { index: 0, color: COLORS.testing, label: `n=${n}` },
        { index: 1, color: '#94a3b8', label: `sqrt=${sqrtN}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Prime Check: is ${n} prime? Test divisors 2..${sqrtN} (sqrt(${n}) = ${Math.sqrt(n).toFixed(2)})`,
    });

    // Edge cases
    if (n < 2) {
      this.steps.push({
        data: [n],
        highlights: [{ index: 0, color: COLORS.divisor, label: `${n}<2 NOT PRIME` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `${n} < 2: not prime by definition`,
      });
      return this.steps[0];
    }

    if (n === 2 || n === 3) {
      this.steps.push({
        data: [n],
        highlights: [{ index: 0, color: COLORS.passed, label: `${n} PRIME` }],
        comparisons: [],
        swaps: [],
        sorted: [0],
        stepDescription: `${n} is prime (base case)`,
      });
      return this.steps[0];
    }

    // Check 2
    if (n % 2 === 0) {
      this.steps.push({
        data: [2, n],
        highlights: [
          { index: 0, color: COLORS.divisor, label: `2 divides` },
          { index: 1, color: COLORS.divisor, label: `${n}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `${n} % 2 = 0: divisible by 2. Not prime.`,
      });
      return this.steps[0];
    }

    this.steps.push({
      data: [2],
      highlights: [{ index: 0, color: COLORS.passed, label: '2: no' }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `${n} % 2 = ${n % 2} (not divisible by 2). Check odd divisors 3,5,7,...,${sqrtN}`,
    });

    // Check odd numbers from 3 to sqrt(n)
    const checked: number[] = [2];
    let isPrime = true;

    for (let d = 3; d <= sqrtN; d += 2) {
      checked.push(d);
      const remainder = n % d;

      if (remainder === 0) {
        isPrime = false;

        this.steps.push({
          data: [...checked],
          highlights: checked.map((div, i) => ({
            index: i,
            color: i === checked.length - 1 ? COLORS.divisor : COLORS.passed,
            label: i === checked.length - 1 ? `${div} DIVIDES!` : `${div}`,
          })),
          comparisons: [[checked.length - 1, checked.length - 1]],
          swaps: [],
          sorted: [],
          stepDescription: `${n} % ${d} = 0. Found divisor! ${n} = ${d} x ${Math.floor(n / d)}. NOT PRIME.`,
        });
        break;
      }

      this.steps.push({
        data: [...checked],
        highlights: checked.map((div, i) => ({
          index: i,
          color: i === checked.length - 1 ? COLORS.checking : COLORS.passed,
          label: `${div}: ${n % div}`,
        })),
        comparisons: [],
        swaps: [],
        sorted: checked.slice(0, -1).map((_, i) => i),
        stepDescription: `${n} % ${d} = ${remainder} (not zero). Continue checking.`,
      });
    }

    // Final result
    this.steps.push({
      data: [n],
      highlights: [{ index: 0, color: isPrime ? COLORS.passed : COLORS.divisor, label: isPrime ? `${n} PRIME` : `${n} NOT PRIME` }],
      comparisons: [],
      swaps: [],
      sorted: isPrime ? [0] : [],
      stepDescription: `${n} is ${isPrime ? 'PRIME' : 'NOT PRIME'}. Checked ${checked.length} potential divisors.`,
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
