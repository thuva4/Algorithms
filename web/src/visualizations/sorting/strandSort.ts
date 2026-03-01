import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class StrandSortVisualization implements AlgorithmVisualization {
  name = 'Strand Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = data.length;
    const remaining = [...data];
    let output: number[] = [];
    // We'll use arr to track the visual display (starts as data, ends as sorted)
    const arr = [...data];
    let strandNum = 0;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    while (remaining.length > 0) {
      strandNum++;
      // Start a new strand with the first element
      const strand: number[] = [remaining[0]];
      remaining.splice(0, 1);

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Strand #${strandNum}: starting with ${strand[0]}`,
      });

      // Build the strand by pulling sorted subsequence
      let i = 0;
      while (i < remaining.length) {
        if (remaining[i] >= strand[strand.length - 1]) {
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Strand #${strandNum}: ${remaining[i]} >= ${strand[strand.length - 1]}, adding to strand`,
          });

          strand.push(remaining[i]);
          remaining.splice(i, 1);
        } else {
          this.steps.push({
            data: [...arr],
            highlights: [],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Strand #${strandNum}: ${remaining[i]} < ${strand[strand.length - 1]}, skipping`,
          });
          i++;
        }
      }

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Strand #${strandNum} complete: [${strand.join(', ')}]. Merging with output.`,
      });

      // Merge strand into output
      const merged: number[] = [];
      let oi = 0;
      let si = 0;
      while (oi < output.length && si < strand.length) {
        if (output[oi] <= strand[si]) {
          merged.push(output[oi]);
          oi++;
        } else {
          merged.push(strand[si]);
          si++;
        }
      }
      while (oi < output.length) {
        merged.push(output[oi++]);
      }
      while (si < strand.length) {
        merged.push(strand[si++]);
      }
      output = merged;

      // Update display: sorted portion from output, unsorted from remaining
      const sortedIndices: number[] = [];
      for (let j = 0; j < output.length; j++) {
        arr[j] = output[j];
        sortedIndices.push(j);
      }
      for (let j = 0; j < remaining.length; j++) {
        arr[output.length + j] = remaining[j];
      }

      this.steps.push({
        data: [...arr],
        highlights: sortedIndices.map(idx => ({
          index: idx,
          color: COLORS.sorted,
        })),
        comparisons: [],
        swaps: [],
        sorted: [...sortedIndices],
        stepDescription: `After merge: output = [${output.join(', ')}], remaining = [${remaining.join(', ')}]`,
      });
    }

    // Final sorted state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: 'Array is fully sorted',
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
