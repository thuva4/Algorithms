import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  baby: '#3b82f6',
  giant: '#ef4444',
  match: '#22c55e',
  computing: '#eab308',
  result: '#a855f7',
};

export class DiscreteLogarithmVisualization implements AlgorithmVisualization {
  name = 'Discrete Logarithm (Baby-step Giant-step)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Find x such that g^x ≡ h (mod p)
    // Use small primes to keep visualization manageable
    const p = 23; // prime modulus
    const g = Math.max(2, (Math.abs(data[0] || 5) % (p - 2)) + 2); // generator
    const targetExp = Math.abs(data[1] || 7) % (p - 1);
    const h = this.modPow(g, targetExp, p);

    // m = ceil(sqrt(p))
    const m = Math.ceil(Math.sqrt(p));

    // data array: [g, h, p, m, babyIdx, giantIdx, result]
    const makeData = (babyIdx: number, giantIdx: number, res: number): number[] =>
      [g, h, p, m, babyIdx, giantIdx, res];

    this.steps.push({
      data: makeData(0, 0, -1),
      highlights: [
        { index: 0, color: COLORS.computing, label: `g=${g}` },
        { index: 1, color: COLORS.computing, label: `h=${h}` },
        { index: 2, color: COLORS.computing, label: `p=${p}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Baby-step Giant-step: find x where ${g}^x ≡ ${h} (mod ${p}). m = ceil(sqrt(${p})) = ${m}`,
    });

    // Phase 1: Baby steps - compute g^j mod p for j = 0..m-1
    const babyTable: Map<number, number> = new Map();
    const babyValues: number[] = [];

    this.steps.push({
      data: makeData(0, 0, -1),
      highlights: [
        { index: 3, color: COLORS.baby, label: `m=${m}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Phase 1: Baby steps - compute ${g}^j mod ${p} for j = 0 to ${m - 1}`,
    });

    for (let j = 0; j < m; j++) {
      const val = this.modPow(g, j, p);
      babyTable.set(val, j);
      babyValues.push(val);

      this.steps.push({
        data: [...babyValues, ...new Array(Math.max(0, m - babyValues.length)).fill(0)],
        highlights: [
          { index: j, color: COLORS.baby, label: `${g}^${j}=${val}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: j + 1 }, (_, i) => i),
        stepDescription: `Baby step j=${j}: ${g}^${j} mod ${p} = ${val}. Stored in table.`,
      });
    }

    // Phase 2: Giant steps - compute h * (g^{-m})^i mod p for i = 0,1,...
    // g^{-m} = g^{p-1-m} mod p (Fermat's little theorem)
    const gInvM = this.modPow(g, p - 1 - m, p);

    this.steps.push({
      data: [...babyValues],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Phase 2: Giant steps. g^(-m) mod ${p} = ${g}^${p - 1 - m} mod ${p} = ${gInvM}`,
    });

    let gamma = h;
    let found = false;

    for (let i = 0; i < m && !found; i++) {
      this.steps.push({
        data: [...babyValues],
        highlights: [
          { index: Math.min(i, babyValues.length - 1), color: COLORS.giant, label: `γ=${gamma}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Giant step i=${i}: γ = ${h} * ${gInvM}^${i} mod ${p} = ${gamma}. Looking for ${gamma} in baby table...`,
      });

      if (babyTable.has(gamma)) {
        const j = babyTable.get(gamma)!;
        const x = (i * m + j) % (p - 1);

        this.steps.push({
          data: [...babyValues],
          highlights: [
            { index: j, color: COLORS.match, label: `match! j=${j}` },
          ],
          comparisons: [[j, Math.min(i, babyValues.length - 1)]],
          swaps: [],
          sorted: [],
          stepDescription: `Match found! γ=${gamma} = ${g}^${j} in baby table. x = i*m + j = ${i}*${m} + ${j} = ${x}`,
        });

        // Verify
        const verify = this.modPow(g, x, p);
        this.steps.push({
          data: makeData(0, 0, x),
          highlights: [
            { index: 6, color: COLORS.result, label: `x=${x}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [6],
          stepDescription: `Verification: ${g}^${x} mod ${p} = ${verify} ${verify === h ? '=' : '≠'} ${h}. Solution: x = ${x}`,
        });

        found = true;
      }

      gamma = (gamma * gInvM) % p;
    }

    if (!found) {
      this.steps.push({
        data: makeData(0, 0, -1),
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `No solution found. The discrete logarithm may not exist for these parameters.`,
      });
    }

    return this.steps[0];
  }

  private modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp & 1) result = (result * base) % mod;
      exp >>= 1;
      base = (base * base) % mod;
    }
    return result;
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
