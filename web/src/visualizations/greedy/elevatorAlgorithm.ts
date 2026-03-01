import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', visited: '#22c55e', pending: '#3b82f6', direction: '#8b5cf6' };

export class ElevatorAlgorithmVisualization implements AlgorithmVisualization {
  name = 'Elevator Algorithm (SCAN)';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    const requests = [...data].map(v => Math.abs(v) % 100);
    const n = requests.length;
    let head = requests[0] || 50;
    const queue = requests.slice(1);

    this.steps.push({
      data: [...requests],
      highlights: [{ index: 0, color: COLORS.current, label: `Head=${head}` }],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `SCAN (Elevator): head at ${head}, requests at [${queue.join(', ')}]`,
    });

    // Sort and split into two directions
    const sorted = [...queue].sort((a, b) => a - b);
    const goingUp = sorted.filter(r => r >= head);
    const goingDown = sorted.filter(r => r < head).reverse();

    const order = [...goingUp, ...goingDown];
    const visited: number[] = [];
    let totalSeek = 0;

    for (const target of order) {
      const seek = Math.abs(target - head);
      totalSeek += seek;
      const idx = requests.indexOf(target);

      this.steps.push({
        data: [...requests],
        highlights: [
          ...(idx >= 0 ? [{ index: idx, color: COLORS.current, label: `->${target}` }] : []),
          ...visited.map(v => {
            const vi = requests.indexOf(v);
            return vi >= 0 ? { index: vi, color: COLORS.visited } : null;
          }).filter(Boolean) as { index: number; color: string }[],
        ],
        comparisons: [],
        swaps: [],
        sorted: visited.map(v => requests.indexOf(v)).filter(i => i >= 0),
        stepDescription: `Move ${head}->${target} (seek=${seek}). Total seek: ${totalSeek}`,
      });

      visited.push(target);
      head = target;
    }

    this.steps.push({
      data: [...requests],
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: requests.map((_, i) => i),
      stepDescription: `SCAN complete. Total seek distance: ${totalSeek}`,
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
