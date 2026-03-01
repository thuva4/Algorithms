import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
};

export class BubbleSortVisualization implements AlgorithmVisualization {
  name = 'Bubble Sort';
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
      let swapped = false;

      for (let j = 0; j < n - 1 - i; j++) {
        // Comparison step
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: j, color: COLORS.comparing, label: `${arr[j]}` },
            { index: j + 1, color: COLORS.comparing, label: `${arr[j + 1]}` },
          ],
          comparisons: [[j, j + 1]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing elements at positions ${j} and ${j + 1}: ${arr[j]} vs ${arr[j + 1]}`,
        });

        if (arr[j] > arr[j + 1]) {
          // Swap step
          const temp = arr[j];
          arr[j] = arr[j + 1];
          arr[j + 1] = temp;
          swapped = true;

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: j, color: COLORS.swapping, label: `${arr[j]}` },
              { index: j + 1, color: COLORS.swapping, label: `${arr[j + 1]}` },
            ],
            comparisons: [],
            swaps: [[j, j + 1]],
            sorted: [...sorted],
            stepDescription: `Swapping ${arr[j + 1]} and ${arr[j]} (positions ${j} and ${j + 1})`,
          });
        }
      }

      // Mark element as sorted at the end of each pass
      sorted.push(n - 1 - i);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: n - 1 - i, color: COLORS.sorted, label: `${arr[n - 1 - i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Element ${arr[n - 1 - i]} is now in its final sorted position at index ${n - 1 - i}`,
      });

      if (!swapped) {
        // Array is already sorted; mark remaining as sorted
        for (let k = 0; k < n - 1 - i; k++) {
          if (!sorted.includes(k)) {
            sorted.push(k);
          }
        }
        this.steps.push({
          data: [...arr],
          highlights: [],
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: 'No swaps in this pass — array is sorted',
        });
        break;
      }
    }

    // If we didn't break early, mark index 0 as sorted too
    if (!sorted.includes(0)) {
      sorted.push(0);
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: 'Array is fully sorted',
      });
    }

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
