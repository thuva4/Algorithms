import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  sorted: '#22c55e',
  current: '#3b82f6',
  counting: '#8b5cf6',
  placing: '#ef4444',
};

export class CountingSortVisualization implements AlgorithmVisualization {
  name = 'Counting Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;

    // Record initial state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    // Find the range of values
    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const range = maxVal - minVal + 1;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Value range: min=${minVal}, max=${maxVal}, range=${range}. Creating count array of size ${range}`,
    });

    // Phase 1: Counting
    const count = new Array(range).fill(0);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Phase 1: Counting occurrences of each value. Count array: [${count.join(', ')}]`,
    });

    for (let i = 0; i < n; i++) {
      count[arr[i] - minVal]++;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.counting, label: `${arr[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Counting element ${arr[i]} at position ${i}: count[${arr[i] - minVal}] = ${count[arr[i] - minVal]}. Count array: [${count.join(', ')}]`,
      });
    }

    // Phase 2: Cumulative count
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Phase 2: Building cumulative count. Current count: [${count.join(', ')}]`,
    });

    for (let i = 1; i < range; i++) {
      count[i] += count[i - 1];

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Cumulative count[${i}] = ${count[i]} (value ${i + minVal}). Count: [${count.join(', ')}]`,
      });
    }

    // Phase 3: Place elements in sorted order (stable, right to left)
    const output = new Array(n).fill(0);
    const placed: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Phase 3: Placing elements into sorted positions (right to left for stability)',
    });

    for (let i = n - 1; i >= 0; i--) {
      const val = arr[i];
      const pos = count[val - minVal] - 1;
      output[pos] = val;
      count[val - minVal]--;
      placed.push(pos);

      this.steps.push({
        data: [...output],
        highlights: [
          { index: pos, color: COLORS.placing, label: `${val}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...placed],
        stepDescription: `Placing element ${val} (from input pos ${i}) at output position ${pos}. Count[${val - minVal}] decremented to ${count[val - minVal]}`,
      });
    }

    // Final sorted state
    const allIndices = Array.from({ length: n }, (_, idx) => idx);
    this.steps.push({
      data: [...output],
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
