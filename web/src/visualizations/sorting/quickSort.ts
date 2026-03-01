import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  pivot: '#8b5cf6',
  current: '#3b82f6',
};

export class QuickSortVisualization implements AlgorithmVisualization {
  name = 'Quick Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;
  private sorted: number[] = [];

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    this.sorted = [];

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

    // Run quicksort and record all steps
    this.quickSort(arr, 0, n - 1);

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

  private quickSort(arr: number[], low: number, high: number): void {
    if (low >= high) {
      if (low === high && !this.sorted.includes(low)) {
        this.sorted.push(low);
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: low, color: COLORS.sorted, label: `${arr[low]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...this.sorted],
          stepDescription: `Element ${arr[low]} at position ${low} is in its final position (single element)`,
        });
      }
      return;
    }

    const pivotIdx = this.partition(arr, low, high);
    this.quickSort(arr, low, pivotIdx - 1);
    this.quickSort(arr, pivotIdx + 1, high);
  }

  private partition(arr: number[], low: number, high: number): number {
    const pivot = arr[high];

    // Show pivot selection
    this.steps.push({
      data: [...arr],
      highlights: [
        { index: high, color: COLORS.pivot, label: `pivot=${pivot}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [...this.sorted],
      stepDescription: `Partitioning [${low}..${high}]: pivot = ${pivot} (last element at position ${high})`,
    });

    let i = low - 1;

    for (let j = low; j < high; j++) {
      // Comparison with pivot
      const highlights = [
        { index: high, color: COLORS.pivot, label: `pivot=${pivot}` },
        { index: j, color: COLORS.comparing, label: `${arr[j]}` },
      ];
      if (i >= low) {
        highlights.push({ index: i, color: COLORS.current, label: `i=${i}` });
      }

      this.steps.push({
        data: [...arr],
        highlights,
        comparisons: [[j, high]],
        swaps: [],
        sorted: [...this.sorted],
        stepDescription: `Comparing ${arr[j]} (pos ${j}) with pivot ${pivot}: ${arr[j]} ${arr[j] <= pivot ? '<=' : '>'} ${pivot}`,
      });

      if (arr[j] <= pivot) {
        i++;

        if (i !== j) {
          // Swap step
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i, color: COLORS.swapping, label: `${arr[i]}` },
              { index: j, color: COLORS.swapping, label: `${arr[j]}` },
              { index: high, color: COLORS.pivot, label: `pivot=${pivot}` },
            ],
            comparisons: [],
            swaps: [[i, j]],
            sorted: [...this.sorted],
            stepDescription: `Swapping ${arr[i]} (pos ${i}) and ${arr[j]} (pos ${j}) to move smaller element left`,
          });

          const temp = arr[i];
          arr[i] = arr[j];
          arr[j] = temp;
        }
      }
    }

    // Final swap: pivot into its correct position
    const pivotFinalPos = i + 1;
    if (pivotFinalPos !== high) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: pivotFinalPos, color: COLORS.swapping, label: `${arr[pivotFinalPos]}` },
          { index: high, color: COLORS.swapping, label: `pivot=${arr[high]}` },
        ],
        comparisons: [],
        swaps: [[pivotFinalPos, high]],
        sorted: [...this.sorted],
        stepDescription: `Placing pivot ${arr[high]} into its final position at index ${pivotFinalPos}`,
      });

      const temp = arr[pivotFinalPos];
      arr[pivotFinalPos] = arr[high];
      arr[high] = temp;
    }

    // Mark pivot as sorted
    this.sorted.push(pivotFinalPos);

    this.steps.push({
      data: [...arr],
      highlights: [
        { index: pivotFinalPos, color: COLORS.sorted, label: `${arr[pivotFinalPos]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [...this.sorted],
      stepDescription: `Pivot ${arr[pivotFinalPos]} is now in its final sorted position at index ${pivotFinalPos}`,
    });

    return pivotFinalPos;
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
