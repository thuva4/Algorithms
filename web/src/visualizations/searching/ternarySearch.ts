import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { mid1: '#eab308', mid2: '#8b5cf6', found: '#22c55e', range: '#3b82f6', eliminated: '#94a3b8' };

export class TernarySearchVisualization implements AlgorithmVisualization {
  name = 'Ternary Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data].sort((a, b) => a - b);
    const n = arr.length;
    const target = arr[Math.floor(Math.random() * n)];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Ternary search for ${target} — divides search space into thirds`,
    });

    let lo = 0, hi = n - 1;
    while (lo <= hi) {
      const third = Math.floor((hi - lo) / 3);
      const m1 = lo + third;
      const m2 = hi - third;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: m1, color: COLORS.mid1, label: `m1=${arr[m1]}` },
          { index: m2, color: COLORS.mid2, label: `m2=${arr[m2]}` },
        ],
        comparisons: [[m1, m2]],
        swaps: [],
        sorted: [],
        stepDescription: `Range [${lo},${hi}]: m1=${m1}(${arr[m1]}), m2=${m2}(${arr[m2]}) vs target ${target}`,
      });

      if (arr[m1] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: m1, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [m1],
          stepDescription: `Found ${target} at index ${m1}!`,
        });
        return this.steps[0];
      }
      if (arr[m2] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: m2, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [m2],
          stepDescription: `Found ${target} at index ${m2}!`,
        });
        return this.steps[0];
      }

      if (target < arr[m1]) {
        hi = m1 - 1;
      } else if (target > arr[m2]) {
        lo = m2 + 1;
      } else {
        lo = m1 + 1;
        hi = m2 - 1;
      }
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Target ${target} not found`,
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
