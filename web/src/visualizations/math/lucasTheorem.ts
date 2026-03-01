import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  active: '#3b82f6',
  digit: '#eab308',
  result: '#22c55e',
  zero: '#ef4444',
};

export class LucasTheoremVisualization implements AlgorithmVisualization {
  name = "Lucas' Theorem";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Use input data to derive n, k, and p
    const primes = [3, 5, 7, 11, 13];
    let n = Math.abs(data[0] || 10) % 50 + 5;
    let k = Math.abs(data[1] || 3) % n;
    const p = primes[Math.abs(data[2] || 0) % primes.length];
    if (k > n) k = n - 1;

    // Precompute factorials mod p
    const fact: number[] = new Array(p);
    fact[0] = 1;
    for (let i = 1; i < p; i++) fact[i] = (fact[i - 1] * i) % p;

    function modPow(base: number, exp: number, mod: number): number {
      let result = 1;
      base %= mod;
      let e = exp;
      while (e > 0) {
        if (e & 1) result = (result * base) % mod;
        e >>= 1;
        base = (base * base) % mod;
      }
      return result;
    }

    // Show initial problem
    const nDigits: number[] = [];
    const kDigits: number[] = [];
    let tempN = n, tempK = k;
    while (tempN > 0 || tempK > 0) {
      nDigits.push(tempN % p);
      kDigits.push(tempK % p);
      tempN = Math.floor(tempN / p);
      tempK = Math.floor(tempK / p);
    }

    // Display: use the digits arrays as visualization data
    const displayData = nDigits.map((nd, i) => nd * 100 + kDigits[i]);

    this.steps.push({
      data: displayData,
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Lucas' Theorem: C(${n}, ${k}) mod ${p}. Decompose into base-${p} digits.`,
    });

    // Show base-p decomposition
    this.steps.push({
      data: [...nDigits],
      highlights: nDigits.map((d, i) => ({ index: i, color: COLORS.active, label: `n[${i}]=${d}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `n = ${n} in base ${p}: [${[...nDigits].reverse().join(', ')}] (least significant first: [${nDigits.join(', ')}])`,
    });

    this.steps.push({
      data: [...kDigits],
      highlights: kDigits.map((d, i) => ({ index: i, color: COLORS.digit, label: `k[${i}]=${d}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `k = ${k} in base ${p}: [${[...kDigits].reverse().join(', ')}] (least significant first: [${kDigits.join(', ')}])`,
    });

    // Process each digit pair
    let result = 1;
    const partialResults: number[] = [];

    for (let i = 0; i < nDigits.length; i++) {
      const ni = nDigits[i];
      const ki = kDigits[i];

      if (ki > ni) {
        // Result is 0
        partialResults.push(0);
        this.steps.push({
          data: [...partialResults],
          highlights: [{ index: i, color: COLORS.zero, label: `C(${ni},${ki})=0` }],
          comparisons: [[i, i]],
          swaps: [],
          sorted: [],
          stepDescription: `Digit ${i}: k[${i}]=${ki} > n[${i}]=${ni}, so C(${ni},${ki}) = 0. Entire result is 0.`,
        });
        result = 0;
        break;
      }

      const comb = (fact[ni] * modPow(fact[ki], p - 2, p) % p * modPow(fact[ni - ki], p - 2, p)) % p;
      result = (result * comb) % p;
      partialResults.push(comb);

      this.steps.push({
        data: [...partialResults],
        highlights: [{ index: i, color: COLORS.active, label: `C(${ni},${ki})=${comb}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Digit ${i}: C(${ni}, ${ki}) mod ${p} = ${comb}. Running product = ${result}`,
      });
    }

    // Final result
    this.steps.push({
      data: [...partialResults, result],
      highlights: [{ index: partialResults.length, color: COLORS.result, label: `Result: ${result}` }],
      comparisons: [],
      swaps: [],
      sorted: [partialResults.length],
      stepDescription: `C(${n}, ${k}) mod ${p} = ${result}`,
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
