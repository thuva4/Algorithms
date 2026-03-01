import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class CocktailSortVisualization implements AlgorithmVisualization {
  name = 'Cocktail Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];
    let start = 0;
    let end = n - 1;
    let swapped = true;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    while (swapped) {
      swapped = false;

      // Forward pass
      this.steps.push({
        data: [...arr],
        highlights: [{ index: start, color: COLORS.current, label: 'fwd' }],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Forward pass: left to right from index ${start} to ${end}`,
      });

      for (let i = start; i < end; i++) {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.comparing, label: `${arr[i]}` },
            { index: i + 1, color: COLORS.comparing, label: `${arr[i + 1]}` },
          ],
          comparisons: [[i, i + 1]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing ${arr[i]} and ${arr[i + 1]} at positions ${i} and ${i + 1}`,
        });

        if (arr[i] > arr[i + 1]) {
          const temp = arr[i];
          arr[i] = arr[i + 1];
          arr[i + 1] = temp;
          swapped = true;

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i, color: COLORS.swapping, label: `${arr[i]}` },
              { index: i + 1, color: COLORS.swapping, label: `${arr[i + 1]}` },
            ],
            comparisons: [],
            swaps: [[i, i + 1]],
            sorted: [...sorted],
            stepDescription: `Swapped ${arr[i]} and ${arr[i + 1]}`,
          });
        }
      }

      if (!sorted.includes(end)) sorted.push(end);
      end--;

      this.steps.push({
        data: [...arr],
        highlights: [{ index: end + 1, color: COLORS.sorted }],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `End of forward pass: element at index ${end + 1} is in place`,
      });

      if (!swapped) break;
      swapped = false;

      // Backward pass
      this.steps.push({
        data: [...arr],
        highlights: [{ index: end, color: COLORS.current, label: 'bwd' }],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Backward pass: right to left from index ${end} to ${start}`,
      });

      for (let i = end; i > start; i--) {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i - 1, color: COLORS.comparing, label: `${arr[i - 1]}` },
            { index: i, color: COLORS.comparing, label: `${arr[i]}` },
          ],
          comparisons: [[i - 1, i]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Comparing ${arr[i - 1]} and ${arr[i]} at positions ${i - 1} and ${i}`,
        });

        if (arr[i - 1] > arr[i]) {
          const temp = arr[i - 1];
          arr[i - 1] = arr[i];
          arr[i] = temp;
          swapped = true;

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i - 1, color: COLORS.swapping, label: `${arr[i - 1]}` },
              { index: i, color: COLORS.swapping, label: `${arr[i]}` },
            ],
            comparisons: [],
            swaps: [[i - 1, i]],
            sorted: [...sorted],
            stepDescription: `Swapped ${arr[i - 1]} and ${arr[i]}`,
          });
        }
      }

      if (!sorted.includes(start)) sorted.push(start);
      start++;

      this.steps.push({
        data: [...arr],
        highlights: [{ index: start - 1, color: COLORS.sorted }],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `End of backward pass: element at index ${start - 1} is in place`,
      });
    }

    // Mark remaining
    for (let i = start; i <= end; i++) {
      if (!sorted.includes(i)) sorted.push(i);
    }

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
