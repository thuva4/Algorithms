import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { pivot: '#ef4444', current: '#eab308', found: '#22c55e', partitioned: '#3b82f6' };

export class QuickSelectVisualization implements AlgorithmVisualization {
  name = 'Quick Select';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data];
    const k = Math.floor(arr.length / 2); // find median

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Quick Select: find the ${k + 1}th smallest element (k=${k})`,
    });

    this.quickSelect(arr, 0, arr.length - 1, k);
    return this.steps[0];
  }

  private quickSelect(arr: number[], lo: number, hi: number, k: number): void {
    if (lo >= hi) {
      if (lo === k) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: lo, color: COLORS.found, label: `k=${arr[lo]}` }],
          comparisons: [],
          swaps: [],
          sorted: [lo],
          stepDescription: `Found ${k + 1}th smallest element: ${arr[lo]} at index ${lo}`,
        });
      }
      return;
    }

    const pivotIdx = hi;
    const pivotVal = arr[pivotIdx];
    this.steps.push({
      data: [...arr],
      highlights: [{ index: pivotIdx, color: COLORS.pivot, label: `pivot=${pivotVal}` }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Partition [${lo},${hi}] with pivot ${pivotVal}`,
    });

    let i = lo;
    for (let j = lo; j < hi; j++) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: j, color: COLORS.current, label: `${arr[j]}` },
          { index: pivotIdx, color: COLORS.pivot, label: 'pivot' },
        ],
        comparisons: [[j, pivotIdx]],
        swaps: [],
        sorted: [],
        stepDescription: `Compare ${arr[j]} with pivot ${pivotVal}`,
      });

      if (arr[j] <= pivotVal) {
        if (i !== j) {
          [arr[i], arr[j]] = [arr[j], arr[i]];
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: i, color: COLORS.partitioned },
              { index: j, color: COLORS.partitioned },
            ],
            comparisons: [],
            swaps: [[i, j]],
            sorted: [],
            stepDescription: `Swap indices ${i} and ${j}`,
          });
        }
        i++;
      }
    }

    [arr[i], arr[hi]] = [arr[hi], arr[i]];
    this.steps.push({
      data: [...arr],
      highlights: [{ index: i, color: COLORS.pivot, label: `pivot@${i}` }],
      comparisons: [],
      swaps: [[i, hi]],
      sorted: [],
      stepDescription: `Pivot placed at index ${i}. Elements left are smaller, right are larger.`,
    });

    if (i === k) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: i, color: COLORS.found, label: `Found: ${arr[i]}` }],
        comparisons: [],
        swaps: [],
        sorted: [i],
        stepDescription: `Found ${k + 1}th smallest element: ${arr[i]}`,
      });
    } else if (k < i) {
      this.quickSelect(arr, lo, i - 1, k);
    } else {
      this.quickSelect(arr, i + 1, hi, k);
    }
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
