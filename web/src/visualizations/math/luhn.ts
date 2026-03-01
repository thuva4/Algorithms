import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  doubled: '#eab308',
  processed: '#8b5cf6',
  valid: '#22c55e',
  invalid: '#ef4444',
};

export class LuhnVisualization implements AlgorithmVisualization {
  name = 'Luhn Algorithm';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Generate a credit-card-like number from input data
    const digits = data.slice(0, Math.min(data.length, 16)).map((d) => Math.abs(d) % 10);
    while (digits.length < 8) digits.push(Math.abs(data[0] || 5) % 10);
    const n = digits.length;

    this.steps.push({
      data: [...digits],
      highlights: digits.map((d, i) => ({ index: i, color: '#94a3b8', label: `${d}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Luhn Algorithm: validate number [${digits.join('')}] by processing from right to left`,
    });

    let sum = 0;
    let isSecond = false;
    const processed: number[] = new Array(n).fill(0);
    const processedIndices: number[] = [];

    for (let i = n - 1; i >= 0; i--) {
      let d = digits[i];
      const original = d;

      if (isSecond) {
        d = d * 2;
        const adjusted = d > 9 ? d - 9 : d;

        this.steps.push({
          data: [...digits],
          highlights: [
            { index: i, color: COLORS.doubled, label: `${original}x2=${d}${d > 9 ? `->` + adjusted : ''}` },
            ...processedIndices.map((pi) => ({ index: pi, color: COLORS.processed, label: `${processed[pi]}` })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...processedIndices],
          stepDescription: `Position ${i}: double ${original} = ${d}${d > 9 ? `, subtract 9 = ${adjusted}` : ''}. Running sum = ${sum + adjusted}`,
        });

        d = adjusted;
      } else {
        this.steps.push({
          data: [...digits],
          highlights: [
            { index: i, color: COLORS.current, label: `${d} (keep)` },
            ...processedIndices.map((pi) => ({ index: pi, color: COLORS.processed, label: `${processed[pi]}` })),
          ],
          comparisons: [],
          swaps: [],
          sorted: [...processedIndices],
          stepDescription: `Position ${i}: keep digit ${d} as is. Running sum = ${sum + d}`,
        });
      }

      sum += d;
      processed[i] = d;
      processedIndices.push(i);
      isSecond = !isSecond;
    }

    const isValid = sum % 10 === 0;

    this.steps.push({
      data: [...digits],
      highlights: digits.map((_, i) => ({
        index: i,
        color: isValid ? COLORS.valid : COLORS.invalid,
        label: `${processed[i]}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: isValid ? Array.from({ length: n }, (_, i) => i) : [],
      stepDescription: `Total sum = ${sum}. ${sum} mod 10 = ${sum % 10}. Number is ${isValid ? 'VALID' : 'INVALID'}`,
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
