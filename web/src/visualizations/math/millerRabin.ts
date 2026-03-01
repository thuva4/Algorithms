import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  testing: '#3b82f6',
  witness: '#ef4444',
  passed: '#22c55e',
  computing: '#eab308',
};

export class MillerRabinVisualization implements AlgorithmVisualization {
  name = 'Miller-Rabin Primality Test';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Pick a number to test from input
    let n = Math.abs(data[0] || 53) % 200 + 3;
    if (n % 2 === 0) n += 1; // make odd
    if (n < 5) n = 5;

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

    // Decompose n-1 = 2^r * d
    let d = n - 1;
    let r = 0;
    while (d % 2 === 0) {
      d = Math.floor(d / 2);
      r++;
    }

    this.steps.push({
      data: [n, n - 1, r, d],
      highlights: [
        { index: 0, color: COLORS.testing, label: `n=${n}` },
        { index: 1, color: '#94a3b8', label: `n-1=${n - 1}` },
        { index: 2, color: COLORS.computing, label: `r=${r}` },
        { index: 3, color: COLORS.computing, label: `d=${d}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Miller-Rabin: test if ${n} is prime. Decompose ${n - 1} = 2^${r} * ${d}`,
    });

    // Test with several witnesses
    const witnesses = [2, 3, 5, 7, 11].filter((w) => w < n - 1);
    let isPrime = true;

    for (const a of witnesses) {
      // Compute a^d mod n
      let x = modPow(a, d, n);

      this.steps.push({
        data: [a, d, n, x],
        highlights: [
          { index: 0, color: COLORS.testing, label: `a=${a}` },
          { index: 3, color: COLORS.computing, label: `${a}^${d} mod ${n}=${x}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Witness a=${a}: compute ${a}^${d} mod ${n} = ${x}`,
      });

      if (x === 1 || x === n - 1) {
        this.steps.push({
          data: [a, x, n - 1],
          highlights: [
            { index: 0, color: COLORS.passed, label: `a=${a}` },
            { index: 1, color: COLORS.passed, label: `x=${x}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [0],
          stepDescription: `Witness ${a}: x=${x} (${x === 1 ? 'equals 1' : 'equals n-1'}). Passes this round.`,
        });
        continue;
      }

      let passedRound = false;
      const squarings: number[] = [x];

      for (let i = 0; i < r - 1; i++) {
        x = modPow(x, 2, n);
        squarings.push(x);

        this.steps.push({
          data: [...squarings],
          highlights: squarings.map((s, idx) => ({
            index: idx,
            color: idx === squarings.length - 1 ? COLORS.computing : '#94a3b8',
            label: `sq${idx}=${s}`,
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Witness ${a}, round ${i + 1}/${r - 1}: square -> ${x}${x === n - 1 ? ' = n-1, passes!' : ''}`,
        });

        if (x === n - 1) {
          passedRound = true;
          this.steps.push({
            data: [...squarings],
            highlights: [{ index: squarings.length - 1, color: COLORS.passed, label: `${x}=n-1` }],
            comparisons: [],
            swaps: [],
            sorted: [squarings.length - 1],
            stepDescription: `Witness ${a}: found n-1 after squaring. Passes this round.`,
          });
          break;
        }

        if (x === 1) {
          break;
        }
      }

      if (!passedRound && x !== n - 1) {
        isPrime = false;
        this.steps.push({
          data: [a, n],
          highlights: [{ index: 0, color: COLORS.witness, label: `a=${a} WITNESS` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Witness ${a}: ${n} is COMPOSITE! ${a} is a witness to compositeness.`,
        });
        break;
      }
    }

    // Final verdict
    this.steps.push({
      data: [n],
      highlights: [{ index: 0, color: isPrime ? COLORS.passed : COLORS.witness, label: isPrime ? 'PRIME' : 'COMPOSITE' }],
      comparisons: [],
      swaps: [],
      sorted: isPrime ? [0] : [],
      stepDescription: `${n} is ${isPrime ? 'probably PRIME' : 'COMPOSITE'} (tested ${witnesses.length} witnesses)`,
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
