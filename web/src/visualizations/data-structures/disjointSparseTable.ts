import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  building: '#eab308',
  computing: '#3b82f6',
  range: '#22c55e',
  result: '#8b5cf6',
  block: '#ef4444',
};

export class DisjointSparseTableVisualization implements AlgorithmVisualization {
  name = 'Disjoint Sparse Table';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = data.length;
    const arr = [...data];

    // Pad to next power of 2
    let size = 1;
    while (size < n) size *= 2;
    while (arr.length < size) arr.push(0);

    const LOG = Math.max(1, Math.ceil(Math.log2(size)));

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Disjoint Sparse Table: array of ${n} elements, padded to ${size}. ${LOG} levels to build. Supports range minimum queries.`,
    });

    // Build the disjoint sparse table
    // table[level][i] stores prefix/suffix min for the block at that level
    const table: number[][] = [];
    for (let level = 0; level < LOG; level++) {
      table.push([...arr]);
    }

    // Level 0 is the raw array
    this.steps.push({
      data: [...arr],
      highlights: arr.map((_, i) => ({ index: i, color: COLORS.building, label: `${arr[i]}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Level 0: base array values. Each element is its own block.`,
    });

    for (let level = 1; level < LOG; level++) {
      const blockSize = 1 << level; // 2^level
      const halfBlock = blockSize >> 1;

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Building level ${level}: block size = ${blockSize}, half = ${halfBlock}. Computing suffix mins from midpoints leftward and prefix mins rightward.`,
      });

      for (let blockStart = 0; blockStart < size; blockStart += blockSize) {
        const mid = blockStart + halfBlock;

        // Suffix minimums going left from mid
        const suffixHighlights: { index: number; color: string; label?: string }[] = [];
        if (mid - 1 < size) {
          table[level][mid - 1] = arr[mid - 1];
          suffixHighlights.push({ index: mid - 1, color: COLORS.computing, label: `${arr[mid - 1]}` });
        }
        for (let i = mid - 2; i >= blockStart; i--) {
          table[level][i] = Math.min(table[level][i + 1], arr[i]);
          suffixHighlights.push({ index: i, color: COLORS.computing, label: `${table[level][i]}` });
        }

        if (suffixHighlights.length > 0) {
          this.steps.push({
            data: table[level].slice(0, arr.length < size ? arr.length : size),
            highlights: suffixHighlights,
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Level ${level}, block [${blockStart}-${blockStart + blockSize - 1}]: suffix mins from mid=${mid} leftward. Min values computed going left.`,
          });
        }

        // Prefix minimums going right from mid
        const prefixHighlights: { index: number; color: string; label?: string }[] = [];
        if (mid < size) {
          table[level][mid] = arr[mid];
          prefixHighlights.push({ index: mid, color: COLORS.range, label: `${arr[mid]}` });
        }
        for (let i = mid + 1; i < blockStart + blockSize && i < size; i++) {
          table[level][i] = Math.min(table[level][i - 1], arr[i]);
          prefixHighlights.push({ index: i, color: COLORS.range, label: `${table[level][i]}` });
        }

        if (prefixHighlights.length > 0) {
          this.steps.push({
            data: table[level].slice(0, arr.length < size ? arr.length : size),
            highlights: prefixHighlights,
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Level ${level}, block [${blockStart}-${blockStart + blockSize - 1}]: prefix mins from mid=${mid} rightward. Min values computed going right.`,
          });
        }
      }
    }

    // Demo some queries
    const queries: [number, number][] = [];
    if (n >= 2) queries.push([0, Math.min(n - 1, 3)]);
    if (n >= 4) queries.push([1, Math.min(n - 1, 5)]);
    if (n >= 3) queries.push([0, n - 1]);

    for (const [l, r] of queries) {
      if (l === r) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: l, color: COLORS.result, label: `min=${arr[l]}` }],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Query min(${l}, ${r}): single element, answer = ${arr[l]}.`,
        });
        continue;
      }

      // Find the level where l and r are in different halves
      const xor = l ^ r;
      let level = 0;
      if (xor > 0) {
        level = Math.floor(Math.log2(xor)) + 1;
        if (level >= LOG) level = LOG - 1;
      }

      const rangeHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = l; i <= r; i++) {
        rangeHighlights.push({ index: i, color: COLORS.range, label: `${arr[i]}` });
      }

      this.steps.push({
        data: [...arr],
        highlights: rangeHighlights,
        comparisons: [[l, r]],
        swaps: [],
        sorted: [],
        stepDescription: `Query min(${l}, ${r}): elements split at level ${level}. Suffix min from table covers left part, prefix min covers right part.`,
      });

      const leftMin = table[level] ? table[level][l] : arr[l];
      const rightMin = table[level] ? table[level][r] : arr[r];
      const answer = Math.min(leftMin, rightMin);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: l, color: COLORS.result, label: `sfx=${leftMin}` },
          { index: r, color: COLORS.result, label: `pfx=${rightMin}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Query min(${l}, ${r}): suffix min at ${l} = ${leftMin}, prefix min at ${r} = ${rightMin}. Answer = min(${leftMin}, ${rightMin}) = ${answer}. O(1) query time.`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Disjoint Sparse Table built in O(n log n) time and space. Each range minimum query answered in O(1).`,
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
