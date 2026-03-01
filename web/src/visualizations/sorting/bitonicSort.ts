import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class BitonicSortVisualization implements AlgorithmVisualization {
  name = 'Bitonic Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Bitonic sort requires power-of-2 length; pad if needed
    let n = 1;
    while (n < data.length) n *= 2;
    const arr = [...data];
    while (arr.length < n) arr.push(Infinity);

    const origLen = data.length;

    this.steps.push({
      data: arr.slice(0, origLen),
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: 'Initial array state',
    });

    const self = this;

    function compAndSwap(i: number, j: number, ascending: boolean) {
      const displayArr = arr.slice(0, origLen);

      // Comparison step
      if (i < origLen && j < origLen) {
        self.steps.push({
          data: [...displayArr],
          highlights: [
            { index: i, color: COLORS.comparing, label: `${arr[i]}` },
            { index: j, color: COLORS.comparing, label: `${arr[j]}` },
          ],
          comparisons: [[i, j]],
          swaps: [],
          sorted: [],
          stepDescription: `Comparing positions ${i} and ${j}: ${arr[i]} vs ${arr[j]} (${ascending ? 'ascending' : 'descending'})`,
        });
      }

      if ((ascending && arr[i] > arr[j]) || (!ascending && arr[i] < arr[j])) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        const newDisplay = arr.slice(0, origLen);
        if (i < origLen && j < origLen) {
          self.steps.push({
            data: [...newDisplay],
            highlights: [
              { index: i, color: COLORS.swapping, label: `${arr[i]}` },
              { index: j, color: COLORS.swapping, label: `${arr[j]}` },
            ],
            comparisons: [],
            swaps: [[i, j]],
            sorted: [],
            stepDescription: `Swapped positions ${i} and ${j}: now ${arr[i]} and ${arr[j]}`,
          });
        }
      }
    }

    function bitonicMerge(low: number, cnt: number, ascending: boolean) {
      if (cnt > 1) {
        const k = Math.floor(cnt / 2);
        for (let i = low; i < low + k; i++) {
          compAndSwap(i, i + k, ascending);
        }
        bitonicMerge(low, k, ascending);
        bitonicMerge(low + k, k, ascending);
      }
    }

    function bitonicSort(low: number, cnt: number, ascending: boolean) {
      if (cnt > 1) {
        const k = Math.floor(cnt / 2);
        bitonicSort(low, k, true);
        bitonicSort(low + k, k, false);

        if (low < origLen) {
          self.steps.push({
            data: arr.slice(0, origLen),
            highlights: Array.from({ length: Math.min(cnt, origLen - low) }, (_, idx) => ({
              index: low + idx,
              color: COLORS.current,
            })).filter(h => h.index < origLen),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Bitonic merge: merging ${ascending ? 'ascending' : 'descending'} sequence from index ${low} (length ${cnt})`,
          });
        }

        bitonicMerge(low, cnt, ascending);
      }
    }

    bitonicSort(0, n, true);

    // Final sorted state
    const allIndices = Array.from({ length: origLen }, (_, idx) => idx);
    this.steps.push({
      data: arr.slice(0, origLen),
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
