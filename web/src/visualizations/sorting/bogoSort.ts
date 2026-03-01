import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class BogoSortVisualization implements AlgorithmVisualization {
  name = 'Bogo Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    const MAX_ATTEMPTS = 150; // Cap attempts to avoid infinite loops in visualization

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    function isSorted(a: number[]): boolean {
      for (let i = 0; i < a.length - 1; i++) {
        if (a[i] > a[i + 1]) return false;
      }
      return true;
    }

    function shuffle(a: number[]): void {
      for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = a[i];
        a[i] = a[j];
        a[j] = temp;
      }
    }

    // Use a deterministic seed-like approach for reproducibility:
    // Pre-sort the array for the visualization so we can show it converging
    const sorted = [...arr].sort((a, b) => a - b);

    // For visualization, we'll use a limited bogo sort with a guaranteed finish
    let attempts = 0;

    while (!isSorted(arr) && attempts < MAX_ATTEMPTS) {
      // Check if sorted
      const comparisons: [number, number][] = [];
      let sortedSoFar = true;
      for (let i = 0; i < n - 1; i++) {
        comparisons.push([i, i + 1]);
        if (arr[i] > arr[i + 1]) {
          sortedSoFar = false;
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i, color: COLORS.comparing, label: `${arr[i]}` },
              { index: i + 1, color: COLORS.comparing, label: `${arr[i + 1]}` },
            ],
            comparisons: [[i, i + 1]],
            swaps: [],
            sorted: [],
            stepDescription: `Check: ${arr[i]} > ${arr[i + 1]} at positions ${i},${i + 1} — not sorted`,
          });
          break;
        }
      }

      if (sortedSoFar) break;

      // Shuffle
      shuffle(arr);
      attempts++;

      this.steps.push({
        data: [...arr],
        highlights: arr.map((v, idx) => ({ index: idx, color: COLORS.swapping, label: `${v}` })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Shuffle #${attempts}: randomly rearranged array to [${arr.join(', ')}]`,
      });
    }

    // If not sorted after MAX_ATTEMPTS, force sort for the visualization
    if (!isSorted(arr)) {
      for (let i = 0; i < n; i++) {
        arr[i] = sorted[i];
      }
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `After ${MAX_ATTEMPTS} shuffles, placing elements in sorted order`,
      });
    }

    // Verification pass
    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, idx) => ({ index: idx, color: COLORS.sorted, label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: 'Array is sorted! Bogo sort got lucky.',
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
