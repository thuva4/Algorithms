import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class CycleSortVisualization implements AlgorithmVisualization {
  name = 'Cycle Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const sorted: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    for (let cycleStart = 0; cycleStart < n - 1; cycleStart++) {
      let item = arr[cycleStart];

      // Find position for the item
      let pos = cycleStart;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: cycleStart, color: COLORS.current, label: `item=${item}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Cycle start at index ${cycleStart}: finding position for ${item}`,
      });

      for (let i = cycleStart + 1; i < n; i++) {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: cycleStart, color: COLORS.current, label: `item=${item}` },
            { index: i, color: COLORS.comparing, label: `${arr[i]}` },
          ],
          comparisons: [[cycleStart, i]],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Counting: ${arr[i]} < ${item}? ${arr[i] < item ? 'Yes' : 'No'}`,
        });

        if (arr[i] < item) {
          pos++;
        }
      }

      // If the item is already in the correct position
      if (pos === cycleStart) {
        if (!sorted.includes(cycleStart)) sorted.push(cycleStart);
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: cycleStart, color: COLORS.sorted, label: `${item}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `${item} is already at its correct position ${cycleStart}`,
        });
        continue;
      }

      // Skip duplicates
      while (item === arr[pos]) {
        pos++;
      }

      // Place the item at its correct position
      if (pos !== cycleStart) {
        const temp = arr[pos];
        arr[pos] = item;
        item = temp;

        if (!sorted.includes(pos)) sorted.push(pos);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: pos, color: COLORS.swapping, label: `${arr[pos]}` },
          ],
          comparisons: [],
          swaps: [[cycleStart, pos]],
          sorted: [...sorted],
          stepDescription: `Placed ${arr[pos]} at position ${pos}, picked up ${item}`,
        });
      }

      // Rotate the rest of the cycle
      while (pos !== cycleStart) {
        pos = cycleStart;

        for (let i = cycleStart + 1; i < n; i++) {
          if (arr[i] < item) {
            pos++;
          }
        }

        while (item === arr[pos]) {
          pos++;
        }

        if (item !== arr[pos]) {
          const temp = arr[pos];
          arr[pos] = item;
          item = temp;

          if (!sorted.includes(pos)) sorted.push(pos);

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: pos, color: COLORS.swapping, label: `${arr[pos]}` },
            ],
            comparisons: [],
            swaps: [[cycleStart, pos]],
            sorted: [...sorted],
            stepDescription: `Cycle continues: placed ${arr[pos]} at position ${pos}, picked up ${item}`,
          });
        }
      }
    }

    // Mark last element as sorted
    if (!sorted.includes(n - 1)) sorted.push(n - 1);

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
