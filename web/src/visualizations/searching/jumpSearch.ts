import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { jump: '#8b5cf6', linear: '#eab308', found: '#22c55e', checked: '#94a3b8' };

export class JumpSearchVisualization implements AlgorithmVisualization {
  name = 'Jump Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const arr = [...data].sort((a, b) => a - b);
    const n = arr.length;
    const target = arr[Math.floor(Math.random() * n)];
    const jumpSize = Math.floor(Math.sqrt(n));

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Jump search for ${target}, jump size = ${jumpSize}`,
    });

    let prev = 0;
    let curr = jumpSize;

    // Jump phase
    while (curr < n && arr[curr] < target) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: curr, color: COLORS.jump, label: `Jump: ${arr[curr]}` }],
        comparisons: [[prev, curr]],
        swaps: [],
        sorted: [],
        stepDescription: `Jump to index ${curr}: ${arr[curr]} < ${target}, continue jumping`,
      });
      prev = curr;
      curr += jumpSize;
    }

    if (curr >= n) curr = n - 1;
    this.steps.push({
      data: [...arr],
      highlights: [{ index: curr, color: COLORS.jump, label: `Stop: ${arr[curr]}` }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Stopped at index ${curr}: ${arr[curr]} >= ${target}. Linear search in [${prev}, ${curr}]`,
    });

    // Linear search phase
    for (let i = prev; i <= curr && i < n; i++) {
      this.steps.push({
        data: [...arr],
        highlights: [{ index: i, color: COLORS.linear, label: `${arr[i]}` }],
        comparisons: [[i, i]],
        swaps: [],
        sorted: [],
        stepDescription: `Linear check index ${i}: ${arr[i]} ${arr[i] === target ? '==' : '!='} ${target}`,
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
