import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { split: '#3b82f6', multiply: '#eab308', combine: '#22c55e', result: '#8b5cf6' };

export class KaratsubaMultiplicationVisualization implements AlgorithmVisualization {
  name = 'Karatsuba Multiplication';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const a = Math.abs(data[0] || 1234) % 10000;
    const b = Math.abs(data[1] || 5678) % 10000;
    const display = [a, b, 0, 0, 0, 0, 0, 0];

    this.steps.push({
      data: [...display],
      highlights: [
        { index: 0, color: COLORS.split, label: `a=${a}` },
        { index: 1, color: COLORS.split, label: `b=${b}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Karatsuba: multiply ${a} x ${b}`,
    });

    this.karatsuba(a, b, display, 0);
    return this.steps[0];
  }

  private karatsuba(x: number, y: number, display: number[], depth: number): number {
    if (x < 10 || y < 10) {
      const result = x * y;
      this.steps.push({
        data: [...display],
        highlights: [{ index: Math.min(depth + 2, 7), color: COLORS.multiply, label: `${x}*${y}=${result}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Base case: ${x} * ${y} = ${result}`,
      });
      return result;
    }

    const n = Math.max(x.toString().length, y.toString().length);
    const half = Math.floor(n / 2);
    const pow = Math.pow(10, half);

    const a = Math.floor(x / pow);
    const b = x % pow;
    const c = Math.floor(y / pow);
    const d = y % pow;

    this.steps.push({
      data: [a, b, c, d, 0, 0, 0, 0],
      highlights: [
        { index: 0, color: COLORS.split, label: `a=${a}` },
        { index: 1, color: COLORS.split, label: `b=${b}` },
        { index: 2, color: COLORS.split, label: `c=${c}` },
        { index: 3, color: COLORS.split, label: `d=${d}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Split: ${x}=[${a},${b}], ${y}=[${c},${d}] (half=${half})`,
    });

    const ac = a * c;
    const bd = b * d;
    const abcd = (a + b) * (c + d);
    const adbc = abcd - ac - bd;

    this.steps.push({
      data: [ac, bd, adbc, 0, 0, 0, 0, 0],
      highlights: [
        { index: 0, color: COLORS.multiply, label: `ac=${ac}` },
        { index: 1, color: COLORS.multiply, label: `bd=${bd}` },
        { index: 2, color: COLORS.multiply, label: `ad+bc=${adbc}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `3 multiplications: ac=${ac}, bd=${bd}, (a+b)(c+d)-ac-bd=${adbc}`,
    });

    const result = ac * pow * pow + adbc * pow + bd;
    this.steps.push({
      data: [result, ac, adbc, bd, 0, 0, 0, 0],
      highlights: [{ index: 0, color: COLORS.result, label: `=${result}` }],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: `Combine: ${ac}*10^${2 * half} + ${adbc}*10^${half} + ${bd} = ${result}`,
    });

    return result;
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
