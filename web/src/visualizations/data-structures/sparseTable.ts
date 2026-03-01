import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  building: '#eab308',
  range: '#3b82f6',
  merging: '#22c55e',
  querying: '#8b5cf6',
  result: '#ef4444',
  computed: '#22c55e',
};

export class SparseTableVisualization implements AlgorithmVisualization {
  name = 'Sparse Table';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = data.length;
    const arr = [...data];
    const LOG = Math.floor(Math.log2(n)) + 1;

    // sparse[k][i] = min of arr[i..i+2^k-1]
    const sparse: number[][] = [];
    for (let k = 0; k < LOG; k++) {
      sparse.push(new Array(n).fill(Infinity));
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Sparse Table for Range Minimum Query. Array of ${n} elements. Building ${LOG} levels (k=0 to ${LOG - 1}). Level k covers ranges of size 2^k.`,
    });

    // Level 0: each element is its own minimum
    for (let i = 0; i < n; i++) {
      sparse[0][i] = arr[i];
    }

    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({ index: i, color: COLORS.computed, label: `${v}` })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Level 0 (k=0): ranges of size 2^0 = 1. Each sparse[0][i] = arr[i]. Trivially set.`,
    });

    // Build levels 1 through LOG-1
    for (let k = 1; k < LOG; k++) {
      const rangeSize = 1 << k;
      const halfRange = 1 << (k - 1);

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Building level ${k}: ranges of size 2^${k} = ${rangeSize}. sparse[${k}][i] = min(sparse[${k - 1}][i], sparse[${k - 1}][i + ${halfRange}]).`,
      });

      for (let i = 0; i + rangeSize <= n; i++) {
        const left = sparse[k - 1][i];
        const right = i + halfRange < n ? sparse[k - 1][i + halfRange] : Infinity;
        sparse[k][i] = Math.min(left, right);

        // Show a few merge steps in detail
        if (i < 3 || i === n - rangeSize) {
          const rangeHighlights: { index: number; color: string; label?: string }[] = [];
          for (let j = i; j < i + halfRange && j < n; j++) {
            rangeHighlights.push({ index: j, color: COLORS.range, label: j === i ? `${left}` : '' });
          }
          for (let j = i + halfRange; j < i + rangeSize && j < n; j++) {
            rangeHighlights.push({ index: j, color: COLORS.merging, label: j === i + halfRange ? `${right}` : '' });
          }

          this.steps.push({
            data: [...arr],
            highlights: rangeHighlights,
            comparisons: [[i, Math.min(i + halfRange, n - 1)]],
            swaps: [],
            sorted: [],
            stepDescription: `sparse[${k}][${i}] = min(sparse[${k - 1}][${i}]=${left}, sparse[${k - 1}][${i + halfRange}]=${right === Infinity ? 'INF' : right}) = ${sparse[k][i]}. Range [${i}, ${i + rangeSize - 1}].`,
          });
        }
      }

      // Show completed level
      const levelHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = 0; i + rangeSize <= n; i++) {
        levelHighlights.push({ index: i, color: COLORS.computed, label: `${sparse[k][i]}` });
      }

      this.steps.push({
        data: [...arr],
        highlights: levelHighlights,
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Level ${k} complete: ${Math.max(0, n - rangeSize + 1)} entries computed. Each entry is the minimum of a range of size ${rangeSize}.`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Sparse table built in O(n log n) time and space. Ready for O(1) range minimum queries.`,
    });

    // Demo queries
    const queries: [number, number][] = [];
    if (n >= 2) queries.push([0, Math.min(n - 1, 3)]);
    if (n >= 4) queries.push([1, Math.min(n - 1, n - 2)]);
    if (n >= 2) queries.push([0, n - 1]);

    for (const [l, r] of queries) {
      const len = r - l + 1;
      const k = Math.floor(Math.log2(len));
      const rangeSize = 1 << k;

      this.steps.push({
        data: [...arr],
        highlights: Array.from({ length: len }, (_, i) => ({
          index: l + i,
          color: COLORS.querying,
          label: `${arr[l + i]}`,
        })),
        comparisons: [[l, r]],
        swaps: [],
        sorted: [],
        stepDescription: `QUERY min(${l}, ${r}): range length = ${len}, k = floor(log2(${len})) = ${k}, 2^k = ${rangeSize}.`,
      });

      const leftVal = sparse[k][l];
      const rightVal = sparse[k][r - rangeSize + 1];
      const answer = Math.min(leftVal, rightVal);

      // Show the two overlapping ranges
      const leftHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = l; i < l + rangeSize && i < n; i++) {
        leftHighlights.push({ index: i, color: COLORS.range, label: i === l ? `min=${leftVal}` : '' });
      }
      const rightHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = r - rangeSize + 1; i <= r && i < n; i++) {
        rightHighlights.push({ index: i, color: COLORS.merging, label: i === r - rangeSize + 1 ? `min=${rightVal}` : '' });
      }

      this.steps.push({
        data: [...arr],
        highlights: [...leftHighlights, ...rightHighlights],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Query min(${l}, ${r}): overlap two ranges of size ${rangeSize}. sparse[${k}][${l}]=${leftVal}, sparse[${k}][${r - rangeSize + 1}]=${rightVal}. Answer = min(${leftVal}, ${rightVal}) = ${answer}. O(1) query!`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Sparse Table complete. O(n log n) build, O(1) query for idempotent operations (min, max, gcd). Not suitable for non-idempotent operations like sum.`,
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
