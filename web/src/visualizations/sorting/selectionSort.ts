import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
  minimum: '#8b5cf6',
};

export class SelectionSortVisualization implements AlgorithmVisualization {
  name = 'Selection Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];

    // Record initial state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    for (let i = 0; i < n - 1; i++) {
      let minIdx = i;

      // Starting a new pass
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.minimum, label: `min=${arr[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Starting pass ${i + 1}: finding minimum in unsorted portion [${i}..${n - 1}]`,
      });

      for (let j = i + 1; j < n; j++) {
        // Comparison step
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: minIdx, color: COLORS.minimum, label: `min=${arr[minIdx]}` },
            { index: j, color: COLORS.comparing, label: `${arr[j]}` },
          ],
          comparisons: [[minIdx, j]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing current minimum ${arr[minIdx]} (pos ${minIdx}) with ${arr[j]} (pos ${j})`,
        });

        if (arr[j] < arr[minIdx]) {
          minIdx = j;

          // Found new minimum
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: minIdx, color: COLORS.minimum, label: `new min=${arr[minIdx]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [...sorted],
            stepDescription: `New minimum found: ${arr[minIdx]} at position ${minIdx}`,
          });
        }
      }

      if (minIdx !== i) {
        // Swap the minimum element with the first unsorted element
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.swapping, label: `${arr[i]}` },
            { index: minIdx, color: COLORS.swapping, label: `${arr[minIdx]}` },
          ],
          comparisons: [],
          swaps: [[i, minIdx]],
          sorted: [...sorted],
          stepDescription: `Swapping minimum ${arr[minIdx]} (pos ${minIdx}) with ${arr[i]} (pos ${i})`,
        });

        const temp = arr[i];
        arr[i] = arr[minIdx];
        arr[minIdx] = temp;
      }

      sorted.push(i);

      // Element placed in sorted position
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.sorted, label: `${arr[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Element ${arr[i]} is now in its final sorted position at index ${i}`,
      });
    }

    // Mark the last element as sorted
    sorted.push(n - 1);
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [...sorted],
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
