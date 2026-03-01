import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class InsertionSortVisualization implements AlgorithmVisualization {
  name = 'Insertion Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [0]; // First element is trivially sorted

    // Record initial state
    this.steps.push({
      data: [...arr],
      highlights: [{ index: 0, color: COLORS.sorted, label: 'sorted' }],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: 'Initial state: first element is considered sorted',
    });

    for (let i = 1; i < n; i++) {
      const key = arr[i];

      // Highlight the current element to be inserted
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `key=${key}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Selecting element ${key} at position ${i} to insert into sorted portion`,
      });

      let j = i - 1;

      while (j >= 0 && arr[j] > key) {
        // Comparison step — element is larger, needs to shift
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: j, color: COLORS.comparing, label: `${arr[j]}` },
            { index: i, color: COLORS.current, label: `key=${key}` },
          ],
          comparisons: [[j, i]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing key ${key} with ${arr[j]} at position ${j}: ${arr[j]} > ${key}, shifting right`,
        });

        // Shift element right
        arr[j + 1] = arr[j];

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: j + 1, color: COLORS.swapping, label: `${arr[j + 1]}` },
          ],
          comparisons: [],
          swaps: [[j, j + 1]],
          sorted: [...sorted],
          stepDescription: `Shifted ${arr[j + 1]} from position ${j} to position ${j + 1}`,
        });

        j--;
      }

      if (j >= 0 && j !== i - 1) {
        // Comparison that stops the loop (arr[j] <= key)
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: j, color: COLORS.comparing, label: `${arr[j]}` },
            { index: j + 1, color: COLORS.current, label: `key=${key}` },
          ],
          comparisons: [[j, j + 1]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing key ${key} with ${arr[j]} at position ${j}: ${arr[j]} <= ${key}, stop shifting`,
        });
      }

      // Place the key in its correct position
      arr[j + 1] = key;
      sorted.push(i);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: j + 1, color: COLORS.sorted, label: `${key}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Inserted ${key} at position ${j + 1}`,
      });
    }

    // Final sorted state
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: allIndices,
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
