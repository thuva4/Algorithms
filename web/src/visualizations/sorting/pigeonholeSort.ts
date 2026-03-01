import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class PigeonholeSortVisualization implements AlgorithmVisualization {
  name = 'Pigeonhole Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    if (n <= 1) {
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: n === 1 ? [0] : [],
        stepDescription: 'Array is already sorted',
      });
      return this.steps[0];
    }

    const minVal = Math.min(...arr);
    const maxVal = Math.max(...arr);
    const range = maxVal - minVal + 1;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Range: [${minVal}, ${maxVal}], creating ${range} pigeonholes`,
    });

    // Create pigeonholes
    const holes: number[] = new Array(range).fill(0);

    // Place elements into pigeonholes
    for (let i = 0; i < n; i++) {
      const holeIdx = arr[i] - minVal;
      holes[holeIdx]++;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `h${holeIdx}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Placing ${arr[i]} into pigeonhole ${holeIdx} (count: ${holes[holeIdx]})`,
      });
    }

    // Show pigeonhole state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Pigeonholes filled. Collecting elements back in order.`,
    });

    // Collect elements from pigeonholes
    let idx = 0;
    const sortedIndices: number[] = [];

    for (let i = 0; i < range; i++) {
      while (holes[i] > 0) {
        arr[idx] = i + minVal;
        sortedIndices.push(idx);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: idx, color: COLORS.sorted, label: `${arr[idx]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...sortedIndices],
          stepDescription: `Collecting ${arr[idx]} from pigeonhole ${i} into position ${idx}`,
        });

        holes[i]--;
        idx++;
      }
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
