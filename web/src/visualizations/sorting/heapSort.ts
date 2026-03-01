import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
  parent: '#8b5cf6',
};

export class HeapSortVisualization implements AlgorithmVisualization {
  name = 'Heap Sort';
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

    // Phase 1: Build max heap
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Phase 1: Building max heap from the array',
    });

    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      this.heapify(arr, n, i, sorted);
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Max heap built: [${arr.join(', ')}]`,
    });

    // Phase 2: Extract elements from heap
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Phase 2: Extracting maximum elements one by one',
    });

    for (let i = n - 1; i > 0; i--) {
      // Swap root (max) with last unsorted element
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: 0, color: COLORS.swapping, label: `max=${arr[0]}` },
          { index: i, color: COLORS.swapping, label: `${arr[i]}` },
        ],
        comparisons: [],
        swaps: [[0, i]],
        sorted: [...sorted],
        stepDescription: `Extracting max ${arr[0]}: swapping root (pos 0) with last unsorted element (pos ${i})`,
      });

      const temp = arr[0];
      arr[0] = arr[i];
      arr[i] = temp;

      sorted.push(i);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.sorted, label: `${arr[i]}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Element ${arr[i]} placed in its final sorted position at index ${i}`,
      });

      // Re-heapify the reduced heap
      this.heapify(arr, i, 0, sorted);
    }

    // Mark the last remaining element as sorted
    sorted.push(0);
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

  private heapify(arr: number[], heapSize: number, rootIdx: number, sorted: number[]): void {
    let largest = rootIdx;
    const left = 2 * rootIdx + 1;
    const right = 2 * rootIdx + 2;

    this.steps.push({
      data: [...arr],
      highlights: [
        { index: rootIdx, color: COLORS.parent, label: `root=${arr[rootIdx]}` },
        ...(left < heapSize ? [{ index: left, color: COLORS.current, label: `L=${arr[left]}` }] : []),
        ...(right < heapSize ? [{ index: right, color: COLORS.current, label: `R=${arr[right]}` }] : []),
      ],
      comparisons: [],
      swaps: [],
      sorted: [...sorted],
      stepDescription: `Heapifying at index ${rootIdx} (value ${arr[rootIdx]}), children: ${left < heapSize ? `left=${arr[left]}` : 'none'}, ${right < heapSize ? `right=${arr[right]}` : 'none'}`,
    });

    if (left < heapSize) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: largest, color: COLORS.parent, label: `${arr[largest]}` },
          { index: left, color: COLORS.comparing, label: `${arr[left]}` },
        ],
        comparisons: [[largest, left]],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Comparing ${arr[largest]} (pos ${largest}) with left child ${arr[left]} (pos ${left})`,
      });

      if (arr[left] > arr[largest]) {
        largest = left;
      }
    }

    if (right < heapSize) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: largest, color: COLORS.parent, label: `${arr[largest]}` },
          { index: right, color: COLORS.comparing, label: `${arr[right]}` },
        ],
        comparisons: [[largest, right]],
        swaps: [],
        sorted: [...sorted],
        stepDescription: `Comparing ${arr[largest]} (pos ${largest}) with right child ${arr[right]} (pos ${right})`,
      });

      if (arr[right] > arr[largest]) {
        largest = right;
      }
    }

    if (largest !== rootIdx) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: rootIdx, color: COLORS.swapping, label: `${arr[rootIdx]}` },
          { index: largest, color: COLORS.swapping, label: `${arr[largest]}` },
        ],
        comparisons: [],
        swaps: [[rootIdx, largest]],
        sorted: [...sorted],
        stepDescription: `Swapping ${arr[rootIdx]} (pos ${rootIdx}) with larger child ${arr[largest]} (pos ${largest})`,
      });

      const temp = arr[rootIdx];
      arr[rootIdx] = arr[largest];
      arr[largest] = temp;

      // Recursively heapify the affected subtree
      this.heapify(arr, heapSize, largest, sorted);
    }
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
