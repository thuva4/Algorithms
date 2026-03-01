import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  active: '#3b82f6',
  squaring: '#eab308',
  multiplying: '#ef4444',
  result: '#22c55e',
};

export class MatrixExponentiationVisualization implements AlgorithmVisualization {
  name = 'Matrix Exponentiation';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Use a 2x2 matrix (Fibonacci style) and exponent from data
    const exp = Math.max(2, Math.abs(data[0] || 8) % 20 + 2);
    const mod = 1000; // keep numbers manageable

    // Base matrix: [[1,1],[1,0]] (Fibonacci matrix)
    type Mat = number[][];
    const base: Mat = [[1, 1], [1, 0]];

    function matMul(a: Mat, b: Mat, m: number): Mat {
      return [
        [(a[0][0] * b[0][0] + a[0][1] * b[1][0]) % m, (a[0][0] * b[0][1] + a[0][1] * b[1][1]) % m],
        [(a[1][0] * b[0][0] + a[1][1] * b[1][0]) % m, (a[1][0] * b[0][1] + a[1][1] * b[1][1]) % m],
      ];
    }

    const flatMat = (m: Mat) => [m[0][0], m[0][1], m[1][0], m[1][1]];

    this.steps.push({
      data: flatMat(base),
      highlights: flatMat(base).map((v, i) => ({ index: i, color: '#94a3b8', label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Matrix Exponentiation: [[1,1],[1,0]]^${exp} mod ${mod} using binary method`,
    });

    // Binary representation of exponent
    const bits: number[] = [];
    let tempExp = exp;
    while (tempExp > 0) {
      bits.push(tempExp & 1);
      tempExp >>= 1;
    }
    bits.reverse();

    this.steps.push({
      data: [...bits],
      highlights: bits.map((b, i) => ({ index: i, color: COLORS.active, label: `${b}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Exponent ${exp} in binary: ${bits.join('')}. Process bits left to right.`,
    });

    // Fast exponentiation
    let result: Mat = [[1, 0], [0, 1]]; // identity
    let current: Mat = [...base.map((r) => [...r])];

    for (let i = 0; i < bits.length; i++) {
      // Square the result
      result = matMul(result, result, mod);

      this.steps.push({
        data: flatMat(result),
        highlights: flatMat(result).map((v, idx) => ({ index: idx, color: COLORS.squaring, label: `${v}` })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Bit ${i} (${bits[i]}): square result -> [[${result[0].join(',')}],[${result[1].join(',')}]]`,
      });

      if (bits[i] === 1) {
        result = matMul(result, base, mod);

        this.steps.push({
          data: flatMat(result),
          highlights: flatMat(result).map((v, idx) => ({ index: idx, color: COLORS.multiplying, label: `${v}` })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Bit ${i} is 1: multiply by base -> [[${result[0].join(',')}],[${result[1].join(',')}]]`,
        });
      }
    }

    // Final result
    this.steps.push({
      data: flatMat(result),
      highlights: flatMat(result).map((v, i) => ({ index: i, color: COLORS.result, label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: [0, 1, 2, 3],
      stepDescription: `Result: M^${exp} mod ${mod} = [[${result[0].join(',')}],[${result[1].join(',')}]]. F(${exp}) = ${result[0][1]}`,
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
