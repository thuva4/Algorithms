import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { fixed: '#22c55e', swapping: '#eab308', current: '#3b82f6' };

export class PermutationsVisualization implements AlgorithmVisualization {
  name = 'Permutations';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = data.slice(0, Math.min(data.length, 5));

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Generate all permutations of [${arr.join(', ')}]`,
    });

    this.permute(arr, 0);
    return this.steps[0];
  }

  private permute(arr: number[], start: number): void {
    if (start === arr.length) {
      this.steps.push({
        data: [...arr],
        highlights: arr.map((_, i) => ({ index: i, color: COLORS.fixed, label: `${arr[i]}` })),
        comparisons: [],
        swaps: [],
        sorted: arr.map((_, i) => i),
        stepDescription: `Permutation found: [${arr.join(', ')}]`,
      });
      return;
    }

    for (let i = start; i < arr.length; i++) {
      // Swap
      [arr[start], arr[i]] = [arr[i], arr[start]];
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: start, color: COLORS.swapping, label: `${arr[start]}` },
          ...(i !== start ? [{ index: i, color: COLORS.swapping, label: `${arr[i]}` }] : []),
          ...Array.from({ length: start }, (_, j) => ({ index: j, color: COLORS.current })),
        ],
        comparisons: [],
        swaps: i !== start ? [[start, i] as [number, number]] : [],
        sorted: [],
        stepDescription: i !== start
          ? `Swap positions ${start} and ${i}: fix ${arr[start]} at position ${start}`
          : `Fix ${arr[start]} at position ${start}`,
      });

      this.permute(arr, start + 1);

      // Swap back
      [arr[start], arr[i]] = [arr[i], arr[start]];
      if (i !== start) {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: start, color: COLORS.current, label: `${arr[start]}` },
            { index: i, color: COLORS.current, label: `${arr[i]}` },
          ],
          comparisons: [],
          swaps: [[start, i]],
          sorted: [],
          stepDescription: `Backtrack: swap back positions ${start} and ${i}`,
        });
      }
    }
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
