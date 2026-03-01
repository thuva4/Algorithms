import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class BucketSortVisualization implements AlgorithmVisualization {
  name = 'Bucket Sort';
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
      stepDescription: 'Initial array state',
    });

    if (n <= 1) {
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [0],
        stepDescription: 'Array is already sorted',
      });
      return this.steps[0];
    }

    const maxVal = Math.max(...arr);
    const minVal = Math.min(...arr);
    const bucketCount = Math.max(1, Math.floor(Math.sqrt(n)));
    const range = maxVal - minVal + 1;

    // Create buckets
    const buckets: number[][] = Array.from({ length: bucketCount }, () => []);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Creating ${bucketCount} buckets for range [${minVal}, ${maxVal}]`,
    });

    // Distribute elements into buckets
    for (let i = 0; i < n; i++) {
      const bucketIndex = Math.min(
        bucketCount - 1,
        Math.floor(((arr[i] - minVal) / range) * bucketCount)
      );
      buckets[bucketIndex].push(arr[i]);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `B${bucketIndex}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Placing ${arr[i]} into bucket ${bucketIndex}`,
      });
    }

    // Sort each bucket using insertion sort and show progress
    for (let b = 0; b < bucketCount; b++) {
      if (buckets[b].length <= 1) continue;

      const bucket = buckets[b];

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Sorting bucket ${b}: [${bucket.join(', ')}]`,
      });

      // Insertion sort on the bucket
      for (let i = 1; i < bucket.length; i++) {
        const key = bucket[i];
        let j = i - 1;
        while (j >= 0 && bucket[j] > key) {
          bucket[j + 1] = bucket[j];
          j--;
        }
        bucket[j + 1] = key;
      }

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Bucket ${b} sorted: [${bucket.join(', ')}]`,
      });
    }

    // Concatenate buckets back into array
    let idx = 0;
    const sorted: number[] = [];
    for (let b = 0; b < bucketCount; b++) {
      for (const val of buckets[b]) {
        arr[idx] = val;
        sorted.push(idx);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: idx, color: COLORS.sorted, label: `${val}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [...sorted],
          stepDescription: `Placing ${val} from bucket ${b} into position ${idx}`,
        });

        idx++;
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
