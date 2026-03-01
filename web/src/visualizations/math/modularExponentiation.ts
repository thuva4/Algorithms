import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  bit: '#3b82f6',
  squaring: '#eab308',
  multiplying: '#ef4444',
  result: '#22c55e',
};

export class ModularExponentiationVisualization implements AlgorithmVisualization {
  name = 'Modular Exponentiation';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const base = Math.abs(data[0] || 3) % 20 + 2;
    const exp = Math.abs(data[1] || 13) % 30 + 2;
    const mod = Math.abs(data[2] || 17) % 50 + 7;

    this.steps.push({
      data: [base, exp, mod],
      highlights: [
        { index: 0, color: COLORS.bit, label: `base=${base}` },
        { index: 1, color: COLORS.squaring, label: `exp=${exp}` },
        { index: 2, color: '#94a3b8', label: `mod=${mod}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Modular Exponentiation: compute ${base}^${exp} mod ${mod} using binary method (fast power)`,
    });

    // Get binary representation
    const bits: number[] = [];
    let tempExp = exp;
    while (tempExp > 0) {
      bits.push(tempExp & 1);
      tempExp >>= 1;
    }
    bits.reverse();

    this.steps.push({
      data: [...bits],
      highlights: bits.map((b, i) => ({ index: i, color: COLORS.bit, label: `${b}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Exponent ${exp} in binary: ${bits.join('')}. Process bits from MSB to LSB.`,
    });

    // Binary exponentiation (left-to-right)
    let result = 1;
    const resultHistory: number[] = [];

    for (let i = 0; i < bits.length; i++) {
      // Square
      const beforeSquare = result;
      result = (result * result) % mod;

      this.steps.push({
        data: [...resultHistory, result],
        highlights: [
          { index: resultHistory.length, color: COLORS.squaring, label: `${beforeSquare}^2 mod ${mod}=${result}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Bit ${i} (${bits[i]}): square ${beforeSquare}^2 mod ${mod} = ${result}`,
      });

      if (bits[i] === 1) {
        const beforeMul = result;
        result = (result * base) % mod;

        this.steps.push({
          data: [...resultHistory, result],
          highlights: [
            { index: resultHistory.length, color: COLORS.multiplying, label: `${beforeMul}*${base} mod ${mod}=${result}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Bit ${i} is 1: multiply ${beforeMul} * ${base} mod ${mod} = ${result}`,
        });
      }

      resultHistory.push(result);
    }

    // Final
    this.steps.push({
      data: [...resultHistory],
      highlights: [{ index: resultHistory.length - 1, color: COLORS.result, label: `Result=${result}` }],
      comparisons: [],
      swaps: [],
      sorted: [resultHistory.length - 1],
      stepDescription: `${base}^${exp} mod ${mod} = ${result}`,
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
