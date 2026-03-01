import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', found: '#22c55e', checked: '#94a3b8' };

export class LinearSearchVisualization implements AlgorithmVisualization {
  name = 'Linear Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data];
    const target = arr[Math.floor(Math.random() * arr.length)];
    const checked: number[] = [];

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Searching for target value ${target} in array`,
    });

    for (let i = 0; i < arr.length; i++) {
      this.steps.push({
        data: [...arr],
        highlights: [
          { index: i, color: COLORS.current, label: `Check ${arr[i]}` },
          ...checked.map(c => ({ index: c, color: COLORS.checked })),
        ],
        comparisons: [[i, i] as [number, number]],
        swaps: [],
        sorted: [],
        stepDescription: `Checking index ${i}: ${arr[i]} ${arr[i] === target ? '== ' : '!= '}${target}`,
      });

      if (arr[i] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: i, color: COLORS.found, label: 'Found!' }],
          comparisons: [],
          swaps: [],
          sorted: [i],
          stepDescription: `Found ${target} at index ${i}!`,
        });
        return this.steps[0];
      }
      checked.push(i);
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Target ${target} not found in array`,
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
