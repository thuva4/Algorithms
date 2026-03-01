import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class CombSortVisualization implements AlgorithmVisualization {
  name = 'Comb Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    let gap = n;
    const shrink = 1.3;
    let sortedFlag = false;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    while (!sortedFlag) {
      gap = Math.floor(gap / shrink);
      if (gap <= 1) {
        gap = 1;
        sortedFlag = true;
      }

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Starting pass with gap = ${gap}`,
      });

      for (let i = 0; i + gap < n; i++) {
        // Comparison step
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.comparing, label: `${arr[i]}` },
            { index: i + gap, color: COLORS.comparing, label: `${arr[i + gap]}` },
          ],
          comparisons: [[i, i + gap]],
          swaps: [],
          sorted: [],
          stepDescription: `Gap ${gap}: comparing ${arr[i]} (pos ${i}) and ${arr[i + gap]} (pos ${i + gap})`,
        });

        if (arr[i] > arr[i + gap]) {
          const temp = arr[i];
          arr[i] = arr[i + gap];
          arr[i + gap] = temp;
          sortedFlag = false;

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i, color: COLORS.swapping, label: `${arr[i]}` },
              { index: i + gap, color: COLORS.swapping, label: `${arr[i + gap]}` },
            ],
            comparisons: [],
            swaps: [[i, i + gap]],
            sorted: [],
            stepDescription: `Gap ${gap}: swapped ${arr[i]} and ${arr[i + gap]}`,
          });
        }
      }

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Completed pass with gap ${gap}: [${arr.join(', ')}]`,
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
