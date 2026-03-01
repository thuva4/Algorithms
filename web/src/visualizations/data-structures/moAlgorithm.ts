import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  block: '#eab308',
  extending: '#22c55e',
  contracting: '#ef4444',
  currentRange: '#3b82f6',
  queryResult: '#8b5cf6',
  sorted: '#22c55e',
};

export class MoAlgorithmVisualization implements AlgorithmVisualization {
  name = "Mo's Algorithm";
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = data.length;
    const arr = [...data];
    const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));

    // Generate queries
    const numQueries = Math.min(6, Math.max(2, Math.floor(n / 2)));
    const queries: { l: number; r: number }[] = [];
    for (let i = 0; i < numQueries; i++) {
      const l = Math.floor(Math.random() * Math.floor(n / 2));
      const r = Math.min(n - 1, l + Math.floor(Math.random() * Math.floor(n / 2)) + 1);
      queries.push({ l, r });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Mo's Algorithm: ${numQueries} range sum queries on array of ${n} elements. Block size = floor(sqrt(${n})) = ${blockSize}.`,
    });

    // Show block decomposition
    const blockHighlights: { index: number; color: string; label?: string }[] = [];
    for (let i = 0; i < n; i++) {
      const block = Math.floor(i / blockSize);
      blockHighlights.push({
        index: i,
        color: block % 2 === 0 ? COLORS.block : COLORS.currentRange,
        label: `B${block}`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: blockHighlights,
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Array partitioned into blocks of size ${blockSize}. Queries will be sorted by block of left endpoint, then by right endpoint within each block.`,
    });

    // Sort queries using Mo's ordering
    const unsortedStr = queries.map(q => `[${q.l},${q.r}]`).join(', ');
    queries.sort((a, b) => {
      const blockA = Math.floor(a.l / blockSize);
      const blockB = Math.floor(b.l / blockSize);
      if (blockA !== blockB) return blockA - blockB;
      return blockA % 2 === 0 ? a.r - b.r : b.r - a.r;
    });
    const sortedStr = queries.map(q => `[${q.l},${q.r}]`).join(', ');

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Queries sorted by Mo's ordering. Before: ${unsortedStr}. After: ${sortedStr}.`,
    });

    // Process queries with current range [curL, curR]
    let curL = 0;
    let curR = -1;
    let currentSum = 0;
    let totalOps = 0;

    for (let qi = 0; qi < queries.length; qi++) {
      const { l, r } = queries[qi];

      this.steps.push({
        data: [...arr],
        highlights: [
          ...(curR >= curL ? Array.from({ length: curR - curL + 1 }, (_, i) => ({
            index: curL + i,
            color: COLORS.currentRange,
            label: `cur`,
          })) : []),
        ],
        comparisons: curR >= curL ? [[curL, curR]] : [],
        swaps: [],
        sorted: [],
        stepDescription: `Query ${qi + 1}: range [${l}, ${r}]. Current range: [${curL}, ${curR}]. Need to adjust endpoints.`,
      });

      // Extend/contract right
      let opsThisQuery = 0;
      while (curR < r) {
        curR++;
        currentSum += arr[curR];
        opsThisQuery++;
      }
      while (curR > r) {
        currentSum -= arr[curR];
        curR--;
        opsThisQuery++;
      }

      if (opsThisQuery > 0) {
        this.steps.push({
          data: [...arr],
          highlights: Array.from({ length: curR - curL + 1 }, (_, i) => ({
            index: curL + i,
            color: i === curR - curL ? COLORS.extending : COLORS.currentRange,
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Adjusted right endpoint to ${curR} (${opsThisQuery} ops). Current range: [${curL}, ${curR}].`,
        });
      }

      // Extend/contract left
      opsThisQuery = 0;
      while (curL < l) {
        currentSum -= arr[curL];
        curL++;
        opsThisQuery++;
      }
      while (curL > l) {
        curL--;
        currentSum += arr[curL];
        opsThisQuery++;
      }

      if (opsThisQuery > 0) {
        this.steps.push({
          data: [...arr],
          highlights: Array.from({ length: curR - curL + 1 }, (_, i) => ({
            index: curL + i,
            color: i === 0 ? COLORS.contracting : COLORS.currentRange,
          })),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Adjusted left endpoint to ${curL} (${opsThisQuery} ops). Current range: [${curL}, ${curR}].`,
        });
      }

      totalOps += Math.abs(l - curL) + Math.abs(r - curR);

      // Show query result
      const rangeHighlights = Array.from({ length: r - l + 1 }, (_, i) => ({
        index: l + i,
        color: COLORS.queryResult,
        label: `${arr[l + i]}`,
      }));

      this.steps.push({
        data: [...arr],
        highlights: rangeHighlights,
        comparisons: [[l, r]],
        swaps: [],
        sorted: [],
        stepDescription: `Query ${qi + 1} result: sum([${l}..${r}]) = ${currentSum}. Elements: [${arr.slice(l, r + 1).join(', ')}].`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Mo's Algorithm complete. ${queries.length} queries answered. Total pointer movements minimized by sorting. Complexity: O((n + q) * sqrt(n)).`,
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
