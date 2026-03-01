import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class PartialSortVisualization implements AlgorithmVisualization {
  name = 'Partial Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    // Partial sort: sort the first k elements (we use k = ceil(n/2) for a meaningful visualization)
    const k = Math.max(1, Math.ceil(n / 2));
    const sorted: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Initial array state. Partial sort will place the ${k} smallest elements in sorted order.`,
    });

    // Build a max-heap of size k from the first k elements
    function siftDown(heap: number[], i: number, heapSize: number) {
      while (true) {
        let largest = i;
        const left = 2 * i + 1;
        const right = 2 * i + 2;

        if (left < heapSize && heap[left] > heap[largest]) largest = left;
        if (right < heapSize && heap[right] > heap[largest]) largest = right;

        if (largest !== i) {
          const temp = heap[i];
          heap[i] = heap[largest];
          heap[largest] = temp;
          i = largest;
        } else {
          break;
        }
      }
    }

    // Build initial max-heap from first k elements
    this.steps.push({
      data: [...arr],
      highlights: Array.from({ length: k }, (_, i) => ({
        index: i,
        color: COLORS.current,
        label: 'heap',
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Building max-heap from first ${k} elements: [${arr.slice(0, k).join(', ')}]`,
    });

    for (let i = Math.floor(k / 2) - 1; i >= 0; i--) {
      siftDown(arr, i, k);
    }

    this.steps.push({
      data: [...arr],
      highlights: [
        { index: 0, color: COLORS.current, label: `max=${arr[0]}` },
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Max-heap built. Heap top (maximum) = ${arr[0]}`,
    });

    // Process remaining elements
    for (let i = k; i < n; i++) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: 0, color: COLORS.current, label: `max=${arr[0]}` },
          { index: i, color: COLORS.comparing, label: `${arr[i]}` },
        ],
        comparisons: [[0, i]],
        swaps: [],
        sorted: [],
        stepDescription: `Comparing heap max ${arr[0]} with element ${arr[i]} at position ${i}`,
      });

      if (arr[i] < arr[0]) {
        // Replace heap root with this smaller element
        const old = arr[0];
        arr[0] = arr[i];
        arr[i] = old;

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: 0, color: COLORS.swapping, label: `${arr[0]}` },
            { index: i, color: COLORS.swapping, label: `${arr[i]}` },
          ],
          comparisons: [],
          swaps: [[0, i]],
          sorted: [],
          stepDescription: `${arr[0]} < ${arr[i]}: replaced heap max, now sifting down`,
        });

        siftDown(arr, 0, k);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: 0, color: COLORS.current, label: `max=${arr[0]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Heap restored. New max = ${arr[0]}`,
        });
      }
    }

    // Now sort the heap in ascending order (heapsort on first k elements)
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Heap contains the ${k} smallest elements. Now sorting them in ascending order.`,
    });

    for (let heapSize = k; heapSize > 1; heapSize--) {
      // Swap root with last element in heap
      const temp = arr[0];
      arr[0] = arr[heapSize - 1];
      arr[heapSize - 1] = temp;

      sorted.push(heapSize - 1);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: 0, color: COLORS.swapping, label: `${arr[0]}` },
          { index: heapSize - 1, color: COLORS.sorted, label: `${arr[heapSize - 1]}` },
        ],
        comparisons: [],
        swaps: [[0, heapSize - 1]],
        sorted: [...sorted],
        stepDescription: `Moved ${arr[heapSize - 1]} to position ${heapSize - 1}`,
      });

      siftDown(arr, 0, heapSize - 1);
    }

    if (!sorted.includes(0)) sorted.push(0);

    // Final state
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: k }, (_, i) => i),
      stepDescription: `Partial sort complete: first ${k} positions contain the ${k} smallest elements in sorted order`,
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
