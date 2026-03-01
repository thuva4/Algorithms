import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = {
  current: '#3b82f6',
  random: '#eab308',
  swapping: '#ef4444',
  locked: '#22c55e',
  result: '#a855f7',
};

export class FisherYatesShuffleVisualization implements AlgorithmVisualization {
  name = 'Fisher-Yates Shuffle';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;

    const arr = data.length >= 3 ? [...data.slice(0, Math.min(data.length, 12))] : [1, 2, 3, 4, 5, 6, 7, 8];
    const n = arr.length;

    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({
        index: i,
        color: COLORS.current,
        label: `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Fisher-Yates shuffle: randomly permute [${arr.join(', ')}] in-place. Starting from the end.`,
    });

    // Use a seeded pseudo-random for reproducibility based on data
    let seed = arr.reduce((a, b) => a + b, 0) + 42;
    const pseudoRandom = (): number => {
      seed = (seed * 1103515245 + 12345) & 0x7fffffff;
      return seed / 0x7fffffff;
    };

    // Fisher-Yates: iterate from n-1 down to 1
    for (let i = n - 1; i > 0; i--) {
      // Pick random j in [0, i]
      const j = Math.floor(pseudoRandom() * (i + 1));

      // Show the random selection
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `pos=${i}` },
          { index: j, color: COLORS.random, label: `rand=${j}` },
        ],
        comparisons: [[i, j]],
        swaps: [],
        sorted: Array.from({ length: n - 1 - i }, (_, k) => n - 1 - k),
        stepDescription: `i=${i}: randomly selected j=${j} from [0..${i}]. Will swap arr[${i}]=${arr[i]} with arr[${j}]=${arr[j]}`,
      });

      // Perform the swap
      if (i !== j) {
        const temp = arr[i];
        arr[i] = arr[j];
        arr[j] = temp;

        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.swapping, label: `${arr[i]}` },
            { index: j, color: COLORS.swapping, label: `${arr[j]}` },
          ],
          comparisons: [],
          swaps: [[i, j]],
          sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
          stepDescription: `Swapped positions ${i} and ${j}: arr[${i}]=${arr[i]}, arr[${j}]=${arr[j]}`,
        });
      } else {
        this.steps.push({
          data: [...arr],
          highlights: [
            { index: i, color: COLORS.locked, label: `${arr[i]} (stays)` },
          ],
          comparisons: [],
          swaps: [],
          sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
          stepDescription: `i=${i}: j=${j} same as i, no swap needed. arr[${i}]=${arr[i]} stays.`,
        });
      }

      // Show the element is now in its final shuffled position
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.locked, label: `locked` },
        ],
        comparisons: [],
        swaps: [],
        sorted: Array.from({ length: n - i }, (_, k) => n - 1 - k),
        stepDescription: `Position ${i} is finalized with value ${arr[i]}. ${i - 1} positions remain.`,
      });
    }

    // Final result
    this.steps.push({
      data: [...arr],
      highlights: arr.map((v, i) => ({
        index: i,
        color: COLORS.result,
        label: `${v}`,
      })),
      comparisons: [],
      swaps: [],
      sorted: Array.from({ length: n }, (_, i) => i),
      stepDescription: `Shuffle complete! Result: [${arr.join(', ')}]. Each permutation had equal probability.`,
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
