import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { input: '#3b82f6', sbox: '#eab308', shift: '#8b5cf6', mix: '#ef4444', key: '#22c55e' };

export class AesSimplifiedVisualization implements AlgorithmVisualization {
  name = 'AES Simplified';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Simulate a simplified AES round on 16 bytes
    const block = data.slice(0, 16).map(v => Math.abs(v) % 256);
    while (block.length < 16) block.push(Math.floor(Math.random() * 256));
    const state = [...block];

    this.steps.push({
      data: [...state],
      highlights: state.map((_, i) => ({ index: i, color: COLORS.input })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `AES: 4x4 state matrix (16 bytes). Initial plaintext block.`,
    });

    // SubBytes (simplified S-box: XOR with 0x63)
    for (let i = 0; i < 16; i++) {
      state[i] = state[i] ^ 0x63;
    }
    this.steps.push({
      data: [...state],
      highlights: state.map((_, i) => ({ index: i, color: COLORS.sbox })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `SubBytes: each byte substituted through S-box (simplified: XOR 0x63)`,
    });

    // ShiftRows
    // Row 0: no shift, Row 1: shift 1, Row 2: shift 2, Row 3: shift 3
    const shifted = [...state];
    for (let row = 1; row < 4; row++) {
      for (let col = 0; col < 4; col++) {
        shifted[row * 4 + col] = state[row * 4 + ((col + row) % 4)];
      }
    }
    for (let i = 0; i < 16; i++) state[i] = shifted[i];
    this.steps.push({
      data: [...state],
      highlights: [
        { index: 4, color: COLORS.shift, label: 'r1<<1' },
        { index: 8, color: COLORS.shift, label: 'r2<<2' },
        { index: 12, color: COLORS.shift, label: 'r3<<3' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `ShiftRows: row 1 shifts 1 left, row 2 shifts 2, row 3 shifts 3`,
    });

    // MixColumns (simplified: XOR adjacent)
    for (let col = 0; col < 4; col++) {
      const c0 = state[col], c1 = state[4 + col], c2 = state[8 + col], c3 = state[12 + col];
      state[col] = c0 ^ c1;
      state[4 + col] = c1 ^ c2;
      state[8 + col] = c2 ^ c3;
      state[12 + col] = c3 ^ c0;
    }
    this.steps.push({
      data: [...state],
      highlights: state.map((_, i) => ({ index: i, color: COLORS.mix })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `MixColumns: columns mixed using Galois field operations (simplified)`,
    });

    // AddRoundKey
    const key = block.map(b => (b * 7 + 13) % 256);
    for (let i = 0; i < 16; i++) {
      state[i] = state[i] ^ key[i];
    }
    this.steps.push({
      data: [...state],
      highlights: state.map((_, i) => ({ index: i, color: COLORS.key })),
      comparisons: [],
      swaps: [],
      sorted: state.map((_, i) => i),
      stepDescription: `AddRoundKey: XOR state with round key. Ciphertext produced.`,
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
