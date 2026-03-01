import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  butterfly: '#3b82f6',
  left: '#eab308',
  right: '#ef4444',
  computed: '#22c55e',
  twiddle: '#8b5cf6',
};

export class NttVisualization implements AlgorithmVisualization {
  name = 'Number Theoretic Transform';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // NTT works with power-of-2 sizes over a prime field
    const MOD = 998244353; // Common NTT-friendly prime
    const G = 3; // primitive root of MOD
    const size = 8; // use 8 elements for clear visualization

    // Get input coefficients
    const coeffs = Array.from({ length: size }, (_, i) =>
      i < data.length ? Math.abs(data[i]) % 100 : 0
    );

    function modPow(base: number, exp: number, mod: number): number {
      let result = 1;
      base %= mod;
      let e = exp;
      while (e > 0) {
        if (e & 1) result = Number((BigInt(result) * BigInt(base)) % BigInt(mod));
        e >>= 1;
        base = Number((BigInt(base) * BigInt(base)) % BigInt(mod));
      }
      return result;
    }

    this.steps.push({
      data: [...coeffs],
      highlights: coeffs.map((c, i) => ({ index: i, color: '#94a3b8', label: `a[${i}]=${c}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `NTT: transform [${coeffs.join(', ')}] using mod ${MOD} with primitive root ${G}`,
    });

    // Bit-reverse permutation
    const arr = [...coeffs];
    const logN = Math.log2(size);
    for (let i = 0; i < size; i++) {
      let rev = 0;
      for (let j = 0; j < logN; j++) {
        if (i & (1 << j)) rev |= 1 << (logN - 1 - j);
      }
      if (i < rev) {
        [arr[i], arr[rev]] = [arr[rev], arr[i]];
      }
    }

    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({ index: i, color: COLORS.butterfly, label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `After bit-reversal permutation: [${arr.join(', ')}]`,
    });

    // NTT butterfly stages
    for (let len = 2; len <= size; len *= 2) {
      const w = modPow(G, Math.floor((MOD - 1) / len), MOD);
      const half = len / 2;

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Butterfly stage: block size = ${len}, twiddle factor w = ${G}^(${MOD - 1}/${len}) mod ${MOD}`,
      });

      for (let i = 0; i < size; i += len) {
        let wn = 1;
        for (let j = 0; j < half; j++) {
          const u = arr[i + j];
          const v = Number((BigInt(arr[i + j + half]) * BigInt(wn)) % BigInt(MOD));
          arr[i + j] = (u + v) % MOD;
          arr[i + j + half] = (u - v + MOD) % MOD;

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i + j, color: COLORS.left, label: `${arr[i + j]}` },
              { index: i + j + half, color: COLORS.right, label: `${arr[i + j + half]}` },
            ],
            comparisons: [[i + j, i + j + half]],
            swaps: [],
            sorted: [],
            stepDescription: `Butterfly: arr[${i + j}]=${u}+${v}=${arr[i + j]}, arr[${i + j + half}]=${u}-${v}=${arr[i + j + half]} (w^${j})`,
          });

          wn = Number((BigInt(wn) * BigInt(w)) % BigInt(MOD));
        }
      }
    }

    // Final result
    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({ index: i, color: COLORS.computed, label: `X[${i}]=${v}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: size }, (_, i) => i),
      stepDescription: `NTT complete: [${arr.join(', ')}]`,
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
