import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { prime: '#8b5cf6', key: '#3b82f6', encrypt: '#eab308', decrypt: '#22c55e' };

export class RsaAlgorithmVisualization implements AlgorithmVisualization {
  name = 'RSA Algorithm';
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

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const p = 11, q = 13;
    const n = p * q; // 143
    const phi = (p - 1) * (q - 1); // 120
    const e = 7; // public exponent
    // d such that e*d mod phi = 1; 7*103 mod 120 = 1
    const d = 103;
    const message = Math.max(2, Math.abs(data[0] || 42) % n);

    // Display: [p, q, n, phi, e, d, message, encrypted, decrypted]
    const display = [p, q, n, phi, e, d, message, 0, 0];

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 0, color: COLORS.prime, label: `p=${p}` },
        { index: 1, color: COLORS.prime, label: `q=${q}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `RSA: choose primes p=${p}, q=${q}`,
    });

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 2, color: COLORS.key, label: `n=${n}` },
        { index: 3, color: COLORS.key, label: `phi=${phi}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Compute n = p*q = ${n}, phi(n) = (p-1)(q-1) = ${phi}`,
    });

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 4, color: COLORS.key, label: `e=${e}` },
        { index: 5, color: COLORS.key, label: `d=${d}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Public key: e=${e}, Private key: d=${d} (e*d mod phi = ${(e * d) % phi})`,
    });

    this.steps.push({
      data: [...display],
      highlights: [{ index: 6, color: COLORS.encrypt, label: `m=${message}` }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Plaintext message m = ${message}`,
    });

    const encrypted = this.modPow(message, e, n);
    display[7] = encrypted;
    this.steps.push({
      data: [...display],
      highlights: [{ index: 7, color: COLORS.encrypt, label: `c=${encrypted}` }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Encrypt: c = m^e mod n = ${message}^${e} mod ${n} = ${encrypted}`,
    });

    const decrypted = this.modPow(encrypted, d, n);
    display[8] = decrypted;
    this.steps.push({
      data: [...display],
      highlights: [{ index: 8, color: COLORS.decrypt, label: `m=${decrypted}` }],
      comparisons: [],
      swaps: [],
      sorted: [6, 8],
      stepDescription: `Decrypt: m = c^d mod n = ${encrypted}^${d} mod ${n} = ${decrypted}. Matches original!`,
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
