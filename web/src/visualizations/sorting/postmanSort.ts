import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
};

export class PostmanSortVisualization implements AlgorithmVisualization {
  name = 'Postman Sort';
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
        sorted: n === 1 ? [0] : [],
        stepDescription: 'Array is already sorted',
      });
      return this.steps[0];
    }

    // Postman sort (digit-based bucket sort, MSD radix sort variant)
    // Find max to determine number of digits
    const maxVal = Math.max(...arr);
    const maxDigits = maxVal > 0 ? Math.floor(Math.log10(maxVal)) + 1 : 1;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Maximum value: ${maxVal}, processing ${maxDigits} digit position(s) from most significant to least`,
    });

    // MSD radix sort approach
    function getDigit(num: number, digitPos: number): number {
      return Math.floor(num / Math.pow(10, digitPos)) % 10;
    }

    const self = this;

    function postmanSortRange(start: number, end: number, digitPos: number) {
      if (start >= end || digitPos < 0) return;

      self.steps.push({
        data: [...arr],
        highlights: Array.from({ length: end - start + 1 }, (_, i) => ({
          index: start + i,
          color: COLORS.current,
        })),
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Sorting range [${start}..${end}] by digit position ${digitPos} (${Math.pow(10, digitPos)}s place)`,
      });

      // Count occurrences of each digit
      const buckets: number[][] = Array.from({ length: 10 }, () => []);

      for (let i = start; i <= end; i++) {
        const digit = getDigit(arr[i], digitPos);
        buckets[digit].push(arr[i]);

        self.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.comparing, label: `d${digitPos}=${digit}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Element ${arr[i]}: digit at position ${digitPos} is ${digit}, placing in bucket ${digit}`,
        });
      }

      // Collect back from buckets
      let idx = start;
      const ranges: [number, number][] = [];

      for (let d = 0; d < 10; d++) {
        if (buckets[d].length > 0) {
          const rangeStart = idx;
          for (const val of buckets[d]) {
            arr[idx] = val;

            self.steps.push({
              data: [...arr],
              highlights: [
                { index: idx, color: COLORS.sorted, label: `${val}` },
              ],
              comparisons: [],
              swaps: [],
              sorted: [],
              stepDescription: `Collecting ${val} from digit-${d} bucket into position ${idx}`,
            });

            idx++;
          }
          ranges.push([rangeStart, idx - 1]);
        }
      }

      // Recurse on sub-ranges for next digit position
      if (digitPos > 0) {
        for (const [rs, re] of ranges) {
          if (rs < re) {
            postmanSortRange(rs, re, digitPos - 1);
          }
        }
      }
    }

    postmanSortRange(0, n - 1, maxDigits - 1);

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
