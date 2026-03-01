import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  computing: '#3b82f6',
  dependency: '#eab308',
  filled: '#22c55e',
  result: '#a855f7',
};

export class CatalanNumbersVisualization implements AlgorithmVisualization {
  name = 'Catalan Numbers';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // n is the target Catalan number to compute
    const n = Math.min(Math.max(data[0] || 6, 2), 12);

    // DP table: C[i] = i-th Catalan number
    // C[0] = 1, C[n] = sum_{i=0}^{n-1} C[i]*C[n-1-i]
    const C: number[] = new Array(n + 1).fill(0);
    C[0] = 1;

    this.steps.push({
      data: [...C],
      highlights: [
        { index: 0, color: COLORS.filled, label: 'C(0)=1' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: `Computing Catalan numbers C(0) through C(${n}). Base case: C(0) = 1`,
    });

    // Fill in C[1] through C[n]
    for (let i = 1; i <= n; i++) {
      // Show which cell we're computing
      this.steps.push({
        data: [...C],
        highlights: [
          { index: i, color: COLORS.computing, label: `C(${i})=?` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: i }, (_, k) => k),
        stepDescription: `Computing C(${i}) = sum of C(j)*C(${i}-1-j) for j=0..${i - 1}`,
      });

      let sum = 0;
      for (let j = 0; j < i; j++) {
        const left = j;
        const right = i - 1 - j;
        const product = C[left] * C[right];
        sum += product;

        // Show the dependency pair
        this.steps.push({
          data: [...C],
          highlights: [
            { index: i, color: COLORS.computing, label: `sum=${sum}` },
            { index: left, color: COLORS.dependency, label: `C(${left})=${C[left]}` },
            { index: right, color: COLORS.dependency, label: `C(${right})=${C[right]}` },
          ],
          comparisons: [[left, right]],
          swaps: [],
          sorted: Array.from({ length: i }, (_, k) => k),
          stepDescription: `C(${i}): C(${left})*C(${right}) = ${C[left]}*${C[right]} = ${product}, running sum = ${sum}`,
        });
      }

      C[i] = sum;

      this.steps.push({
        data: [...C],
        highlights: [
          { index: i, color: COLORS.filled, label: `C(${i})=${C[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: i + 1 }, (_, k) => k),
        stepDescription: `C(${i}) = ${C[i]} (computed)`,
      });
    }

    // Final result
    this.steps.push({
      data: [...C],
      highlights: [
        { index: n, color: COLORS.result, label: `C(${n})=${C[n]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n + 1 }, (_, k) => k),
      stepDescription: `Catalan numbers complete. C(${n}) = ${C[n]}. Sequence: ${C.join(', ')}`,
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
