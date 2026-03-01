import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  block: '#eab308',
  blockAlt: '#3b82f6',
  querying: '#8b5cf6',
  partial: '#ef4444',
  fullBlock: '#22c55e',
  result: '#22c55e',
  updating: '#f97316',
};

export class SqrtDecompositionVisualization implements AlgorithmVisualization {
  name = 'Sqrt Decomposition';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const n = data.length;
    const arr = [...data];
    const blockSize = Math.max(1, Math.floor(Math.sqrt(n)));
    const numBlocks = Math.ceil(n / blockSize);
    const blockSums: number[] = new Array(numBlocks).fill(0);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Sqrt Decomposition: array of ${n} elements. Block size = floor(sqrt(${n})) = ${blockSize}. Number of blocks = ${numBlocks}.`,
    });

    // Build block sums
    for (let b = 0; b < numBlocks; b++) {
      const start = b * blockSize;
      const end = Math.min(start + blockSize, n);
      let sum = 0;

      const blockHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = start; i < end; i++) {
        sum += arr[i];
        blockHighlights.push({
          index: i,
          color: b % 2 === 0 ? COLORS.block : COLORS.blockAlt,
          label: `B${b}`,
        });
      }
      blockSums[b] = sum;

      this.steps.push({
        data: [...arr],
        highlights: blockHighlights,
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Block ${b}: indices [${start}, ${end - 1}], elements [${arr.slice(start, end).join(', ')}], sum = ${sum}.`,
      });
    }

    // Show all blocks
    const allBlockHighlights: { index: number; color: string; label?: string }[] = [];
    for (let i = 0; i < n; i++) {
      const b = Math.floor(i / blockSize);
      allBlockHighlights.push({
        index: i,
        color: b % 2 === 0 ? COLORS.block : COLORS.blockAlt,
        label: i === b * blockSize ? `B${b}:${blockSums[b]}` : '',
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: allBlockHighlights,
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Decomposition complete. Block sums: [${blockSums.join(', ')}]. Total: ${blockSums.reduce((a, b) => a + b, 0)}. O(n) build time.`,
    });

    // RANGE SUM QUERIES
    const queries: [number, number][] = [];
    if (n >= 2) queries.push([0, n - 1]); // full range
    if (n >= 4) queries.push([1, Math.min(n - 1, blockSize + 2)]); // spans partial blocks
    if (n >= 3) queries.push([blockSize - 1, Math.min(n - 1, blockSize * 2)]); // cross block boundary

    for (const [l, r] of queries) {
      const leftBlock = Math.floor(l / blockSize);
      const rightBlock = Math.floor(r / blockSize);

      this.steps.push({
        data: [...arr],
        highlights: Array.from({ length: r - l + 1 }, (_, i) => ({
          index: l + i,
          color: COLORS.querying,
        })),
        comparisons: [[l, r]],
        swaps: [],
        sorted: [],
        stepDescription: `QUERY sum(${l}, ${r}): left block = ${leftBlock}, right block = ${rightBlock}.`,
      });

      let totalSum = 0;
      const queryHighlights: { index: number; color: string; label?: string }[] = [];

      if (leftBlock === rightBlock) {
        // Same block: iterate
        for (let i = l; i <= r; i++) {
          totalSum += arr[i];
          queryHighlights.push({ index: i, color: COLORS.partial, label: `${arr[i]}` });
        }

        this.steps.push({
          data: [...arr],
          highlights: queryHighlights,
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Same block: iterate from ${l} to ${r}. Sum = ${totalSum}. O(sqrt(n)) partial block scan.`,
        });
      } else {
        // Left partial block
        const leftEnd = (leftBlock + 1) * blockSize - 1;
        for (let i = l; i <= leftEnd; i++) {
          totalSum += arr[i];
          queryHighlights.push({ index: i, color: COLORS.partial, label: `${arr[i]}` });
        }

        this.steps.push({
          data: [...arr],
          highlights: [...queryHighlights],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Left partial block ${leftBlock}: indices [${l}, ${leftEnd}], partial sum = ${totalSum}. Individual elements scanned.`,
        });

        // Full blocks in the middle
        for (let b = leftBlock + 1; b < rightBlock; b++) {
          totalSum += blockSums[b];
          const start = b * blockSize;
          const end = Math.min(start + blockSize, n);
          for (let i = start; i < end; i++) {
            queryHighlights.push({ index: i, color: COLORS.fullBlock, label: i === start ? `B${b}:${blockSums[b]}` : '' });
          }
        }

        if (rightBlock - leftBlock > 1) {
          this.steps.push({
            data: [...arr],
            highlights: queryHighlights.filter(h => h.color === COLORS.fullBlock),
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Full blocks ${leftBlock + 1} to ${rightBlock - 1}: use precomputed sums. Running total = ${totalSum}. O(1) per block.`,
          });
        }

        // Right partial block
        const rightStart = rightBlock * blockSize;
        for (let i = rightStart; i <= r; i++) {
          totalSum += arr[i];
          queryHighlights.push({ index: i, color: COLORS.partial, label: `${arr[i]}` });
        }

        this.steps.push({
          data: [...arr],
          highlights: queryHighlights.filter(h => h.color === COLORS.partial && h.index !== undefined && h.index >= rightStart),
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Right partial block ${rightBlock}: indices [${rightStart}, ${r}], partial elements summed.`,
        });
      }

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: l, color: COLORS.result, label: `L=${l}` },
          { index: r, color: COLORS.result, label: `R=${r}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Query result: sum(${l}, ${r}) = ${totalSum}. Query time: O(sqrt(n)).`,
      });
    }

    // POINT UPDATE
    if (n > 0) {
      const updateIdx = Math.min(2, n - 1);
      const oldVal = arr[updateIdx];
      const newVal = oldVal + 10;
      const block = Math.floor(updateIdx / blockSize);

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: updateIdx, color: COLORS.updating, label: `${oldVal}->${newVal}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `POINT UPDATE: arr[${updateIdx}] = ${oldVal} -> ${newVal}. Update block ${block} sum: ${blockSums[block]} -> ${blockSums[block] + (newVal - oldVal)}. O(1) update.`,
      });

      blockSums[block] += (newVal - oldVal);
      arr[updateIdx] = newVal;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: updateIdx, color: COLORS.result, label: `${newVal}` },
        ],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Updated arr[${updateIdx}] = ${newVal}. Block ${block} sum = ${blockSums[block]}. O(1) point update.`,
      });
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Sqrt decomposition complete. Build: O(n), Query: O(sqrt(n)), Update: O(1). Simple and effective for moderate-size arrays.`,
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
