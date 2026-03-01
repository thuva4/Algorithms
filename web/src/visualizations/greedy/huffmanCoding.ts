import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { smallest: '#ef4444', secondSmallest: '#f97316', merged: '#22c55e', heap: '#3b82f6', done: '#8b5cf6' };

export class HuffmanCodingVisualization implements AlgorithmVisualization {
  name = 'Huffman Coding';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    // Use absolute values, ensure at least 2 elements, cap at 10 for readability
    const frequencies = data.slice(0, Math.min(data.length, 10)).map(v => Math.max(1, Math.abs(v)));
    if (frequencies.length < 2) {
      frequencies.push(1);
    }

    // Build a sorted min-heap simulation as an array
    const heap = [...frequencies].sort((a, b) => a - b);
    const n = heap.length;

    // Step 0: Show initial frequency table
    this.steps.push({
      data: [...heap],
      highlights: heap.map((_, i) => ({ index: i, color: COLORS.heap, label: `f=${heap[i]}` })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Huffman Coding: ${n} symbols with frequencies [${heap.join(', ')}]. Build optimal prefix code by merging smallest nodes.`,
    });

    let totalCost = 0;
    let mergeStep = 0;

    // Simulate Huffman tree construction
    while (heap.length > 1) {
      mergeStep++;
      const left = heap.shift()!;
      const right = heap.shift()!;

      // Show the two smallest being selected
      const selectData = [...heap];
      selectData.unshift(right);
      selectData.unshift(left);
      this.steps.push({
        data: selectData,
        highlights: [
          { index: 0, color: COLORS.smallest, label: `min1=${left}` },
          { index: 1, color: COLORS.secondSmallest, label: `min2=${right}` },
          ...selectData.slice(2).map((_, i) => ({ index: i + 2, color: COLORS.heap })),
        ],
        comparisons: [[0, 1]],
        swaps: [],
        sorted: [],
        stepDescription: `Merge #${mergeStep}: Extract two smallest nodes: ${left} and ${right}`,
      });

      const merged = left + right;
      totalCost += merged;

      // Insert merged value back in sorted position
      let insertIdx = 0;
      while (insertIdx < heap.length && heap[insertIdx] < merged) {
        insertIdx++;
      }
      heap.splice(insertIdx, 0, merged);

      // Show the merged result inserted back
      this.steps.push({
        data: [...heap],
        highlights: [
          { index: insertIdx, color: COLORS.merged, label: `${left}+${right}=${merged}` },
          ...heap.map((_, i) => i !== insertIdx ? { index: i, color: COLORS.heap } : null).filter(Boolean) as { index: number; color: string }[],
        ],
        comparisons: [],
        swaps: [],
        sorted: [insertIdx],
        stepDescription: `Merged node ${merged} (cost +${merged}). Total cost so far: ${totalCost}. Remaining nodes: ${heap.length}`,
      });
    }

    // Final step: show result
    this.steps.push({
      data: [...heap],
      highlights: [{ index: 0, color: COLORS.done, label: `Root=${heap[0]}` }],
      comparisons: [],
      swaps: [],
      sorted: [0],
      stepDescription: `Huffman tree complete. Total encoding cost: ${totalCost}. Root node: ${heap[0]}`,
    });

    return this.steps[0];
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
