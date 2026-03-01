import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { public: '#3b82f6', private: '#ef4444', shared: '#22c55e', compute: '#eab308' };

export class DiffieHellmanVisualization implements AlgorithmVisualization {
  name = 'Diffie-Hellman';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  private modPow(base: number, exp: number, mod: number): number {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) result = (result * base) % mod;
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }

  initialize(_data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const p = 23; // prime
    const g = 5;  // generator
    const a = 6;  // Alice's private key
    const b = 15; // Bob's private key

    // Show [p, g, a, b, A, B, s_alice, s_bob]
    const display = [p, g, a, b, 0, 0, 0, 0];

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 0, color: COLORS.public, label: `p=${p}` },
        { index: 1, color: COLORS.public, label: `g=${g}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Diffie-Hellman: public params p=${p} (prime), g=${g} (generator)`,
    });

    // Private keys
    this.steps.push({
      data: [...display],
      highlights: [
        { index: 2, color: COLORS.private, label: `a=${a}` },
        { index: 3, color: COLORS.private, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Alice picks private key a=${a}, Bob picks private key b=${b}`,
    });

    // Public values
    const A = this.modPow(g, a, p);
    const B = this.modPow(g, b, p);
    display[4] = A;
    display[5] = B;

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 4, color: COLORS.compute, label: `A=${A}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Alice computes A = g^a mod p = ${g}^${a} mod ${p} = ${A}`,
    });

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 5, color: COLORS.compute, label: `B=${B}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Bob computes B = g^b mod p = ${g}^${b} mod ${p} = ${B}`,
    });

    // Shared secret
    const sAlice = this.modPow(B, a, p);
    const sBob = this.modPow(A, b, p);
    display[6] = sAlice;
    display[7] = sBob;

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 6, color: COLORS.shared, label: `s=${sAlice}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Alice computes shared secret: B^a mod p = ${B}^${a} mod ${p} = ${sAlice}`,
    });

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 7, color: COLORS.shared, label: `s=${sBob}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Bob computes shared secret: A^b mod p = ${A}^${b} mod ${p} = ${sBob}`,
    });

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 6, color: COLORS.shared, label: `${sAlice}` },
        { index: 7, color: COLORS.shared, label: `${sBob}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [6, 7],
      stepDescription: `Both share secret key = ${sAlice}. Key exchange complete!`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
