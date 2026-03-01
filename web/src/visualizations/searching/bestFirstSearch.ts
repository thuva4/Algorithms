import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', visited: '#22c55e', queued: '#3b82f6' };

export class BestFirstSearchVisualization implements AlgorithmVisualization {
  name = 'Best-First Search';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Represent heuristic values as bar heights; simulate priority-based exploration
    const arr = [...data];
    const n = arr.length;
    const visited: number[] = [];
    const target = Math.min(...arr);

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Best-first search: exploring nodes by heuristic value (lower = better). Target: minimum value ${target}`,
    });

    // Simple priority queue using sorted array
    const pq: number[] = [0]; // start from index 0
    const inQueue = new Set<number>([0]);

    while (pq.length > 0) {
      // Pick the one with smallest heuristic
      pq.sort((a, b) => arr[a] - arr[b]);
      const curr = pq.shift()!;

      this.steps.push({
        data: [...arr],
        highlights: [
          { index: curr, color: COLORS.current, label: `h=${arr[curr]}` },
          ...visited.map(v => ({ index: v, color: COLORS.visited })),
          ...pq.map(q => ({ index: q, color: COLORS.queued })),
        ],
        comparisons: [],
        swaps: [],
        sorted: [...visited],
        stepDescription: `Visiting node ${curr} (heuristic=${arr[curr]}), queue size=${pq.length}`,
      });

      visited.push(curr);

      if (arr[curr] === target) {
        this.steps.push({
          data: [...arr],
          highlights: [{ index: curr, color: '#22c55e', label: 'Goal!' }],
          comparisons: [],
          swaps: [],
          sorted: [...visited],
          stepDescription: `Found goal node ${curr} with heuristic value ${arr[curr]}!`,
        });
        return this.steps[0];
      }

      // Add neighbors (adjacent indices)
      for (const next of [curr - 1, curr + 1]) {
        if (next >= 0 && next < n && !inQueue.has(next) && !visited.includes(next)) {
          pq.push(next);
          inQueue.add(next);
        }
      }
    }

    this.steps.push({
      data: [...arr],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [...visited],
      stepDescription: 'Search complete',
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
