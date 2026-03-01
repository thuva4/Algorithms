import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class GnomeSortVisualization implements AlgorithmVisualization {
  name = 'Gnome Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    let pos = 0;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    while (pos < n) {
      if (pos === 0) {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: pos, color: COLORS.current, label: `pos=${pos}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `At position 0, moving forward`,
        });
        pos++;
      } else if (arr[pos] >= arr[pos - 1]) {
        // Already in order, move forward
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: pos - 1, color: COLORS.comparing, label: `${arr[pos - 1]}` },
            { index: pos, color: COLORS.comparing, label: `${arr[pos]}` },
          ],
          comparisons: [[pos - 1, pos]],
          swaps: [],
          sorted: [],
          stepDescription: `${arr[pos - 1]} <= ${arr[pos]}: in order, moving forward to position ${pos + 1}`,
        });
        pos++;
      } else {
        // Out of order, swap and move back
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: pos - 1, color: COLORS.comparing, label: `${arr[pos - 1]}` },
            { index: pos, color: COLORS.comparing, label: `${arr[pos]}` },
          ],
          comparisons: [[pos - 1, pos]],
          swaps: [],
          sorted: [],
          stepDescription: `${arr[pos - 1]} > ${arr[pos]}: out of order, need to swap`,
        });

        const temp = arr[pos];
        arr[pos] = arr[pos - 1];
        arr[pos - 1] = temp;

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: pos - 1, color: COLORS.swapping, label: `${arr[pos - 1]}` },
            { index: pos, color: COLORS.swapping, label: `${arr[pos]}` },
          ],
          comparisons: [],
          swaps: [[pos - 1, pos]],
          sorted: [],
          stepDescription: `Swapped: moved ${arr[pos - 1]} to position ${pos - 1}, going back to position ${pos - 1}`,
        });

        pos--;
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
