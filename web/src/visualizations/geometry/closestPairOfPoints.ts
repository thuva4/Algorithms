import type { AlgorithmVisualization, VisualizationState } from '../types';

const COLORS = { current: '#eab308', best: '#22c55e', checking: '#3b82f6' };

export class ClosestPairOfPointsVisualization implements AlgorithmVisualization {
  name = 'Closest Pair of Points';
  private steps: VisualizationState[] = [];
  private currentStepIndex = -1;

  initialize(data: number[]): VisualizationState {
    this.steps = [];
    this.currentStepIndex = -1;
    // Use data as x-coordinates, generate y as scaled values
    const n = Math.min(data.length, 10);
    const points = data.slice(0, n).map((v, i) => ({ x: v, y: data[(i + 1) % n] || v / 2 }));
    // Show distances as bar chart
    const xs = points.map(p => p.x);

    this.steps.push({
      data: xs,
      highlights: [],
      comparisons: [],
      swaps: [],
      sorted: [],
      stepDescription: `Find closest pair among ${n} points (showing x-coordinates)`,
    });

    let bestDist = Infinity;
    let bestI = -1, bestJ = -1;

    for (let i = 0; i < n; i++) {
      for (let j = i + 1; j < n; j++) {
        const dx = points[i].x - points[j].x;
        const dy = points[i].y - points[j].y;
        const dist = Math.sqrt(dx * dx + dy * dy);

        this.steps.push({
          data: xs,
          highlights: [
            { index: i, color: COLORS.checking, label: `P${i}` },
            { index: j, color: COLORS.checking, label: `P${j}` },
          ],
          comparisons: [[i, j]],
          swaps: [],
          sorted: bestI >= 0 ? [bestI, bestJ] : [],
          stepDescription: `Distance(P${i},P${j}) = ${dist.toFixed(2)}, best = ${bestDist === Infinity ? 'inf' : bestDist.toFixed(2)}`,
        });

        if (dist < bestDist) {
          bestDist = dist;
          bestI = i;
          bestJ = j;
          this.steps.push({
            data: xs,
            highlights: [
              { index: i, color: COLORS.best, label: `P${i}` },
              { index: j, color: COLORS.best, label: `P${j}` },
            ],
            comparisons: [],
            swaps: [],
            sorted: [i, j],
            stepDescription: `New closest pair: P${i}-P${j}, distance = ${dist.toFixed(2)}`,
          });
        }
      }
    }

    this.steps.push({
      data: xs,
      highlights: [
        { index: bestI, color: COLORS.best, label: 'Closest' },
        { index: bestJ, color: COLORS.best, label: 'Closest' },
      ],
      comparisons: [],
      swaps: [],
      sorted: [bestI, bestJ],
      stepDescription: `Closest pair: P${bestI}-P${bestJ}, distance = ${bestDist.toFixed(2)}`,
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
