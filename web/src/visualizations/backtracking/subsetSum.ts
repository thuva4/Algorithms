import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { included: '#22c55e', trying: '#eab308', excluded: '#94a3b8', found: '#3b82f6' };

export class SubsetSumVisualization implements AlgorithmVisualization {
  name = 'Subset Sum';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = data.slice(0, Math.min(data.length, 8));
    const target = Math.floor(arr.reduce((a, b) => a + b, 0) / 2);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Find subset of [${arr.join(', ')}] that sums to ${target}`,
    });

    this.solve(arr, target, 0, [], 0);
    return this.steps[0];
  }

  private solve(arr: number[], target: number, idx: number, current: number[], sum: number): boolean {
    if (sum === target && current.length > 0) {
      this.steps.push({
        data: [...arr],
        highlights: current.map(i => ({ index: i, color: COLORS.found, label: `${arr[i]}` })),
        comparisons: [],
        swaps: [],
        sorted: [...current],
        stepDescription: `Solution found! Subset [${current.map(i => arr[i]).join('+')}] = ${target}`,
      });
      return true;
    }

    if (idx >= arr.length || sum > target) return false;

    // Include current element
    this.steps.push({
      data: [...arr],
      highlights: [
        { index: idx, color: COLORS.trying, label: `+${arr[idx]}` },
        ...current.map(i => ({ index: i, color: COLORS.included })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Include ${arr[idx]} (sum=${sum + arr[idx]}, target=${target})`,
    });

    if (this.solve(arr, target, idx + 1, [...current, idx], sum + arr[idx])) return true;

    // Exclude current element
    this.steps.push({
      data: [...arr],
      highlights: [
        { index: idx, color: COLORS.excluded, label: `-${arr[idx]}` },
        ...current.map(i => ({ index: i, color: COLORS.included })),
      ],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Exclude ${arr[idx]}, backtrack (sum=${sum})`,
    });

    return this.solve(arr, target, idx + 1, current, sum);
  }

  step(): VisualizationState | null {
    this.currentStepIndex++;
    return this.currentStepIndex < this.steps.length ? this.steps[this.currentStepIndex] : null;
  }
  reset(): void { this.currentStepIndex = -1; }
  getStepCount(): number { return this.steps.length; }
  getCurrentStep(): number { return this.currentStepIndex; }
}
