import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  sorted: '#22c55e',
  current: '#3b82f6',
  bucket: '#8b5cf6',
  placing: '#ef4444',
};

export class RadixSortVisualization implements AlgorithmVisualization {
  name = 'Radix Sort';
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

    // Find the maximum value to determine the number of digits
    const maxVal = Math.max(...arr);
    const maxDigits = maxVal > 0 ? Math.floor(Math.log10(maxVal)) + 1 : 1;

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Maximum value is ${maxVal}, which has ${maxDigits} digit(s). Processing from least significant to most significant digit.`,
    });

    let exp = 1;

    for (let digitPos = 0; digitPos < maxDigits; digitPos++) {
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Processing digit position ${digitPos} (${digitPos === 0 ? 'ones' : digitPos === 1 ? 'tens' : digitPos === 2 ? 'hundreds' : `10^${digitPos}`} place)`,
      });

      // Create buckets (0-9)
      const buckets: number[][] = Array.from({ length: 10 }, () => []);

      // Distribution phase: place elements into buckets based on current digit
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Distribution phase: sorting elements into buckets by digit at position ${digitPos}`,
      });

      for (let i = 0; i < n; i++) {
        const digit = Math.floor(arr[i] / exp) % 10;
        buckets[digit].push(arr[i]);

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.bucket, label: `d=${digit}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Element ${arr[i]} has digit ${digit} at position ${digitPos}, placing into bucket ${digit}. Bucket ${digit}: [${buckets[digit].join(', ')}]`,
        });
      }

      // Show bucket contents
      const bucketSummary = buckets
        .map((b, idx) => (b.length > 0 ? `B${idx}:[${b.join(',')}]` : null))
        .filter(Boolean)
        .join(' ');

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Buckets after distribution: ${bucketSummary}`,
      });

      // Collection phase: gather elements back from buckets
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Collection phase: gathering elements from buckets in order`,
      });

      let arrIdx = 0;
      for (let bucket = 0; bucket < 10; bucket++) {
        for (let j = 0; j < buckets[bucket].length; j++) {
          arr[arrIdx] = buckets[bucket][j];

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: arrIdx, color: COLORS.placing, label: `${arr[arrIdx]}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Placing ${arr[arrIdx]} from bucket ${bucket} at position ${arrIdx}`,
          });

          arrIdx++;
        }
      }

      // Show state after this digit pass
      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `After sorting by digit position ${digitPos}: [${arr.join(', ')}]`,
      });

      exp *= 10;
    }

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
