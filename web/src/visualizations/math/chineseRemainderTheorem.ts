import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  active: '#3b82f6',
  modulus: '#eab308',
  combining: '#ef4444',
  solved: '#22c55e',
  result: '#a855f7',
};

export class ChineseRemainderTheoremVisualization implements AlgorithmVisualization {
  name = 'Chinese Remainder Theorem';
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

    // Build a system of congruences from data
    // x ≡ r_i (mod m_i)
    // Use first few values from data as remainders, derive small pairwise coprime moduli
    const moduli = [3, 5, 7];
    const remainders = [
      Math.abs(data[0] || 2) % moduli[0],
      Math.abs(data[1] || 3) % moduli[1],
      Math.abs(data[2] || 1) % moduli[2],
    ];

    const k = moduli.length;

    // data array: [r0, m0, r1, m1, r2, m2, M, result]
    const buildData = (extra: number[]): number[] => {
      const d: number[] = [];
      for (let i = 0; i < k; i++) {
        d.push(remainders[i], moduli[i]);
      }
      d.push(...extra);
      return d;
    };

    this.steps.push({
      data: buildData([0, 0]),
      highlights: Array.from({ length: k }, (_, i) => ({
        index: i * 2,
        color: COLORS.active,
        label: `x≡${remainders[i]} mod ${moduli[i]}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `CRT: solving system x ≡ ${remainders.map((r, i) => `${r} (mod ${moduli[i]})`).join(', ')}`,
    });

    // Step 1: Compute M = product of all moduli
    const M = moduli.reduce((acc, m) => acc * m, 1);

    this.steps.push({
      data: buildData([M, 0]),
      highlights: [
        { index: k * 2, color: COLORS.modulus, label: `M=${M}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Compute M = ${moduli.join(' × ')} = ${M}`,
    });

    // Step 2: For each congruence, compute M_i, find inverse, and partial result
    let x = 0;
    const partials: number[] = [];

    for (let i = 0; i < k; i++) {
      const Mi = M / moduli[i];

      this.steps.push({
        data: buildData([M, x]),
        highlights: [
          { index: i * 2, color: COLORS.active, label: `r_${i}=${remainders[i]}` },
          { index: i * 2 + 1, color: COLORS.modulus, label: `m_${i}=${moduli[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Congruence ${i + 1}: M_${i} = M / m_${i} = ${M} / ${moduli[i]} = ${Mi}`,
      });

      // Find modular inverse of Mi mod m_i using extended GCD
      const [, inv] = this.extGcd(Mi % moduli[i], moduli[i]);
      const yInv = ((inv % moduli[i]) + moduli[i]) % moduli[i];

      this.steps.push({
        data: buildData([M, x]),
        highlights: [
          { index: i * 2 + 1, color: COLORS.combining, label: `inv=${yInv}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Find inverse: ${Mi}⁻¹ mod ${moduli[i]} = ${yInv} (since ${Mi} × ${yInv} ≡ ${(Mi * yInv) % moduli[i]} mod ${moduli[i]})`,
      });

      const partial = remainders[i] * Mi * yInv;
      partials.push(partial);
      x += partial;

      this.steps.push({
        data: buildData([M, x % M]),
        highlights: [
          { index: i * 2, color: COLORS.solved, label: `partial=${partial}` },
          { index: k * 2 + 1, color: COLORS.result, label: `sum=${x}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [i * 2],
        stepDescription: `Partial: r_${i} × M_${i} × inv = ${remainders[i]} × ${Mi} × ${yInv} = ${partial}. Running sum = ${x}`,
      });
    }

    // Step 3: Final result x mod M
    const result = ((x % M) + M) % M;

    this.steps.push({
      data: buildData([M, result]),
      highlights: [
        { index: k * 2 + 1, color: COLORS.result, label: `x=${result}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [k * 2 + 1],
      stepDescription: `x = (${partials.join(' + ')}) mod ${M} = ${x} mod ${M} = ${result}`,
    });

    // Verification step
    const verifications = moduli.map((m, i) => `${result} mod ${m} = ${result % m} ≡ ${remainders[i]}`);

    this.steps.push({
      data: buildData([M, result]),
      highlights: Array.from({ length: k }, (_, i) => ({
        index: i * 2,
        color: COLORS.solved,
        label: `${result}%${moduli[i]}=${result % moduli[i]}`,
      })).concat([
        { index: k * 2 + 1, color: COLORS.result, label: `x=${result}` },
      ]),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: k * 2 + 2 }, (_, i) => i),
      stepDescription: `Verified: ${verifications.join('; ')}. Solution: x = ${result}`,
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
