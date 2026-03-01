import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { max: '#3b82f6', min: '#ef4444', chosen: '#22c55e', evaluating: '#eab308' };

export class MinimaxVisualization implements AlgorithmVisualization {
  name = 'Minimax';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Leaf values for a small game tree
    const leaves = data.length >= 8 ? data.slice(0, 8) : [3, 5, 2, 9, 12, 5, 23, 2];

    this.steps.push({
      data: [...leaves],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Minimax: evaluate game tree with leaf values [${leaves.join(', ')}]`,
    });

    this.minimax(leaves, 0, leaves.length - 1, true, 0);
    return this.steps[0];
  }

  private minimax(leaves: number[], lo: number, hi: number, isMax: boolean, depth: number): number {
    if (lo === hi) {
      this.steps.push({
        data: [...leaves],
        highlights: [{ index: lo, color: COLORS.evaluating, label: `${leaves[lo]}` }],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Leaf node at index ${lo}: value = ${leaves[lo]}`,
      });
      return leaves[lo];
    }

    const mid = Math.floor((lo + hi) / 2);
    const left = this.minimax(leaves, lo, mid, !isMax, depth + 1);
    const right = this.minimax(leaves, mid + 1, hi, !isMax, depth + 1);

    const result = isMax ? Math.max(left, right) : Math.min(left, right);
    const chosenIdx = result === left ? lo : mid + 1;

    this.steps.push({
      data: [...leaves],
      highlights: [
        ...Array.from({ length: hi - lo + 1 }, (_, i) => ({
          index: lo + i,
          color: isMax ? COLORS.max : COLORS.min,
        })),
        { index: chosenIdx, color: COLORS.chosen, label: `${isMax ? 'MAX' : 'MIN'}=${result}` },
      ],
      comparisons: [[lo, hi]],
      swaps: [],
      sorted: [],
      stepDescription: `${isMax ? 'MAX' : 'MIN'} node [${lo}-${hi}]: ${isMax ? 'max' : 'min'}(${left}, ${right}) = ${result}`,
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
