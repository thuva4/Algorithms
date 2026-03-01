import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  comparing: '#eab308',
  swapping: '#ef4444',
  sorted: '#22c55e',
  current: '#3b82f6',
  gap: '#8b5cf6',
};

export class ShellSortVisualization implements AlgorithmVisualization {
  name = 'Shell Sort';
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

    // Generate gap sequence (Knuth's sequence: 1, 4, 13, 40, ...)
    const gaps: number[] = [];
    let gap = 1;
    while (gap < Math.floor(n / 3)) {
      gaps.push(gap);
      gap = gap * 3 + 1;
    }
    gaps.push(gap);
    gaps.reverse();

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Using gap sequence: [${gaps.join(', ')}]`,
    });

    for (const currentGap of gaps) {
      // Highlight the gap-sorted subarrays
      const gapHighlights: { index: number; color: string; label?: string }[] = [];
      for (let i = 0; i < currentGap && i < n; i++) {
        gapHighlights.push({ index: i, color: COLORS.gap, label: `g=${currentGap}` });
      }

      this.steps.push({
        data: [...arr],
        highlights: gapHighlights,
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Starting pass with gap = ${currentGap}`,
      });

      // Perform gapped insertion sort
      for (let i = currentGap; i < n; i++) {
        const key = arr[i];
        let j = i;

        // Show current element being inserted
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.current, label: `key=${key}` },
          ],
          comparisons: [],
          swaps: [],
          sorted: [],
          stepDescription: `Gap ${currentGap}: inserting element ${key} at position ${i} into its gap-sorted subarray`,
        });

        while (j >= currentGap && arr[j - currentGap] > key) {
          // Comparison step
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: j - currentGap, color: COLORS.comparing, label: `${arr[j - currentGap]}` },
              { index: j, color: COLORS.current, label: `key=${key}` },
            ],
            comparisons: [[j - currentGap, j]],
            swaps: [],
            sorted: [],
            stepDescription: `Gap ${currentGap}: comparing ${arr[j - currentGap]} (pos ${j - currentGap}) with key ${key}: ${arr[j - currentGap]} > ${key}, shifting`,
          });

          // Shift element
          arr[j] = arr[j - currentGap];

          this.steps.push({
            data: [...arr],
            highlights: [
              { index: j, color: COLORS.swapping, label: `${arr[j]}` },
              { index: j - currentGap, color: COLORS.swapping },
            ],
            comparisons: [],
            swaps: [[j - currentGap, j]],
            sorted: [],
            stepDescription: `Gap ${currentGap}: shifted ${arr[j]} from position ${j - currentGap} to position ${j}`,
          });

          j -= currentGap;
        }

        if (j >= currentGap) {
          // Comparison that stops the inner loop
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: j - currentGap, color: COLORS.comparing, label: `${arr[j - currentGap]}` },
              { index: j, color: COLORS.current, label: `key=${key}` },
            ],
            comparisons: [[j - currentGap, j]],
            swaps: [],
            sorted: [],
            stepDescription: `Gap ${currentGap}: comparing ${arr[j - currentGap]} (pos ${j - currentGap}) with key ${key}: ${arr[j - currentGap]} <= ${key}, stop`,
          });
        }

        // Place key
        arr[j] = key;

        if (j !== i) {
          this.steps.push({
            data: [...arr],
            highlights: [
              { index: j, color: COLORS.sorted, label: `${key}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [],
            stepDescription: `Gap ${currentGap}: placed key ${key} at position ${j}`,
          });
        }
      }

      this.steps.push({
        data: [...arr],
        highlights: [],
        comparisons: [],
        swaps: [],
        sorted: [],
        stepDescription: `Completed pass with gap ${currentGap}: [${arr.join(', ')}]`,
      });
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
