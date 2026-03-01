import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

const MIN_RUN = 4; // Small minrun for visualization clarity

export class TimSortVisualization implements AlgorithmVisualization {
  name = 'Tim Sort';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = [...data];
    const n = arr.length;
    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Initial array state. Tim Sort with minRun = ${MIN_RUN}`,
    });

    const self = this;

    // Insertion sort on a subarray
    function insertionSort(left: number, right: number) {
      self.steps.push({
        data: [...arr],
        highlights: Array.from({ length: right - left + 1 }, (_, i) => ({
          index: left + i,
          color: COLORS.current,
        })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Insertion sort on run [${left}..${right}]`,
      });

      for (let i = left + 1; i <= right; i++) {
        const key = arr[i];
        let j = i - 1;

        self.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.current, label: `key=${key}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Inserting ${key} at position ${i} into sorted portion`,
        });

        while (j >= left && arr[j] > key) {
          self.steps.push({
            data: [...arr],
            highlights: [
              { index: j, color: COLORS.comparing, label: `${arr[j]}` },
              { index: j + 1, color: COLORS.current, label: `key=${key}` },
            ],
            comparisons: [[j, j + 1]],
            swaps: [],
            sorted: [],
            stepDescription: `${arr[j]} > ${key}: shifting ${arr[j]} right`,
          });

          arr[j + 1] = arr[j];
          j--;
        }
        arr[j + 1] = key;

        if (j + 1 !== i) {
          self.steps.push({
            data: [...arr],
            highlights: [
              { index: j + 1, color: COLORS.sorted, label: `${key}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Placed ${key} at position ${j + 1}`,
          });
        }
      }
    }

    // Merge two sorted subarrays
    function merge(left: number, mid: number, right: number) {
      const leftArr = arr.slice(left, mid + 1);
      const rightArr = arr.slice(mid + 1, right + 1);

      self.steps.push({
        data: [...arr],
        highlights: [
          ...Array.from({ length: mid - left + 1 }, (_, i) => ({
            index: left + i,
            color: COLORS.current,
          })),
          ...Array.from({ length: right - mid }, (_, i) => ({
            index: mid + 1 + i,
            color: COLORS.comparing,
          })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Merging runs [${left}..${mid}] and [${mid + 1}..${right}]`,
      });

      let i = 0;
      let j = 0;
      let k = left;

      while (i < leftArr.length && j < rightArr.length) {
        if (leftArr[i] <= rightArr[j]) {
          arr[k] = leftArr[i];
          i++;
        } else {
          arr[k] = rightArr[j];
          j++;
        }

        self.steps.push({
          data: [...arr],
          highlights: [
            { index: k, color: COLORS.sorted, label: `${arr[k]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Merge: placed ${arr[k]} at position ${k}`,
        });

        k++;
      }

      while (i < leftArr.length) {
        arr[k] = leftArr[i];
        self.steps.push({
          data: [...arr],
          highlights: [
            { index: k, color: COLORS.sorted, label: `${arr[k]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Merge: placed remaining ${arr[k]} at position ${k}`,
        });
        i++;
        k++;
      }

      while (j < rightArr.length) {
        arr[k] = rightArr[j];
        self.steps.push({
          data: [...arr],
          highlights: [
            { index: k, color: COLORS.sorted, label: `${arr[k]}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Merge: placed remaining ${arr[k]} at position ${k}`,
        });
        j++;
        k++;
      }
    }

    // Step 1: Sort individual runs using insertion sort
    for (let i = 0; i < n; i += MIN_RUN) {
      const right = Math.min(i + MIN_RUN - 1, n - 1);
      insertionSort(i, right);

      self.steps.push({
        data: [...arr],
        highlights: Array.from({ length: right - i + 1 }, (_, idx) => ({
          index: i + idx,
          color: COLORS.sorted,
        })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Run [${i}..${right}] sorted: [${arr.slice(i, right + 1).join(', ')}]`,
      });
    }

    // Step 2: Merge runs, doubling size each iteration
    for (let size = MIN_RUN; size < n; size *= 2) {
      self.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Merge pass: merging runs of size ${size}`,
      });

      for (let left = 0; left < n; left += 2 * size) {
        const mid = Math.min(left + size - 1, n - 1);
        const right = Math.min(left + 2 * size - 1, n - 1);

        if (mid < right) {
          merge(left, mid, right);
        }
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
